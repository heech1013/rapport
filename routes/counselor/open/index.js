const { Open, CounselorRentalLocation } = require('../../../models');
const validationResult = require('../../../middlewares/validator/validationResult');
const createDayTimeArr = require('../../../middlewares/etcFunc/createDayTimeArr')
const { DAYS, HOUR_START, HOUR_END, WEEK_DAY_COUNT } = require('../../../lib/constant')

const index = async (req, res, next) => {
  try {
    const { counselorId } = req.query;

    validationResult(req);

    const dayTimeArr = createDayTimeArr()

    const openInfo = await Open.findOne({
      attributes: [
        'startDate', 'endDate',
        'centerCounseling', 'rentalCounseling',
        ...dayTimeArr,
      ],
      where: { fkCounselorId: counselorId }
    });

    const counselorRentalLocation = await CounselorRentalLocation.findOne({ where: { fkCounselorId: counselorId }, attributes: ['GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG']});

    const rsvableFunc = (openInfo) => {
      const rsvable = [];
      
      // startDate가 설정되어 있지 않은 경우(상담 오픈을 하지 않은 경우)
      if (!openInfo.startDate) {  
        return rsvable;
      } 

      for (let dayIdx = 0; i < WEEK_DAY_COUNT; i++) {
        for (let hour = HOUR_START; hour < HOUR_END; hour++) {
          if (openInfo[DAYS[dayIdx] + hour]) {
            rsvable.push(DAYS[dayIdx] + hour);
          }
        }
      }

      return rsvable;
    }

    const { startDate, endDate, centerCounseling, rentalCounseling } = openInfo;
    const rsvable = await rsvableFunc(openInfo);
    
    return res.status(200).json({
      success: true,
      startDate, endDate,
      Open: { centerCounseling, rentalCounseling },
      counselorRentalLocation,
      rsvable
    }); 
  } catch (error) {
    next(error);
  }
};

module.exports = index

/*
  - 새로 오픈하는 것은 문제가 되지 않지만, 기존에
  오픈되어 있던 요일/시간의 상담종료일("endDate")를 앞당기
  려는 경우, 앞당기려는 상담종료일과 기존의 상담종료일 사이
  에 이미 예약되어 있는 상담이 있을 수 있다. 이는
  그대로 예약되어 진행될 상담케이스로 냅두고, 그 외의 시간
  만 닫으면 된다. 다만 이를 상담사에게 알려줄 필요가 있
  다. (예를 들어, "상담 종료일을 앞당겨도 기존에 이미 예약된
  상담 케이스는 그대로 유지되며, 나머지 요일/시간은 닫히게 
  됩니다" 이런 식으로.)
  - (현우 요청) "rsvable": ['MON9', 'MON13', 'TUE11'] 이런 형식으로 달라(true인 값만 모아 배열로)
*/