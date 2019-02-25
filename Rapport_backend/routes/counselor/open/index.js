const { Open } = require('../../../models');

const index = async (req, res, next) => {
  try {
    const { counselorId } = req.query;

    const openInfo = await Open.findOne({
      attributes: ['startDate', 'endDate',
        'MON9', 'MON10', 'MON11', 'MON12', 'MON13', 'MON14', 'MON15', 'MON16', 'MON17', 'MON18',
        'TUE9', 'TUE10', 'TUE11', 'TUE12', 'TUE13', 'TUE14', 'TUE15', 'TUE16', 'TUE17', 'TUE18',
        'WED9', 'WED10', 'WED11', 'WED12', 'WED13', 'WED14', 'WED15', 'WED16', 'WED17', 'WED18',
        'THU9', 'THU10', 'THU11', 'THU12', 'THU13', 'THU14', 'THU15', 'THU16', 'THU17', 'THU18',
        'FRI9', 'FRI10', 'FRI11', 'FRI12', 'FRI13', 'FRI14', 'FRI15', 'FRI16', 'FRI17', 'FRI18',
        'SAT9', 'SAT10', 'SAT11', 'SAT12', 'SAT13', 'SAT14', 'SAT15', 'SAT16', 'SAT17', 'SAT18',
        'SUN9', 'SUN10', 'SUN11', 'SUN12', 'SUN13', 'SUN14', 'SUN15', 'SUN16', 'SUN17', 'SUN18'
      ],
      where: { fkCounselorId: counselorId }
    });

    const rsvableFunc = (openInfo) => {
      return new Promise((resolve, reject) => {
        let rsvable = [];
        let dayArr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        if (!openInfo.startDate) {  // startDate가 설정되어 있지 않은 경우(상담 오픈을 하지 않은 경우)
          resolve(rsvable);
        } else {
          for (let i = 0; i <= 6; i++) {
            for (let j = 9; j <= 18; j++) {
              if (openInfo[dayArr[i] + j]) {  // '요일+시간'이 true일 경우
                rsvable.push(dayArr[i] + j);
              }
              if (i === 6 && j === 18) resolve(rsvable);
            }
          }
        }
      })
    };

    const { startDate, endDate } = openInfo;
    const rsvable = await rsvableFunc(openInfo);
    
    return res.status(200).json({ success: true, startDate, endDate, rsvable }); 
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