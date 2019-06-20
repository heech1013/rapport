const format = require('date-fns/format');
const addDays = require('date-fns/add_days');
const compareAsc = require('date-fns/compare_asc');

const calendarInfoFunc = (dateOfSUN, openInfo, closeInfo, rsvInfo) => {
  return new Promise((resolve) => {
    const dayArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dateArr = [dateOfSUN];
    for (let i = 1; i <= 6; i++) {
      dateArr.push(format(addDays(dateOfSUN, i), 'YYYY-MM-DD'));
    };
    
    // calendarInfo 기본 틀 생성
    let calendarInfo = {}; // 비동기??
    for (let i = 0; i <= 6; i++) {
      calendarInfo[dateArr[i]] = {};
      for (let j = 0; j <= 23; j++) {
        calendarInfo[dateArr[i]][j] = { "open": false, "close": false, "rsv": false, "closeable": false };
      }
    }

    if (
      openInfo.startDate  // 상담시작일이 설정되어 있을 때(상담을 오픈하였을 때)
    ) {
      for (let i = 0; i<= 6; i++) {
        if (
          compareAsc(openInfo.startDate, dateArr[i]) != 1  // 상담시작일이 해당 날짜(일요일의 날짜부터 토요일의 날짜까지)보다 크지(=1) 않으면서,
          && (
            !openInfo.endDate  // 상담종료일이 설정되어 있지 않거나
            || compareAsc(dateArr[i], openInfo.endDate) != 1  // 해당 날짜(일요일의 날짜부터 토요일의 날짜까지)가 상담종료일보다 크지(=1) 않으면
          )
        ) {
          for (let j = 0; j <= 23; j++) {
            if (openInfo[dayArr[i] + j] == true) {  // 해당 요일의 해당 시간이 오픈되어 있을 때
              calendarInfo[dateArr[i]][j]["open"] = true;
            }
            //  휴무일로 지정된 날짜/시간 조합이 있을 때
            for (key in closeInfo) {
              if (closeInfo[key]["date"] == dateArr[i] && closeInfo[key]["time"] == j) {
                calendarInfo[dateArr[i]][j]["close"] = true;
              }
            }
            // 예약된 날짜/시간 조합이 있을 때
            for (key in rsvInfo) {
              if (rsvInfo[key]["date"] == dateArr[i] && rsvInfo[key]["time"] == j) {
                calendarInfo[dateArr[i]][j]["rsv"] = true;
              }
            }
          }
        }
      }
    } else {  // 상담 시작일이 설정되어 있지 않을 때
      for (let i = 0; i <= 6; i++) {  // 일주일 내 모든 요일의 날짜를 false 처리 한다.
        for (let j = 0; j <= 23; j++) {
          calendarInfo[dateArr[i]][j]["open"] = false;
        }
      }
    }

    // 상담이 오픈되어 있으며, 휴무일이 아니고 예약이 안되어 있는 경우에만 휴무일로 지정할 수 있다.
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 23; j++) {
        if (
          calendarInfo[dateArr[i]][j]["open"] === true
          && calendarInfo[dateArr[i]][j]["close"] === false
          && calendarInfo[dateArr[i]][j]["rsv"] === false
        ) {
          calendarInfo[dateArr[i]][j]["closeable"] = true;
        }
      }
    }
    resolve(calendarInfo);
  })
};

module.exports = calendarInfoFunc;