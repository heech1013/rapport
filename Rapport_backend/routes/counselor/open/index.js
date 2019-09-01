const { Open, CounselorRentalLocation } = require('../../../models');
const validationResult = require('../../../middlewares/validator/validationResult');

const index = async (req, res, next) => {
  try {
    const { counselorId } = req.query;

    await validationResult(req);

    const openInfo = await Open.findOne({
      attributes: [
        'startDate', 'endDate',
        'centerCounseling', 'rentalCounseling',
        "MON0", "MON1", "MON2", "MON3", "MON4", "MON5", "MON6", "MON7", "MON8", "MON9", "MON10", "MON11", "MON12", "MON13", "MON14","MON15","MON16", "MON17", "MON18", "MON19", "MON20", "MON21", "MON22", "MON23",
        "TUE0", "TUE1", "TUE2", "TUE3", "TUE4", "TUE5", "TUE6", "TUE7", "TUE8", "TUE9", "TUE10", "TUE11", "TUE12", "TUE13", "TUE14","TUE15","TUE16", "TUE17", "TUE18", "TUE19", "TUE20", "TUE21", "TUE22", "TUE23",
        "WED0", "WED1", "WED2", "WED3", "WED4", "WED5", "WED6", "WED7", "WED8", "WED9", "WED10", "WED11", "WED12", "WED13", "WED14","WED15","WED16", "WED17", "WED18", "WED19", "WED20", "WED21", "WED22", "WED23",
        "THU0", "THU1", "THU2", "THU3", "THU4", "THU5", "THU6", "THU7", "THU8", "THU9", "THU10", "THU11", "THU12", "THU13", "THU14","THU15","THU16", "THU17", "THU18", "THU19", "THU20", "THU21", "THU22", "THU23",
        "FRI0", "FRI1", "FRI2", "FRI3", "FRI4", "FRI5", "FRI6", "FRI7", "FRI8", "FRI9", "FRI10", "FRI11", "FRI12", "FRI13", "FRI14","FRI15","FRI16", "FRI17", "FRI18", "FRI19", "FRI20", "FRI21", "FRI22", "FRI23",
        "SAT0", "SAT1", "SAT2", "SAT3", "SAT4", "SAT5", "SAT6", "SAT7", "SAT8", "SAT9", "SAT10", "SAT11", "SAT12", "SAT13", "SAT14","SAT15","SAT16", "SAT17", "SAT18", "SAT19", "SAT20", "SAT21", "SAT22", "SAT23",
        "SUN0", "SUN1", "SUN2", "SUN3", "SUN4", "SUN5", "SUN6", "SUN7", "SUN8", "SUN9", "SUN10", "SUN11", "SUN12", "SUN13", "SUN14","SUN15","SUN16", "SUN17", "SUN18", "SUN19", "SUN20", "SUN21", "SUN22", "SUN23"
      ],
      where: { fkCounselorId: counselorId }
    });

    const counselorRentalLocation = await CounselorRentalLocation.findOne({ where: { fkCounselorId: counselorId }, attributes: ['GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG']});

    const rsvableFunc = (openInfo) => {
      return new Promise((resolve, reject) => {
        let rsvable = [];
        let dayArr = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        if (!openInfo.startDate) {  // startDate가 설정되어 있지 않은 경우(상담 오픈을 하지 않은 경우)
          resolve(rsvable);
        } else {
          for (let i = 0; i <= 6; i++) {
            for (let j = 0; j <= 23; j++) {
              if (openInfo[dayArr[i] + j]) {  // '요일+시간'이 true일 경우
                rsvable.push(dayArr[i] + j);
              }
              if (i === 6 && j === 23) resolve(rsvable);
            }
          }
        }
      })
    };

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