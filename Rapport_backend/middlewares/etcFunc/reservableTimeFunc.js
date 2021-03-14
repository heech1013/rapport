const compareAsc = require('date-fns/compare_asc');

const reservableTimeFunc = (day, fiveSessionArray, openInfo, closeInfo, reservationInfo) => {
  return new Promise((resolve, reject) => {
    /* sequelize로부터 추출된 prototype 형태의 데이터를 조작 가능한 배열 형태로 변환. */
    closeInfo.map(obj => ({
      date: obj.date,
      time: obj.time
    }));    
    reservationInfo.map(obj => ({
      date: obj.date,
      time: obj.time
    }));  // 데이터가 없을 시 빈 배열

    /* 예약 가능 여부 - default */
    const reservableTime = {};
    for (let i = 0; i <= 23; i++) {  // default는 모두 true, 한 개의 조건이라도 불만족할 시 false
      reservableTime[i] = true;
    };

    let flag = true;

    /* 상담시작일 및 상담종료일 확인 */
    if (!openInfo["startDate"]) {  /* 상담시작일이 null인 경우 */
      flag = false;
    }
    else {  /* 상담시작일이 설정되어 있는 경우 */    
      if (compareAsc(openInfo["startDate"], fiveSessionArray[0]) == 1) {  /* 1회기가 상담 시작일의 범위를 벗어날 때(startDate > date 일 때) */
        flag = false;
      }
      /* 예약일이 상담 시작일의 범위 안에 들 때 */
      else if (
        /* 상담 종료일이 설정되어 있는 경우 */
        openInfo["endDate"]
        /* 5회기가 상담 종료일의 범위를 벗어날 때(date > endDate 일 때) */
        && compareAsc(fiveSessionArray[4], openInfo["endDate"]) == 1
      ) {  
        flag = false;
      }
      /* flag가 true인 채로 넘어가는 경우 :
       * 5회기가 상담 종료일의 범위 안에 들 때
       * 상담 종료일이 null일 때 */
    }
    
    /* 5회기가 모두 상담시작일과 상담종료일 사이에 있을 때 */
    if (flag) {
      /* 0시부터 23시까지 순회 */
      for (let i = 0; i <= 23; i++) {
        /* date에 해당하는 요일/시간이 오픈(true)되어 있을 때 */
        if (openInfo[day + i]) {
          /* 1주차부터 5주차까지 순회 */
          for (let j = 0; j <= 4; j++) {
            closeInfo.forEach(obj => {
              /* 휴무 데이터에 5회기에 해당하는 날짜와 각 시간들의 조합 중의 하나가 있을 때 */
              if (obj["date"] == fiveSessionArray[j] && obj["time"] == i) {
                reservableTime[i] = false;
              }
            });
            reservationInfo.forEach(obj => {
              /* 예약 데이터에 5회기에 해당하는 날짜와 각 시간들의 조합 중의 하나가 있을 때 */
              if (obj["date"] == fiveSessionArray[j] && obj["time"] == i) {
                reservableTime[i] = false;
              }
            });
          }  
        } else {  /* date에 해당하는 요일/시간이 오픈되어 있지 않을(fasle) 때 */
          reservableTime[i] = false;
        }
      }
    } else {  /* flag가 false일 때(5회기 중 상담 시작일과 종료일을 벗어나는 날이 있을 때) */
      for (let i = 0; i <= 23; i++) {
        reservableTime[i] = false;
      };
    }

    resolve(reservableTime);
  }
)}

module.exports = reservableTimeFunc;

/* Open, Close, Reservation 데이터 조회 부분 출력 결과 예시

  "openInfo": {
    "startDate": "2019-01-01",
    "endDate": "2019-12-31",
    "MON9": true,
    "MON10": true,
    "MON11": true,
    "MON12": true,
    "MON13": true,
    "MON14": true,
    "MON15": false,
    "MON16": false,
    "MON17": false,
    "MON18": false
    },
  "closeInfo": [
    {
      "date": "2019-02-11",
      "time": 13
    },
    {
      "date": "2019-02-11",
      "time": 14
    }
  ],
  "reservationInfo": [
    {
      "date": "2019-02-11",
      "time": 11
    },
    {
      "date": "2019-02-11",
      "time": 12
    }
  ]
*/