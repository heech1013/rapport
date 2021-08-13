const addDays = require('date-fns/add_days');
const format = require('date-fns/format');
const { Sequelize } = require('../models');
const { Op } = Sequelize
const CustomError = require('../middlewares/errorHandler/customError');
const { HOUR_START, HOUR_END, DAYS }  = require('../lib/constant')

const createOpenClause = (date) => {
  if (!date.length) {
    throw CustomError('BadRequest', 'Date filter is null.')
  }

  const dayNum = new Date(date).getDay()
  const dayStr = DAYS[dayNum]

  const dayCondArr = []

  for (let hour = HOUR_START; hour < HOUR_END; hour++) {
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

module.exports = createOpenClause