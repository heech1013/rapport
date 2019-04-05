const addDays = require('date-fns/add_days');
const format = require('date-fns/format');

const sessionArrayMaker = (date, session) => {  // 회기를 넣으면, 해당 회기(포함)부터 5회기까지의 날짜 배열을 뱉음
  return new Promise((resolve, reject) => {
    let sessionArr = [date];
    for (let i = 1; i <= 5 - session; i++) {
      sessionArr.push(
        format( addDays(date, i * 7), 'YYYY-MM-DD' )
      )
      if (i === (5 - session)) resolve(sessionArr);
    }
    // console.log(sessionArr);
    // return resolve(sessionArr);
  });
}

module.exports = sessionArrayMaker;