const fiveSessionArrMaker = require('../dateMaker/fiveSessionArray');
const { Op } = require('../../models').Sequelize;

const CustomError = require('../errorHandler/customError');

const closeClauseMaker = (date) => {
  if (!date.length) {
    throw CustomError('BadRequest', 'Date filter is null.')
  }

  const fiveSessionArr = fiveSessionArrMaker(date)

  return {
    date: {
      [Op.in]: fiveSessionArr,
    },
  }
}

module.exports = closeClauseMaker;