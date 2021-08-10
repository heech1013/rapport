const format = require('date-fns/format');
const addDays = require('date-fns/add_days');

const createFiveSessionArr = (date) => {
  const dateArr = []
  
  for(let x = 0; x <= 4; x++) {
    dateArr.push(format(addDays(date, x * 7), 'YYYY-MM-DD'))
  }

  return dateArr
}

module.exports = createFiveSessionArr