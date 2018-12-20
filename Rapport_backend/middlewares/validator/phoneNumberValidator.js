const customError = require('../errorHandler/customError');

const phoneNumberValidator = (phoneNumber) => {
  return (req, res, next) => {
    const phoneNumberRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneNumberRegExp.test(phoneNumber)) {
      return next(
        customError('ValidationError', 'PhoneNumber validation error.')
      );
    }
  }
}

module.exports = phoneNumberValidator;