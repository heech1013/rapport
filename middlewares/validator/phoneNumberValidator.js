const CustomError = require('../errorHandler/customError');

const phoneNumberValidator = (phoneNumber) => {
  const phoneNumberRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
  
  if (!phoneNumberRegExp.test(phoneNumber)) {
    throw CustomError('ValidationError', 'PhoneNumber is not valid.')
  }
}

module.exports = phoneNumberValidator;