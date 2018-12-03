/** 이슈
 * 성능 개선: deserializeUser DB조회 캐싱?
 * multiple local strategy from different model(참고: https://mjvolk.com/implement-multiple-local-user-authentication-strategies-in-passport-js/)
 * jwt 도입으로 인해, de/serialize는 잠시 주석처리. 다만 localstrategy의 실행과( local(passport); ) 추후 확장성을 고려하여 파일을 남겨놓는다.
 */
const local = require('./localStrategy');
// const { User, Counselor } = require('../models');

// function SessionConstructor(userId, userGroup, details) {
//   this.userId = userId;
//   this.userGroup = userGroup;
//   this.details = details;
// };

module.exports = (passport) => {
  local(passport);
  // passport.serializeUser(function (user, done) {  // req.session.passport.user에 저장
  //   console.log('serializeUser 진입');
  //   let userGroup = "";
  //   if (user.userType == 'user') {
  //     userGroup = "user-model";
  //   } else if (user.userType == 'counselor') {
  //     userGroup = "counselor-model";
  //   }
  //   let sessionConstructor = new SessionConstructor(user.id, userGroup, '');
  //   done(null, sessionConstructor);
  // });

  // passport.deserializeUser(function (sessionConstructor, done) {
  //   console.log('deserializeUser 진입');
  //   if (sessionConstructor.userGroup == "user-model") {
  //     User.find({ where: { id: sessionConstructor.userId }})
  //       .then((user) => {
  //         // res.json({ clientLogged:true, counselorLogged:false });  // 클라이언트 측으로 로그인 종류 및 여부 전송
  //         return done(null, user)
  //       })
  //       .catch(err => done(err));
  //   } else if (sessionConstructor.userGroup == "counselor-model") {
  //     Counselor.find({ where: { id: sessionConstructor.userId }})
  //       .then((user) => {
  //         // res.json({ clientLogged:false, counselorLogged:true });  // 클라이언트 측으로 로그인 종류 및 여부 전송
  //         return done(null, user)
  //       })
  //       .catch(err => done(err));
  //   } else {
  //     console.log('passport.deserializeUser 에러');
  //   }
  // });
  
};

// 메인이나.. 상담자 프로필 관리, 케이스 등록 등 user와 counselor 로그인을 구분할 수있도록 조치. 그 후 상담사 프로필 수정 혹은 케이스 등록 페이지 제작 필요.