const compareAsc = require('date-fns/compare_asc');
const { HOUR_START, HOUR_END, TRUE, WHOLE_SESSION_COUNT } = require('../../lib/constant')

const reservableTimeFunc = ({ day, fiveSessionArray, openInfo, closeInfo, reservationInfo }) => {
  const reservableTime = {};

  for (let hour = HOUR_START; hour < HOUR_END; hour++) {
    reservableTime[hour] = true;
  };

  let isOpenSchedulePossible = true;

  // 상담시작일 및 상담종료일 확인: 상담시작일이 null인 경우 
  if (!openInfo["startDate"]) {
    isOpenSchedulePossible = false;
  }
  // 상담시작일이 설정되어 있는 경우
  else {
    // 1회기가 상담 시작일의 범위를 벗어날 때(startDate > date 일 때) 
    if (compareAsc(openInfo["startDate"], fiveSessionArray[0]) === TRUE) {
      isOpenSchedulePossible = false;
    }
    // 예약일이 상담 시작일의 범위 안에 들 때 
    else if (
      // 상담 종료일이 설정되어 있는 경우 
      openInfo["endDate"]
      // 5회기가 상담 종료일의 범위를 벗어날 때(date > endDate 일 때) 
      && compareAsc(fiveSessionArray[4], openInfo["endDate"]) === TRUE
    ) {  
      isOpenSchedulePossible = false;
    }
  }
  
  if (isOpenSchedulePossible) {
    for (let hour = HOUR_START; hour < HOUR_END; hour++) {
      // date에 해당하는 요일/시간이 오픈(true)되어 있을 때 
      if (openInfo[day + hour]) {
        for (let session = 0; session < WHOLE_SESSION_COUNT; session++) {
          closeInfo.forEach(obj => {
            // 휴무 데이터에 5회기에 해당하는 날짜와 각 시간들의 조합 중의 하나가 있을 때 
            if (obj["date"] === fiveSessionArray[session] && obj["time"] === hour) {
              reservableTime[hour] = false;
            }
          });
          reservationInfo.forEach(obj => {
            // 예약 데이터에 5회기에 해당하는 날짜와 각 시간들의 조합 중의 하나가 있을 때 
            if (obj["date"] === fiveSessionArray[session] && obj["time"] === hour) {
              reservableTime[hour] = false;
            }
          });
        }  
      }
      // date에 해당하는 요일/시간이 오픈되어 있지 않을 때 
      else {
        reservableTime[hour] = false;
      }
    }
  }
  // isOpenSchedulePossible가 false일 때(5회기 중 상담 시작일과 종료일을 벗어나는 날이 있을 때
  else {  
    for (let hour = HOUR_START; hour < HOUR_END; hour++) {
      reservableTime[hour] = false;
    };
  }

  resolve(reservableTime);
  return reservableTime;
}

module.exports = reservableTimeFunc;