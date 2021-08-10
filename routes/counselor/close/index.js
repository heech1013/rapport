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
const createDayTimeArr = require('../../../middlewares/etcFunc/createDayTimeArr');

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
    const dayTimeArr = createDayTimeArr()

    const openInfo = await Open.findOne({
      attributes: [
        'startDate', 'endDate',
        ...dayTimeArr,
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

    const calendarInfo = await calendarInfoFunc({ dateOfSUN, openInfo, closeInfo, rsvInfo });

    return res.status(200).json({ success: true, startDate: openInfo.startDate, endDate: openInfo.endDate, calendarInfo });
  } catch (error) {
    next(error);
  }
}

module.exports = index