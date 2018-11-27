/** 이슈
 * isLoggedIn, isNotLoggedIn 구현
 */
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

/* POST '/login/user' : 로그인 */
// layout.pug의 로그인 form으로부터 정보 전달 받음.
router.post('/', (req, res, next) => {
  passport.authenticate('local', {session: false}, (authError, user, info) => {  // {session:false} : jwt 설정
    if (authError) {
      return res.status(500).json({ serverError: true });
    }
    if (!user) {
      return res.status(401).json({ info });
    }
    return req.login(user, {session: false}, (loginError) => {  // passport 내장함수 login() / req.user 추가? / {session:false} : jwt 설정
      if (loginError) {  // 혹시 모를 에러 방지
        return res.status(500).json({ serverError: true });
      }

      /* generate a signed son web token with the contents of
         user object and return it in the response.
       * You can choose any object to create a token with, as
         long as it will help you identify your user.
       * The idea is, to store the minimum info that you can use
         without having to retrieve the user from the database in
         all the authenticated requests.
       */
      // the payload you are signing needs to be an Object!!!
      const token = jwt.sign(user.dataValues, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION});  // 토큰 만료기간 명시
      return res.status(200).json({ message: 'JWT Login Success', token });  // user정보는 뺐다.
    });
  })(req, res, next);
});


module.exports = router;