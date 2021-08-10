const CustomError = require('../../middlewares/errorHandler/customError');

const openValidator = (openObj) => {
  return new Promise((resolve, reject) => {
    let dayArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 23; j++) {
        if (openObj[dayArr[i] + j] !== true && openObj[dayArr[i] + j] !== false) {
          reject(CustomError('BadRequest', dayArr[i] + j + ' is not boolean.'))
        }
        else if (i === 6 && j === 23) resolve();
      }
    }
  })
};

module.exports = openValidator;