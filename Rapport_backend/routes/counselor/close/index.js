/* 휴무일 관리 페이지 최초 화면
  - 상담 오픈 계획 정보 / 기존 휴무일 정보 / 예약 상태
  - 4개월 후까지 휴무일 지정 가능
*/
const format = require('date-fns/format');
const addDays = require('date-fns/add_days');
const subDays = require('date-fns/sub_days');

const { Sequelize, Open, Close, Reservation } = require('../../../models');
const validationResult = require('../../../middlewares/validator/validationResult');
const dateValidator = require('../../../middlewares/validator/dateValidator');
const dateRangeValidator = require('../../../middlewares/validator/dateRange');
const calendarInfoFunc = require('../../../middlewares/etcFunc/calendarInfoFunc');

const { Op } = Sequelize;

const index = async (req, res, next) => {
  try {
    const { counselorId, date } = req.query;

    // 유효성 검사
    await validationResult(req);
    await dateValidator(date);
    await dateRangeValidator('future', date);
    

    const dayNum = new Date(date).getDay();
    const dateOfSUN = format(subDays(date, dayNum), 'YYYY-MM-DD');
    const dateOfSAT = format(addDays(date, 7 - dayNum), 'YYYY-MM-DD');

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
    
    const closeInfo = await Close.findAll({
      attributes: ['date', 'time'],
      where: {
        fkCounselorId: counselorId,
        date: {
          [Op.between]: [ dateOfSUN, dateOfSAT ]
        }
      }
    });

    const rsvInfo = await Reservation.findAll({
      attributes: ['date', 'time'],
      where: {
        fkCounselorId: counselorId,
        date: {
          [Op.between]: [ dateOfSUN, dateOfSAT ]
        }
      }
    });

    const calendarInfo = await calendarInfoFunc(dateOfSUN, openInfo, closeInfo, rsvInfo);

    return res.status(200).json({ success: true, startDate: openInfo.startDate, endDate: openInfo.endDate, calendarInfo });
  } catch (error) {
    next(error);
  }
}

module.exports = index