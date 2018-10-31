/** 이슈
 * 성능 개선: deserializeUser DB조회 캐싱?
 * multiple local strategy from different model(참고: https://mjvolk.com/implement-multiple-local-user-authentication-strategies-in-passport-js/)
 */
const local = require('./localStrategy');
const { User, Counselor } = require('../models');

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
};

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    let userGroup = "";
    if (user.userType == 'user') {
      userGroup = "user-model";
    } else if (user.userType == 'counselor') {
      userGroup = "counselor-model";
    }
    let sessionConstructor = new SessionConstructor(user.id, userGroup, '');
    done(null, sessionConstructor);
  });

  passport.deserializeUser(function (sessionConstructor, done) {
    if (sessionConstructor.userGroup == "user-model") {
      User.find({ where: { id: sessionConstructor.userId }})
        .then(user => done(null, user))
        .catch(err => done(err));
    } else if (sessionConstructor.userGroup == "counselor-model") {
      Counselor.find({ where: { id: sessionConstructor.userId }})
        .then(user => done(null, user))
        .catch(err => done(err));
    } else {
      console.log('passport.deserializeUser 에러');
    }
  });

  local(passport);
};

// 메인이나.. 상담자 프로필 관리, 케이스 등록 등 user와 counselor 로그인을 구분할 수있도록 조치. 그 후 상담사 프로필 수정 혹은 케이스 등록 페이지 제작 필요.