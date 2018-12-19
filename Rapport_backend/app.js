const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
require('dotenv').config();  // .env를 환경변수로 설정

const apiController = require('./routes');
const { sequelize } = require('./models');

const app = express();

sequelize.sync();
require('./passport/strategy')(passport);

app.set('port', process.env.PORT || 5959);  // .env에서 배포용 PORT 따로 지정
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));  // 서버에 요청 로그 기록 (combined, short, common, tiny)
  app.use(helmet());  // 보안 설정
  app.use(hpp());  // 보안 (hpp 공격 방지)
} else {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());  // initialize passport authentication module
app.use('/', apiController);

/* error handling */
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ serverError: true });
});

/* server start */
app.listen(app.get('port'), () => {
  console.log(`server start in port: ${app.get('port')}!`);
});

{
  // const cookieParser = require('cookie-parser');
  // const session = require('express-session');
  //const mysql = require('mysql2');
  // const MySQLStore = require('express-mysql-session');  // mysql에 세션을 저장. redis로 갈아타면 삭제하기
  //const RedisStore = require('connect-redis')(session);  // redis 서버에 세션 저장
  // const flash = require('connect-flash');  // 경고창(?) 띄우기
  }

  {
    // app.use(cookieParser(process.env.COOKIE_SECRET));  // .env 참고
    // const sessionOption = {  // 옵션 다시 확인해보기
    //   resave: false,  // false 권장
    //   saveUninitialized: false,  // false 권장
    //   secret: process.env.COOKIE_SECRET,
    //   cookie: {
    //     httpOnly: true,
    //     secure: false,  // https 설정. 배포시 밑의 if문으로 인해 true로 변환됨.
    //   },
    //   store: new MySQLStore(  // passport용 session 관리. / 추후 세션을 redis서버에 저장하게 될 경우 변경 -> store: new RedisStore({ ... })
    //     {
    //       host: config.host,
    //       port: 3306,
    //       user: config.user,
    //       password: config.password,
    //       database: config.database,
    //     }
    //   )
    // }
    // if (process.env.NODE_ENV === 'production') {
    //   //sessionOption.cookie.secure = true;  // https 설정
    // }
    // app.use(session(sessionOption));
    }