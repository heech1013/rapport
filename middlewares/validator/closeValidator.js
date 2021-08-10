const CustomError = require('../errorHandler/customError');
// const dateValidator = require('./dateValidator');

const closeValidator = (closeArr) => {
  return new Promise((resolve, reject) => {
    const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegEx = /^([0-9]{1}|1[0-9]{1}|2[0-3])$/;  // 0 ~ 23
    closeArr.forEach((obj) => {
      const d = new Date(obj["date"]);
      if (!obj["date"].match(dateRegEx)) {  // Invalid format date
        reject(
          CustomError('ValidationError', 'Date is not valid.')
        );
      }
      else if (Number.isNaN(d.getTime())) {  // Invalid date
        reject(
          CustomError('ValidationError', 'Date is not valid.')
        );
      }

      if (!obj["time"].toString().match(timeRegEx)) {
        reject(CustomError('BadRequest',  'Time is not valid.'))
      }
    })
    
    resolve();
  })
}

module.exports = closeValidator;