const passport = require('passport');

const CustomError = require('../errorHandler/customError');

const tokenVerify = ( userType ) => {
  return (req, res, next) => {  // use parameters in express middleware
    passport.authenticate('jwt', {session: false}, (err, user, __) => {
      if (err) {
        return next(
          CustomError('InternalServerError', 'JWT authenticate error.')
        )
      }

      if (user.userType !== userType) {
        return next(
          CustomError('Unauthorized', 'Unauthorized user type.')
        )
      }
      if (!user.emailAuthentication) {
        return next(
          CustomError('Unauthorized', 'Unauthorized email.')
        )
      }
      if (userType === 'counselor' && !user.qualification) {
        return next(
          CustomError('Unauthorized', 'Unqualificated counselor.')
        )
      }

      return next();
    })(req, res, next);
  };
}

module.exports = tokenVerify ;