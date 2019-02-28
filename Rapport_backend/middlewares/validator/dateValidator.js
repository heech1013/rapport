const CustomError = require('../errorHandler/customError');

const dateValidator = (date) => {
  return new Promise((resolve, reject) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;
    const d = new Date(date);
    if (!date.match(regEx)) {  // Invalid format
      console.log('========dont match==', date);
      reject(
        CustomError('ValidationError', 'Date is not valid.')
      );
    }
    else if (Number.isNaN(d.getTime())) {  // Invalid date
      reject(
        CustomError('ValidationError', 'Date is not valid.')
      );
    }
    else resolve();
  })
}

module.exports = dateValidator;