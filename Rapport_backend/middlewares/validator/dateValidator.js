const customError = require('../errorHandler/customError');

const nickValidator = (date) => {
  return new Promise((resolve, reject) => {
    const dateRegExp = /([12]\d{3}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01]))/;
    if (!dateRegExp.test(date)) {
      reject(
        customError('ValidationError', 'Date is not valid.')
      );
    } else resolve();
  })
}

module.exports = nickValidator;