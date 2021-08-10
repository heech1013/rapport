const addDays = require('date-fns/add_days');
const format = require('date-fns/format');

const calcLeftSessionDate = (date, session) => {
  const dateArr = [date]

  for (let leftSession = 5 - session; leftSession <= 5; leftSession++) {
    dateArr.push(format(addDays(date, i * 7), 'YYYY-MM-DD'))
  }

  return dateArr
}

module.exports = calcLeftSessionDate;