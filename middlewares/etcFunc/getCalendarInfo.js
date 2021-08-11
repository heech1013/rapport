const WEEK_DAY_COUNT = 7
const START_HOUR = 0, END_HOUR = 24
const COMPARE_RESULT_TRUE = 1

const format = require('date-fns/format');
const addDays = require('date-fns/add_days');
const compareAsc = require('date-fns/compare_asc');

const getCalendarInfo = ({ dateOfSUN, openInfo, closeInfo, rsvInfo }) => {
  const dayArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateArr = [];

  for (let addedDay = 0; addedDay < WEEK_DAY_COUNT; addedDay++) {
    dateArr.push(format(addDays(dateOfSUN, addedDay), 'YYYY-MM-DD'));
  };
  
  const calendarInfo = {};
  
  for (let dateIdx = 0; dateIdx < WEEK_DAY_COUNT; dateIdx++) {
    const targetDate = dateArr[dateIdx]
    calendarInfo[targetDate] = {};

    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      calendarInfo[targetDate][hour] = {
        "open": false,
        "close": false,
        "rsv": false,
        "closeable": false
      };
    }
  }

  // 상담을 오픈하였을 때: 상담시작일이 설정되어 있을 때
  if (openInfo.startDate) {
    for (let dateIdx = 0; dateIdx < WEEK_DAY_COUNT; dateIdx++) {
      const targetDate = dateArr[dateIdx]
      
      // 상담시작일이 해당 날짜(일요일의 날짜부터 토요일의 날짜까지)보다 크지 않으며,
      // 상담종료일이 설정되어 있지 않거나, 해당 날짜(일요일의 날짜부터 토요일의 날짜까지)가 상담종료일보다 크지 않을 때
      if (
        compareAsc(openInfo.startDate, targetDate) != COMPARE_RESULT_TRUE
        && (!openInfo.endDate || compareAsc(targetDate, openInfo.endDate) != COMPARE_RESULT_TRUE)
      ) {
        for (let hour = START_HOUR; hour < END_HOUR; hour++) {
          const openInfoKey = dayArr[dateIdx] + hour

          // 해당 요일의 해당 시간이 오픈되어 있을 때
          if (openInfo[openInfoKey]) {
            calendarInfo[targetDate][hour]["open"] = true;
          }

          // 휴무일로 지정된 날짜/시간 조합이 있을 때
          for (key in closeInfo) {
            if (
              closeInfo[key]["date"] === targetDate
              && closeInfo[key]["time"] === hour
            ) {
              calendarInfo[targetDate][hour]["close"] = true;
            }
          }

          // 예약된 날짜/시간 조합이 있을 때
          for (key in rsvInfo) {
            if (
              rsvInfo[key]["date"] === targetDate
              && rsvInfo[key]["time"] == hour
            ) {
              calendarInfo[targetDate][hour]["rsv"] = true;
            }
          }
        }
      }
    }
  }
  // 상담을 오픈하지 않은 상태일 때: 상담 시작일이 설정되어 있지 않을 때
  // 일주일 내 모든 요일의 날짜를 false 처리 한다.
  else {
    for (let dateIdx = 0; dateIdx < WEEK_DAY_COUNT; dateIdx++) {
      const targetDate = dateArr[dateIdx]
      for (let hour = START_HOUR; hour < END_HOUR; hour++) {
        calendarInfo[targetDate][hour]["open"] = false;
      }
    }
  }

  // 상담이 오픈되어 있으며, 휴무일이 아니고 예약이 안되어 있는 경우에만 휴무일로 지정할 수 있다.
  for (let dateIdx = 0; dateIdx < WEEK_DAY_COUNT; dateIdx++) {
    const targetDate = dateArr[dateIdx]

    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      if (
        calendarInfo[targetDate][hour]["open"] === true
        && calendarInfo[targetDate][hour]["close"] === false
        && calendarInfo[targetDate][hour]["rsv"] === false
      ) {
        calendarInfo[targetDate][hour]["closeable"] = true;
      }
    }
  }

  return calendarInfo
};

module.exports = getCalendarInfo;