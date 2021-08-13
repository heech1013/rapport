const WHOLE_SESSION_COUNT = 5

const addDays = require('date-fns/add_days');
const format = require('date-fns/format');

const calcLeftSessionDate = (date, session) => {
  const dateArr = []

  for (let leftSession = 0; leftSession <= WHOLE_SESSION_COUNT - session; leftSession++) {
    dateArr.push(format(addDays(date, leftSession * 7), 'YYYY-MM-DD'))
  }

  return dateArr
}

module.exports = calcLeftSessionDate;