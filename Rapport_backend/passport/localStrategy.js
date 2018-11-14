const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const passportJWT = require('passport-jwt');
const JWTStrataegy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const { User, Counselor } = require('../models');

module.exports = (passport) => {
  /* 일반 사용자용 local strategy */
  passport.use('user-local', new LocalStrategy({
    usernameField: 'email',  // req.body."email"과 일치시키기
    passwordField: 'password'  // req.body."password"와 일치시키기
  }, async (email, password, done) => {
    try {
      /* this one is typically a DB call. Assume that the returned
      user object is pre-formatted and ready fo storing in JWT */
      console.log('user-local Strategy 진입');
      let exUser = await User.find({
         where: { email },
         attributes: ['id', 'userType', 'email', 'password']
      });
      if (exUser) {  // 일치하는 이메일 계정 존재
        let result = await bcrypt.compareSync(password, exUser.password);  // boolean
        if (result) {  // 비밀번호 일치(true)
          done(null, exUser);
        } else {  // 비밀번호 불일치(false)
          done(null, false, { message: '이메일이 존재하지 않거나 비밀번호가 일치하지 않습니다.' });
        }
      } else {  // 없는 이메일 계정
        done(null, false, { message: '이메일이 존재하지 않거나 비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      console.error(error);
      // next(error);  // unhandledrejectionerror: referenceError: 'next' is not definded
    }
  }));

  /* 상담사용 local strategy */
  // jwt 설정 필요
  passport.use('counselor-local', new LocalStrategy({
    usernameField: 'email',  // req.body.email
    passwordField: 'password'  // req.body.password
  }, async (email, password, done) => {
    try {
      /* this one is typically a DB call. Assume that the returned
      user object is pre-formatted and ready fo storing in JWT */
      let exCounselor = await Counselor.find({
        where: { email },
        attributes: ['id', 'userType', 'email', 'password']
     });
      if (exCounselor) {  // 일치하는 email 존재
        let result = await bcrypt.compareSync(password, exCounselor.password);  // boolean
        if (result) {  // 비밀번호 일치(true)
          done(null, exCounselor);
        } else {  // 비밀번호 불일치(false)
          done(null, false, { message: '아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다.' });
        }
      } else {  // 로그인 id 존재하지 않음
        done(null, false, { message: '아이디가 존재하지 않거나 비밀번호가 일치하지 않습니다.' });
      }
    } catch (error) {
      console.error(error);
      // next(error);  // unhandledrejectionerror: referenceError: 'next' is not definded
    }
  }));

  /* it assume that the client will send the JWT token in
    Authorization Header as a Bearer Token. */
  // counselor용 JWTStrategy가 필요
  passport.use(new JWTStrataegy(
    {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
    },
    function (jwtPayload, cb) {
      /* find the user in db if needed. This functionality may be omitted
        if you store everything you'll need in JWT payload. */
      if (jwtPayload.userType == 'user') {
        return User.find({ where: jwtPayload.id })
        .then(user => {
          return cb(null, user);  // user는 어디로 가는가?
        })
        .catch(err => {
          return cb(err);
        });
      }
      else if (jwtPayload.userType == 'counselor') {
        return Counselor.find({ where: jwtPayload.id })
        .then(counselor => {
          return cb(null, counselor);
        })
        .catch(err => {
          return cb(err);
        });
      }
    }
  ));
};