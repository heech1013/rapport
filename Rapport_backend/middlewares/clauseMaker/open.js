const addDays = require('date-fns/add_days');
const format = require('date-fns/format');
const { Op } = require('../../models').Sequelize;

const CustomError = require('../errorHandler/customError');

const openClauseMaker = (date) => {
  return new Promise((resolve, reject) => {
    if (date.length) {
      const week = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
      const numOfDay = new Date(date).getDay();
      const day = week[numOfDay];
      const dayConditionArray = [];
      for (let i = 0; i <= 23; i++) {
        let dayCon = {};
        dayCon[day + i] = true;
        dayConditionArray.push(dayCon);
      }

      const openClause = {
        [Op.or]: dayConditionArray,
        startDate: { [Op.lte]: date },  // startDate가 null인 경우: 해당 x
        [Op.or]: [
          { endDate: { [Op.gte]: format(addDays(date, 28), 'YYYY-MM-DD') } },
          { endDate : null }
        ]
      }

      resolve(openClause);
    } else {
      reject(
        CustomError('BadRequest', 'Date filter is null.')
      )
    }
  });
}

module.exports = openClauseMaker;

/*
  {
    model: Open,
    as: 'Open',
    attributes: ['id'],

    where: {
      [Op.or]: exClause,
      // [Op.or]: [{MON9:true}, {MON10:true}, {MON11:true}, {MON12:true}, {MON13:true}, {MON14:true}, {MON15:true}, {MON16:true}, {MON17:true}, {MON18:true}],
      startDate: {
        [Op.lte]: 2019-02-12
      },
      endDate: {
        [Op.gte]: 2019-02-12
      }
    }
  }
*/