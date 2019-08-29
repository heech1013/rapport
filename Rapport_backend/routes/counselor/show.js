const { Sequelize, User, CounselorProfile, Certification, CounselorField, CounselorLocation, CounselorRentalLocation, Open, Close, Reservation } = require('../../models');
const validationResult = require('../../middlewares/validator/validationResult');
const dateValidator = require('../../middlewares/validator/dateValidator');
const dateRangeValidator = require('../../middlewares/validator/dateRange');
const fiveSessionArrayMaker = require('../../middlewares/dateMaker/fiveSessionArray');
const reservableTimeFunc = require('../../middlewares/etcFunc/reservableTimeFunc');

const { Op } = Sequelize;

const show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    // 유효성 검사
    await validationResult(req);
    await dateValidator(date);
    await dateRangeValidator('reservation', date);
    
    const counselorDetail = await User.findOne({
      attributes: ['id'],
      where: { id, userType: 'counselor' },
      include: [
        { model: CounselorProfile, as: 'CounselorProfile', attributes: ['name', 'address', 'price', 'career', 'simpleIntroduction', 'detailIntroduction']},
        { model: Certification, as: 'Certification', attributes: ['KCounselingPA_1', 'KCounselingPA_2', 'KClinicalPA']},
        {
          model: CounselorField, as: 'CounselorField',
          attributes: [ 'family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study' ]
        },
        {
          model: CounselorLocation, as: 'CounselorLocation',
          attributes: [ 'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG' ]
        },
        {
          model: CounselorRentalLocation, as: 'CounselorRentalLocation',
          attributes: [ 'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG' ]
        },
        { model: Open, as: 'Open', attributes: ["centerCounseling", "rentalCounseling"]}
      ]
    });
      

    /* 해당 날짜의 요일 */
    const week = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
    const numOfDay = new Date(date).getDay();
    const day = week[numOfDay];
    /* 5회기 날짜 배열 */
    const fiveSessionArray = fiveSessionArrayMaker(date);
    /* Open 데이터 추출 간 필요한 attributes 배열 */
    const openAttributeArray = ['startDate', 'endDate'];
    for (let i = 0; i <= 23; i++) {
      openAttributeArray.push(day + i);
    }  // ['startDate, 'endDate', 'MON0', ..., 'MON23']
    
    /* reservableTimeFunc 필요 데이터 조회 */
    const openInfo = await Open.findOne({
      attributes: openAttributeArray,
      where: { fkCounselorId: id }
    });
    const closeInfo = await Close.findAll({
      attributes: ['date', 'time'],
      where: {
        fkCounselorId: id,
        date: {
          [Op.in]: fiveSessionArray
        }
      }
    });
    const reservationInfo = await Reservation.findAll({
      attributes: ['date', 'time'],
      where: {
        fkCounselorId: id,
        date: {
          [Op.in]: fiveSessionArray
        }
      }
    });

    const reservableTime = await reservableTimeFunc(day, fiveSessionArray, openInfo, closeInfo, reservationInfo);

    return res.status(200).json({ success: true, counselorDetail, reservableTime });

  } catch (error) {
    next(error);
  }
}


module.exports = show;