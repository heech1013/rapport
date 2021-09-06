const CustomError = require('../errorHandler/customError');

const closeValidator = (closeArr) => {
    const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegEx = /^([0-9]{1}|1[0-9]{1}|2[0-3])$/; // 0 ~ 23

    closeArr.forEach((close) => {
      // Invalid format date
      if (!close.date.match(dateRegEx)) {
        throw CustomError('ValidationError', 'Date is not valid.')
      }

      // Invalid date
      if (Number.isNaN(new Date(close.date).getTime())) {
        throw CustomError('ValidationError', 'Date is not valid.')
      }

      // Invalid time range
      if (!close.time.toString().match(timeRegEx)) {
        throw CustomError('BadRequest',  'Time is not valid.')
      }
    })
}

module.exports = closeValidator;