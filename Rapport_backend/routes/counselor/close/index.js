/* 휴무일 관리 페이지 최초 화면
  - 상담 오픈 계획 정보
  - 기존 휴무일 정보
  - 예약 상태
*/
const { Sequelize, Open, Close, Reservation } = require('../../../models');

const { Op } = Sequelize;

const index = async (req, res, next) => {
  try {
    const { counselorId } = req.query;

    // 유효성 검사

    const openInfo = await Open.findOne({
      where: { fkCounselorId: counselorId }
    });
    
    const closeInfo = await Close.findAll({
      where: {
        fkCounselorId: counselorId,
        date: {
          [Op.gte]: new Date()
        }
      }
    });

    const reservationInfo = await Reservation.findAll({
      where: {
        fkCounselorId: counselorId,
        date: {
          [Op.gte]: new Date()
        }
      }
    });

    return res.status(200).json({ success: true, openInfo, closeInfo, reservationInfo });
  } catch (error) {
    next(error);
  }
}

module.exports = index