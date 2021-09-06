const CustomError = require('../errorHandler/customError');

const locationValidator = (locationArr) => {
  const locationRegEx = /^(GS)|(YC)|(GR)|(YDP)|(DJ)|(GC)|(GA)|(SC)|(GN)|(SP)|(GD)|(MP)|(EP)|(SDM)|(JN)|(YS)|(SB)|(GB)|(DB)|(NW)|(JNg)|(DDM)|(SD)|(GJ)|(JG)/;
  
  locationArr.forEach((location) => {
    if (!locationRegEx.test(location)) {
      throw CustomError('BadRequest', 'Conditions include wrong location.');
    }
  })
};

module.exports = locationValidator;