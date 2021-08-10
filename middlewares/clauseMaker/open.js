const addDays = require('date-fns/add_days');
const format = require('date-fns/format');
const { Sequelize } = require('../../models');
const { Op } = Sequelize
const CustomError = require('../errorHandler/customError');

const FIRST_HOUR = 0, LAST_HOUR = 23

const openClauseMaker = (date) => {
  if (!date.length) {
    throw CustomError('BadRequest', 'Date filter is null.')
  }

  const weekArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const dayNum = new Date(date).getDay()
  const dayStr = weekArr[dayNum]

  const dayCondArr = []

  for (let hour = FIRST_HOUR; hour <= LAST_HOUR; hour++) {
    const dayHour = `${dayStr}${hour}`
    dayCondArr.push({ [dayHour]: 1 })
  }

  const openClause = {
    [Op.or]: dayCondArr,
    startDate: {
      [Op.lte]: date
    },
    [Op.or]: [
      {
        endDate: {
          [Op.gte]: format(addDays(date, 28), 'YYYY-MM-DD')
        },
      },
      { endDate : null }
    ]
  }

  return openClause

}

module.exports = openClauseMaker