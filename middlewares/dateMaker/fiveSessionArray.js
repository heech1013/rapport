const format = require('date-fns/format');
const addDays = require('date-fns/add_days');

const fiveSessionArray = (date) => {
  const dateArray = [date];
  for(let x = 1; x <= 4; x++) {
    dateArray[x] = format( addDays(date, x * 7), 'YYYY-MM-DD' );
  }
  return dateArray;
}

module.exports = fiveSessionArray;