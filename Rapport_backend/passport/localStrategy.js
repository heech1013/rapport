const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const passportJWT = require('passport-jwt');
const JWTStrataegy = passportJWT.Strategy;
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
          attributes: ['id', 'userType', 'email', 'password']
      });
      if (exUser) {  // 일치하는 이메일 계정 존재
        let result = await bcrypt.compareSync(password, exUser.password);  // boolean
        if (result) {  // 비밀번호 일치(true)
          done(null, exUser);  // done()은 login.js의 authenticate 함수로 이동
        } else {  // 비밀번호 불일치(false)
          done(null, false, { authFail: true });
        }
      } else {  // 없는 이메일 계정
        done(null, false, { authFail: true });
      }
    } catch (error) {
      next(error);  // unhandledrejectionerror: referenceError: 'next' is not definded
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
      User.find({ where: jwtPayload.id })
        .then(user => {
          return cb(null, user);  // user는 어디로 가는가?
        })
        .catch(err => {
          return cb(err);
        });
    }
  ));
};