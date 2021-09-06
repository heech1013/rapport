const { validationResult } = require('express-validator/check');

const CustomError = require('../errorHandler/customError');

const validationResultMiddleware = (req) => {
    const validationError = validationResult(req);
    
    if (!validationError.isEmpty()) {
      throw CustomError('ValidationError', `${validationError.array()[0].param} is not valid.`);
    }
}

module.exports = validationResultMiddleware;