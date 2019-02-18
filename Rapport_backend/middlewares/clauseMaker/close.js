const { Op } = require('../../models').Sequelize;

const CustomError = require('../errorHandler/customError');

const closeClauseMaker = (date) => {
  return new Promise((resolve, reject) => {
    if (date.length) {
      const closeClause = {
        date: {
          [Op.notIn]: [date]
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