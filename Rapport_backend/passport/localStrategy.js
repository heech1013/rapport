const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',  // req.body."email"과 일치시키기
    passwordField: 'password'  // req.body."password"와 일치시키기
  }, async (email, password, done) => {
    try {
      /* this one is typically a DB call. Assume that the returned
      user object is pre-formatted and ready fo storing in JWT */
      let exUser = await User.find({
          where: { email },
          attributes: ['id', 'userType', 'password', 'emailAuthentication', 'qualification']  // 권한을 사용, 확인하기 위한 최소한의 정보만 추출 (jwt token). 비밀번호는 일치여부 확인 후 삭제한다.
      });
      if (exUser) {  // 일치하는 이메일 계정 존재
        let result = await bcrypt.compareSync(password, exUser.password);  // boolean
        if (result) {  // 비밀번호 일치(true)
          const reUserObj = { id: exUser.id, userType: exUser.userType, emailAuthentication: exUser.emailAuthentication, qualification: exUser.qualification };  // 보안을 위해, 토큰 권한 확인에 필요없는 정보인 비밀번호를 제거한 객체를 재생성한다.
          done(null, reUserObj);  // done()은 login.js의 authenticate 함수로 이동
        } else {  // 비밀번호 불일치(false)
          done(null, false, { authFail: true });
        }
      } else {  // 없는 이메일 계정
        done(null, false, { authFail: true });
      }
    } catch (error) {
      done(error);
    }
  }));

  /* it assume that the client will send the JWT token in
    Authorization Header as a Bearer Token. */
  passport.use(new JWTStrategy(
    {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
    },
    // By default, if authenticate fails, passport will respond with a 401 Unauthorized status
    // 따라서 app.js의 jwt 검증 미들웨어에서 user를 못 받을 경우의 에러처리를 하지 않겠다(자동으로 401 Unauthorized 처리)
    function (jwtPayload, done) {
      /* find the user in db if(!!) needed. This functionality may be omitted
        if you store everything you'll need in JWT payload. */
      done(null, jwtPayload);  // app.js의 jwt authenticate 미들웨어로 전달
      // User.findOne({ where: { id: jwtPayload.id } })
      //   .then(user => {
      //     return done(null, user);
      //   })
      //   .catch(error => {
      //     return done(error);
      //   });
    }
  ));
};