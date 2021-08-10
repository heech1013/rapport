const passport = require('passport');
const jwt = require('jsonwebtoken');

const CustomError = require('../middlewares/errorHandler/customError');

/* POST '/login/user' : 로그인 */
const login = async (req, res, next) => {
    passport.authenticate('local', {session: false}, (authError, user, info) => {
      if (authError) {
        return next(authError);
      }
      if (!user) {
        return next(
          CustomError('Unauthorized', info)
        )
      }
      return req.login(user, {session: false}, (loginError) => {
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
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '12h' });  // 토큰 만료기간 명시
        return res.status(200).json({ success: true, token });
      });
    })(req, res, next);
  };

module.exports = login;