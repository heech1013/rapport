const addDays = require('date-fns/add_days');
const format = require('date-fns/format');
const isAfter = require('date-fns/is_after');
const isFuture = require('date-fns/is_future');

const CustomError = require('../errorHandler/customError');

const dateRangeValidator = (str, date1, date2) => {
  return new Promise((resolve, reject) => {
    const dateRangeErr = CustomError('BadRequest', 'Date is out of range.');

    /* 상담사 검색 / 상담 예약: 당일로부터 이틀 후 부터 13주 후 토요일까지 가능(일요일 - 토요일을 일주일 기준으로 한다) */
    if (str === 'reservation') {
      const dayNum = new Date().getDay();
      const today = format(new Date(), 'YYYY-MM-DD');
      const tommorow = format( addDays(today, 1), 'YYYY-MM-DD' );
      const maxDate = format( addDays(today, 91 + (6 - dayNum)), 'YYYY-MM-DD' );
      if (isAfter(date1, maxDate)) reject( dateRangeErr );
      else if (!isAfter(date1, tommorow)) reject( dateRangeErr );
    }
    /* 예약 취소: 오늘 (포함) 이후, 오늘 이전 날짜는 불가능 */
    else if (str === 'future') {
      if (!isFuture( addDays(date1, 1) )) reject( dateRangeErr );
    }
    /* 상담 종료일 설정: 상담 시작일로부터 최소 5주(포함) 이후 날짜여야 한다. */
    else if (str === 'minEnd') {  // date1(startDate), date2(endDate)
      const minEnd = format( addDays(date1, 28), 'YYYY-MM-DD' );
      if (isAfter(minEnd, date2)) reject( dateRangeErr );
    }

    resolve();
  })
}

module.exports = dateRangeValidator;