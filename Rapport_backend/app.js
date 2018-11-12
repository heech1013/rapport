/** 이슈
 * .env파일 - process.env.NODE_ENV: npm start(배포버전)시 NODE_ENV와 PORT를 production(배포)용으로 설정해야 한다.
 * package.json - script 수정 필요(개발용/배포용 분리)
 * mysql, mysql2 확인해서 package 정리 필요
 * '/counselor/1' 등 url을 통해 라우터/DB 구조가 그대로 드러나는 보안 문제 해결 필요
 * createdAt, updatedAt이 시차가 다르게 들어감(AWS RDS - 파라미터 그룹이나 옵션 그룹 생성해서 타임존 서울리전으로 설정 필요)
 * 세션관리 redis로 갈아타기
 * 오류처리 미들웨어 점검 필요
 * 상담사의 오픈한 상담케이스 관리 페이지 필요(오픈한 케이스 삭제 기능, 예약 확정 기능 등)
 * layout.pug에서 사용자 로그인 뿐 아니라 상담사 로그인 시 로그인 화면 제거 처리
 * 로그인이 필요하지만 로그인되어있지 않은 사용자-> 로그인페이지로 redirect(client단에서 처리 필요)
 * jwt 도입으로 인해 session 관련 모듈/미들웨어 필요성 검토 필요.
 */

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
//const mysql = require('mysql2');
const MySQLStore = require('express-mysql-session');  // mysql에 세션을 저장. redis로 갈아타면 삭제하기
//const RedisStore = require('connect-redis')(session);  // redis 서버에 세션 저장
const flash = require('connect-flash');  // 경고창(?) 띄우기
const helmet = require('helmet');  // 보안 설정
const hpp = require('hpp');  // 보안 설정
require('dotenv').config();  // .env를 환경변수로 설정
const env = process.env.NODE_ENV || 'development';  // NODE_ENV가 따로 정의되지 않으면 개발용.
const config = require('./config/config')[env];

const { sequelize } = require('./models');
const passportConfig = require('./passport');
const indexRouter = require('./routes/page');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');
const counselorRouter = require('./routes/counselor');
const caseRouter = require('./routes/case');
const reservationRouter = require('./routes/reservation');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.PORT || 5959);  // 배포시 .env에서 따로 PORT 지정 필요.

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));  // 서버에 요청 로그 기록. combined, short, common, tiny 중에 고려 필요
  app.use(helmet());  // 보안 설정
  app.use(hpp());  // 보안 설정
} else {
  app.use(morgan('dev'));
}
app.use(express.json());  // body-parser 설정
app.use(express.urlencoded({ extended: false }));  // body-parser 설정
app.use(cookieParser(process.env.COOKIE_SECRET));  // .env 참고
const sessionOption = {  // 옵션 다시 확인해보기
  resave: false,  // false 권장
  saveUninitialized: false,  // false 권장
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,  // https 설정. 배포시 밑의 if문으로 인해 true로 변환됨.
  },
  store: new MySQLStore(  // passport용 session 관리. / 추후 세션을 redis서버에 저장하게 될 경우 변경 -> store: new RedisStore({ ... })
    {
      host: config.host,
      port: 3306,
      user: config.user,
      password: config.password,
      database: config.database,
    }
  )
}
if (process.env.NODE_ENV === 'production') {
  //sessionOption.cookie.secure = true;  // https 설정
}
app.use(session(sessionOption));
app.use(passport.initialize());  // passport 초기화
app.use(passport.session());  // passport session 설정
app.use(flash());  // 경고창 띄우기.

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/counselor', counselorRouter);
app.use(
  '/case',
  passport.authenticate('jwt', {session: false}),  // jwt 토큰을 확인하는 라우터
  caseRouter
);
app.use(
  '/reservation',
  passport.authenticate('jwt', {session: false}),  // jwt 토큰을 확인하는 라우터
  reservationRouter
);

/* 오류처리 미들웨어 */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

/* 서버 구동 */
app.listen(app.get('port'), () => {
  console.log(`${app.get('port')}번 포트에서 서버 실행중입니다.`);
});