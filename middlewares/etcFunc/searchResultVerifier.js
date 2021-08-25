const { DAYS, HOUR_START, HOUR_END } = require('../../lib/constant');
const createFiveSessionArr = require('../../utils/createFiveSessionArr');

const searchResultVerifier = (date, searchResult) => {
  const dayNum = new Date(date).getDay();
  const dayStr = DAYS[dayNum];
  const fiveSessionArray = createFiveSessionArr(date);

  return searchResult.filter((counselor) => {
    let isReservable = false;
    
    for (let hour = HOUR_START; hour < HOUR_END; hour++) {
      if (counselor.Open[dayStr + hour] ) {
        const isOpened = counselor.Close.every(
          (close) => (
            close.time !== hour
            || !fiveSessionArray.includes(close.date)
          )
        );
        const isNotReserved = counselor.Reserved.every(
          (reservation) => (
            reservation.time !== hour 
            || !fiveSessionArray.includes(reservation.date)
          )
        );

        if (isOpened && isNotReserved) isReservable = true;
      }
      
      return isReservable.valueOf;
    }
  });
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