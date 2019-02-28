const CustomError = require('../errorHandler/customError');

const locationValidator = (locationArr) => {
  return new Promise((resolve, reject) => {
    const locationRegEx = /^(GS)|(YC)|(GR)|(YDP)|(DJ)|(GC)|(GA)|(SC)|(GN)|(SP)|(GD)|(MP)|(EP)|(SDM)|(JN)|(YS)|(SB)|(GB)|(DB)|(NW)|(JNg)|(DDM)|(SD)|(GJ)|(JG)/;
    
    for (let i = 0; i < locationArr.length; i++) {
      if (!locationRegEx.test(locationArr[i])) {
        reject(CustomError('BadRequest', 'Conditions include wrong location.'))
      } else if (i === locationArr.length - 1) resolve();
    }
  })
};

module.exports = locationValidator;