const { validationResult } = require('express-validator/check');

const CustomError = require('../errorHandler/customError');

const validationResult = () => {
  return (req, res, next) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return next( CustomError( 'ValidationError', validationError.array() ));
    }
  }
}

module.exports = validationResult;