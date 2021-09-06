const CustomError = require('../errorHandler/customError');

const fieldValidator = (fieldArr) => {
  const fieldRegEx = /^(family)|(relationship)|(personality)|(emotion)|(sexual)|(addiction)|(lifestyle)|(development)|(study)$/
  
  fieldArr.forEach((field) => {
    if (!fieldRegEx.test(field)) {
      throw CustomError('BadRequest', 'Conditions include wrong field.');
    }
  })
};

module.exports = fieldValidator;