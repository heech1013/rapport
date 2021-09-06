const addDays = require('date-fns/add_days');
const format = require('date-fns/format');
const isAfter = require('date-fns/is_after');
const isFuture = require('date-fns/is_future');

const CustomError = require('../errorHandler/customError');

const dateRangeValidator = (checkType, startDate, endDate) => {
  /* 상담사 검색 / 상담 예약: 당일로부터 이틀 후 부터 13주 후 토요일까지 가능(일요일 - 토요일을 일주일 기준으로 한다) */
  if (checkType === 'reservation') {
    const dayNum = new Date().getDay();
    const today = format(new Date(), 'YYYY-MM-DD');
    const tommorow = format(addDays(today, 1), 'YYYY-MM-DD');
    const maxDate = format(addDays(today, 91 + (6 - dayNum)), 'YYYY-MM-DD');
    
    if (isAfter(startDate, maxDate)) {
      throw CustomError('BadRequest', 'Date is out of range.');
    }
    if (!isAfter(startDate, tommorow)) {
      throw CustomError('BadRequest', 'Date is out of range.');
    }
  }

  /* 예약 취소: 오늘 (포함) 이후, 오늘 이전 날짜는 불가능 */
  if (checkType === 'future') {
    if (!isFuture(addDays(startDate, 1))) {
      throw CustomError('BadRequest', 'Date is out of range.');
    }
  }

  /* 상담 종료일 설정: 상담 시작일로부터 최소 5주(포함) 이후 날짜여야 한다. */
  if (checkType === 'minEnd') {
    const minEnd = format( addDays(startDate, 28), 'YYYY-MM-DD' );
    if (isAfter(minEnd, endDate)) {
      throw CustomError('BadRequest', 'Date is out of range.');
    }
  }
}

module.exports = dateRangeValidator;