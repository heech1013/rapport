const CustomError = require('../errorHandler/customError');

const { User } = require('../../models');

const overlapTester = (row, val) => {
  return async (req, res, next) => {
    try{
      if (row === 'email') {
        const exData = await User.findAll({ where: { email : val }});
      }

      switch (row) {
        case 'email' :
          const exData = await User.findAll({ where: { email : val }});
          if (exData) {
            return next(
              CustomError('OverlapError', `${row} overlapped.`)
            )
          }    

        case 'nick' :
          const exData = await User.findAll({ where: { nick : val }});
          if (exData) {
            return next(
              CustomError('OverlapError', `${row} overlapped.`)
            )
          }
        default :
          return next(
            CustomError('InternalServerError')
          );
      }
      
      
    } catch (error) {
      next(error);
    }
    
  }
}

module.exports = overlapTester;