const CustomError = require('../../middlewares/errorHandler/customError');
const { DAYS, WEEK_DAY_COUNT, HOUR_START, HOUR_END } = require('../../lib/constant')

const openValidator = (openObj) => {
    for (let dayIdx = 0; dayIdx < WEEK_DAY_COUNT; dayIdx++) {
      for (let hour = HOUR_START; hour < HOUR_END; hour++) {
        if (
          !openObj[DAYS[dayIdx] + hour]
          && openObj[DAYS[dayIdx] + hour]
        ) {
          throw CustomError('BadRequest', DAYS[dayIdx] + hour + ' is not boolean.');
        }
      }
    }
};

module.exports = openValidator;