const passport = require('passport');

const CustomError = require('../errorHandler/customError');

const tokenVerify = ( userType ) => {
  return (req, res, next) => {  // use parameters in express middleware
    passport.authenticate('jwt', { session: false}, (err, user, __) => {
      if (err) { next( CustomError('InternalServerError', 'JWT authenticate error.')) }
      
      switch (userType) { 
        case 'counselor' :
        if (user.userType !== 'counselor' || !user.emailAuthentication || !user.qualification) { next( CustomError('Unauthorized', 'Unauthorized counselor.')) };
  
        case 'client' :
        if (user.userType !== 'client' || !user.emailAuthentication) { next( CustomError('Unauthorized', 'Unauthorized client.'))};
  
        case 'manager' :
        if (user.userType !== 'manager') { next( CustomError('Unauthorized', 'Unauthorized manager.'))};
  
        default :
        return next( CustomError('InternalServerError', 'JWT authenticate error.'));
      }
    });
  };
}

module.exports = tokenVerify ;