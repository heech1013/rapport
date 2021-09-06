const CustomError = require('../errorHandler/customError');

const dateValidator = (date) => {
    const regEx = /^\d{4}-\d{2}-\d{2}$/;

    // Invalid format
    if (!date.match(regEx)) {
      throw CustomError('ValidationError', 'Date is not valid.');
    }

    // Invalid date
    if (Number.isNaN(new Date(date).getTime())) {
      throw CustomError('ValidationError', 'Date is not valid.');
    }
}

module.exports = dateValidator;