/** 이슈
 * isLoggedIn, isNotLoggedIn 구현
 */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

/* GET '/login/counselor' : 상담사용 로그인(view 요청) */
router.get('/counselor', (req, res, next) => {
  res.render('login_counselor');
});

/* POST '/login/counselor' : 상담사용 로그인 */
router.post('/counselor', (req, res, next) => {
  passport.authenticate('counselor-local',{session: false}, (authError, counselor, info) => {  // {session:false} : jwt 설정
    // localStrategy.js의 done(에러, 성공, 실패) 결과에 따라 authError(에러), counselor(성공), info(실패-메시지)를 전달받는다.
    // authenticate의 첫번째 인자를 통해 각자 다른 두개의 local strategy를 구별(user용 login과 counselor용 login)
    if (authError) {
      console.error(authError);
      res.status(500).json({ message: 'Authenticate error' });  //
      return next(authError);
    }
    if (!counselor) {
      res.status(401).json({ message: info.message });  //
      return;
    }
    return req.login(counselor, {session: false}, (loginError) => {  // passport 내장함수 login() / req.user 추가됨(req.counselor 추가?? 아니면 req.user로 추가??) / 변수명을 user 대신 counselor로 해도 되는지 불확실. / {session:false} : jwt 설정
      if (loginError) {
        console.error(loginError);
        res.status(500).send(loginError);  //
        return next(loginError);
      }
      /* generate a signed son web token with the contents of
         user object and return it in the response.
       * You can choose any object to create a token with, as
         long as it will help you identify your user.
       * The idea is, to store the minimum info that you can use
         without having to retrieve the user from the database in
         all the authenticated requests.
       */
      const token = jwt.sign(counselor, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});  // 토큰 만료기간 명시
      return res.status(200).json({ counselor, token });
    });
  })(req, res, next);
});


/* POST '/login/user' : 일반 사용자용 로그인*/
// layout.pug의 일반 사용자 로그인 form으로부터 정보 전달 받음.
router.post('/user', (req, res, next) => {
  passport.authenticate('user-local', {session: false}, (authError, user, info) => {  // {session:false} : jwt 설정
    if (authError) {
      console.error(authError);
      res.status(500).json({ message: 'Authenticate error' });  //
      return next(authError);
    }
    if (!user) {
      res.status(401).json({ message: info.message });  //
      return;
    }
    return req.login(user, {session: false}, (loginError) => {  // passport 내장함수 login() / req.user 추가 / {session:false} : jwt 설정
      if (loginError) {  // 혹시 모를 에러 방지
        console.error(loginError);
        res.status(500).send(loginError);  //
        return next(loginError);
      }

      /* generate a signed son web token with the contents of
         user object and return it in the response.
       * You can choose any object to create a token with, as
         long as it will help you identify your user.
       * The idea is, to store the minimum info that you can use
         without having to retrieve the user from the database in
         all the authenticated requests.
       */
      const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});  // 토큰 만료 기간 명시
      return res.status(200).json({ user, token });
    });
  })(req, res, next);
});


module.exports = router;