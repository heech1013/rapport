const compareAsc = require('date-fns/compare_asc');
const { HOUR_START, HOUR_END, TRUE, WHOLE_SESSION_COUNT } = require('../../lib/constant')

const reservableTimeFunc = ({ day, fiveSessionArray, openInfo, closeInfo, reservationInfo }) => {
  // conditions
  const isOpenScheduleClosed = (openInfo["startDate"] === null)
  const isScheduleOpenedLater = (compareAsc(openInfo["startDate"], fiveSessionArray[0]) === TRUE)
  const isScheduleClosedFaster = openInfo["endDate"] && (compareAsc(fiveSessionArray[4], openInfo["endDate"]) === TRUE)
  
  // methods
  const checkDateTimeOverlapping = (session, hour, targetData) => {
    const { date, time } = targetData;
    return (date !== fiveSessionArray[session] && time !== hour);
  }

  // initial state
  const reservableTime = {};
  for (let hour = HOUR_START; hour < HOUR_END; hour++) {
    reservableTime[hour] = true;
  };

  if (
    isOpenScheduleClosed
    || isScheduleOpenedLater
    || isScheduleClosedFaster
  ) {
    for (let hour = HOUR_START; hour < HOUR_END; hour++) {
      if (openInfo[day + hour]) {
        for (let session = 0; session < WHOLE_SESSION_COUNT; session++) {
          const isNotClosedOrReserved = closeInfo.every(
            (close) => checkDateTimeOverlapping(session, hour, close)
          ) && reservationInfo.every(
            (reservation) => checkDateTimeOverlapping(session, hour, reservation)
          );

          reservableTime[hour] = isNotClosedOrReserved
        }  
      } else {
        reservableTime[hour] = false;
      }
    }
  } else {
    for (let hour = HOUR_START; hour < HOUR_END; hour++) {
      reservableTime[hour] = false;
    };
  }

  return reservableTime;
}

module.exports = reservableTimeFunc;