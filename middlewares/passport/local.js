const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const validationResult = require('../validator/validationResult');

const { User } = require('../../models');

dotenv.config();

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',  // req.body."email"과 일치시키기
    passwordField: 'password',  // req.body."password"와 일치시키기
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      await validationResult(req);
      /* this one is typically a DB call. Assume that the returned
      user object is pre-formatted and ready fo storing in JWT */
      const exUser = await User.findOne({
          where: { email },
          attributes: ['id', 'userType', 'password', 'qualification']  // 권한을 사용, 확인하기 위한 최소한의 정보만 추출 (jwt token). 비밀번호는 일치여부 확인 후 삭제한다.
      });
      if (exUser) {  // 일치하는 이메일 계정 존재
        const result = await bcrypt.compare(password, exUser.password);  // boolean
        if (result) {  // 비밀번호 일치(true)
          const reUserObj = { id: exUser.id, userType: exUser.userType, qualification: exUser.qualification };  // 보안을 위해, 토큰 권한 확인에 필요없는 정보인 비밀번호를 제거한 객체를 재생성한다.
          done(null, reUserObj);  // done()은 login.js의 authenticate 함수로 이동
        } else {  // 비밀번호 불일치(false)
          done(null, false, 'Wrong email or password.');
        }
      } else {  // 없는 이메일 계정
        done(null, false, 'Wrong email or password.');
      }
    } catch (error) {
      done(error);
    }
  }));
};