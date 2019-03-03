const fiveSessionArrMaker = require('../dateMaker/fiveSessionArray');
const { Op } = require('../../models').Sequelize;

const CustomError = require('../errorHandler/customError');

const closeClauseMaker = (date) => {
  return new Promise( async(resolve, reject) => {
    if (date.length) {
      const fiveSessionArr = await fiveSessionArrMaker(date);
      const closeClause = {
        date: {
          [Op.in]: fiveSessionArr
        }
      };
      resolve(closeClause);
    } else {
      reject(
        CustomError('BadRequest', 'Date filter is null.')
      )
    }
  });
}

module.exports = closeClauseMaker;