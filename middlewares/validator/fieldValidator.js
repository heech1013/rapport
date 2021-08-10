const CustomError = require('../errorHandler/customError');

const fieldValidator = (fieldArr) => {
  return new Promise((resolve, reject) => {
    const fieldRegEx = /^(family)|(relationship)|(personality)|(emotion)|(sexual)|(addiction)|(lifestyle)|(development)|(study)$/
    for (let i = 0; i < fieldArr.length; i++) {
      if (!fieldRegEx.test(fieldArr[i])) {
        reject(CustomError('BadRequest', 'Conditions include wrong field.'))
      } else if (i === fieldArr.length - 1) resolve();
    }
  })
};

module.exports = fieldValidator;