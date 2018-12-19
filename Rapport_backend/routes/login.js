const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* POST '/login/user' : 로그인 */
router.post('/', (req, res, next) => {
  passport.authenticate('local', {session: false}, (authError, user, info) => {  // {session:false} : jwt 설정
    if (authError) {
      return next(authError);
    }
    if (!user) {
      return res.status(401).json({ info });
    }
    return req.login(user, {session: false}, (loginError) => {  // passport 내장함수 login() / {session:false} : jwt 설정
      if (loginError) {
        return next(loginError);
      }
      /* generate a signed son web token with the contents of
         user object and return it in the response.
       * You can choose any object to create a token with, as
         long as it will help you identify your user.
       * The idea is, to store the minimum info that you can use
         without having to retrieve the user from the database in
         all the authenticated requests. => id, userType으로 설정
       */
      // the payload(jwt.sign의 첫번째 인자) you are signing needs to be an Object!
      // expiresIn: 300 안되고 60*5 혹은 '1h'. 닷env로 하면 안됌(왠지는 잘 모르겠다)
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });  // 토큰 만료기간 명시
      return res.status(200).json({ message: 'JWT Login Success', token });
    });
  })(req, res, next);
});

module.exports = router;