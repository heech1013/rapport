/** 이슈
 * isLoggedIn, isNotLoggedIn 구현
 */
const express = require('express');
const passport = require('passport');

const router = express.Router();

/* GET '/login/counselor' : 상담사용 로그인(view 요청) */
router.get('/counselor', (req, res, next) => {
  res.render('login_counselor');
});

/* POST '/login/counselor' : 상담사용 로그인 */
router.post('/counselor', (req, res, next) => {
  passport.authenticate('counselor-local', (authError, counselor, info) => {
    // localStrategy.js의 done(에러, 성공, 실패) 결과에 따라 authError(에러), counselor(성공), info(실패-메시지)를 전달받는다.
    // authenticate의 첫번째 인자를 통해 각자 다른 두개의 local strategy를 구별(user용 login과 counselor용 login)
    if (authError) {
      console.error(authError);
      res.status = 500; // 클라이언트로 오류 정보 전송(500)
      res.json({ clientSuccess:false, counselorSuccess:false });  //
      return next(authError);
    }
    if (!counselor) {
      req.flash('loginError', info.message);
      res.status = 401;  // 클라이언트로 로그인 실패 정보 전송(401)
      res.json({ clientSuccess:false, counselorSuccess:false });  //
      //return res.redirect('/');
      return;
    }
    return req.login(counselor, (loginError) => {  // passport 내장함수 login() / req.user 추가됨(req.counselor 추가?? 아니면 req.user로 추가??) / 변수명을 user 대신 counselor로 해도 되는지 불확실.
      if (loginError) {
        console.error(loginError);
        res.status = 500;  // 클라이언트로 오류 정보 전송(500)
        res.json({ clientSuccess:false, counselorSuccess:false });  //
        return next(loginError);
      }
      res.status = 200;  // 클라이언트로 상태코드 및 로그인된 user 정보 전송(200)
      res.json({ clientSuccess:false, counselorSuccess : true });  //
      //return res.redirect('/');
      return;
    });
  })(req, res, next);
});


/* POST '/login/user' : 일반 사용자용 로그인*/
// layout.pug의 일반 사용자 로그인 form으로부터 정보 전달 받음.
router.post('/user', (req, res, next) => {
  passport.authenticate('user-local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      res.status = 500; // 클라이언트로 오류 정보 전송(500)
      res.json({ clientSuccess:false, counselorSuccess:false });  //
      return next(error);
    }
    if (!user) {
      req.flash('loginError', info.message);
      res.status = 401;  // 클라이언트로 로그인 실패 정보 전송(401)
      res.json({ clientSuccess:false, counselorSuccess:false });  //
      //return res.redirect('/');
      return;
    }
    return req.login(user, (loginError) => {  // passport 내장함수 login() / req.user 추가
      if (loginError) {  // 혹시 모를 에러 방지
        console.error(loginError);
        res.status = 500;  // 클라이언트로 오류 정보 전송(500)
        res.json({ clientSuccess:false, counselorSuccess:false});  //
        return next(loginError);
      }
      res.status = 200;  // 클라이언트로 상태코드 및 로그인된 user 정보 전송(200)
      res.json({ clientSuccess:true, counselorSuccess:false });  //
      //return res.redirect('/');
      return;
    });
  })(req, res, next);
});


module.exports = router;