const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const { User, Counselor } = require('../models');

module.exports = (passport) => {
  /* 일반 사용자용 local strategy */
  passport.use('user-local', new LocalStrategy({
    usernameField: 'email',  // req.body."email"과 일치시키기
    passwordField: 'password'  // req.body."password"와 일치시키기
  }, async (email, password, done) => {
    try {
      let exUser = await User.find({ where: { email }});
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
      next(error);
    }
  }));

  /* 상담사용 local strategy */
  passport.use('counselor-local', new LocalStrategy({
    usernameField: 'email',  // req.body.email
    passwordField: 'password'  // req.body.password
  }, async (email, password, done) => {
    try {
      let exCounselor = await Counselor.find({ where: { email }});
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
      next(error);
    }
  }));
};