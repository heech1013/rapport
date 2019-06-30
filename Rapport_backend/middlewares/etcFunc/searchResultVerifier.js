const fiveSessionArrayMaker = require('../dateMaker/fiveSessionArray');

const searchResultVerifier = (date, searchResult) => {
  return new Promise(async(resolve) => {
    const week = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
    const numOfDay = new Date(date).getDay();
    const day = week[numOfDay];
    const fiveSessionArray = await fiveSessionArrayMaker(date);

    const verified = searchResult.filter((obj) => {
      let mainFlag = false;
      for (let i = 0; i <= 23; i++) {
        let flag1 = true, flag2 = true;
        if ( obj["Open"][day + i] ) {
          obj["Close"].forEach((closeObj) => {
            if ( closeObj["time"] == i && fiveSessionArray.includes(closeObj["date"]) ) flag1 = false;
          });
          obj["Reserved"].forEach((rsvObj) => {
            if ( rsvObj["time"] == i && fiveSessionArray.includes(rsvObj["date"]) ) flag2 = false;
          });
          // 만족하는 시간대로 인해 한 번 mainFlag가 true가 되면, 이후 어떤 시간대를 검증하든 간에 mainFlag는 true.
          if (flag1 && flag2) mainFlag = true;
        }
        if (i == 23) return mainFlag;  // return 뒤의 판별식이 true로 강제되는 배열을 리턴한다.
      }
    });
    resolve(verified);
  })
};

module.exports = searchResultVerifier;

/* 검증 논리
- 해당 날짜(예를 들어 2019-03-04)의 요일을 파악(화요일, TUE).
- 해당 날짜를 포함하여 총 5회기의 날짜를 date로 가지는 Close와 Reservation의 컬럼을 조회("time" row만)
- 해당 요일의 9시부터 18시까지의 오픈 계획을 조회(TUE9~TUE18)
- 오픈 계획이 true인 시간대에 한하여(예를 들어 TUE10과 TUE 15가 true라면),
  Close와 Reservation 중 해당 시간대의 컬럼이 있는지 확인
- 해당 시간대가 Close와 Reservation 중 하나에라도 있다면, 그 시간대는 예약이 불가하다는 뜻이다.(5회기인 것을 감안하더라도)
- 만약 Close와 Reservation의 컬럼들 중 존재하지 않는 시간대가 (하나라도) 있다면, 적어도 그 시간대에는 예약을 할 수 있다는 의미이며,
  이는 곧 해당 날짜가 예약 가능하다는 의미이다.
*/