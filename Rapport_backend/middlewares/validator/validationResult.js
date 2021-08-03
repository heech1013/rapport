const { validationResult } = require('express-validator/check');

const CustomError = require('../errorHandler/customError');

const validationResultMiddleware = (req) => {
  return new Promise((resolve, reject) => {
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      reject(
        CustomError('ValidationError', `${validationError.array()[0].param} is not valid.`)
      );
    } else resolve();
  })
}

module.exports = validationResultMiddleware;