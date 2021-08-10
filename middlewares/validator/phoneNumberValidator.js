const CustomError = require('../errorHandler/customError');

const phoneNumberValidator = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    const phoneNumberRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneNumberRegExp.test(phoneNumber)) {
      reject(
        CustomError('ValidationError', 'PhoneNumber is not valid.')
      );
    } else resolve();
  })
}

module.exports = phoneNumberValidator;