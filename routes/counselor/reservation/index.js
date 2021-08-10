const { User, Reservation } = require('../../../models');

/* 정보: id / 날짜 / 시간 / 닉네임 / 예약확정상태
 - 내림차순으로 모든 데이터가 조회됨.
*/

const index = async (req, res, next) => {
  try {
    const { counselorId } = req.query;
    
    const rsvList = await Reservation.findAll({
      attributes: ['id', 'date', 'time', 'serviceType', 'address', 'rentalLocation', 'session', 'confirmation'],
      where: { fkCounselorId: counselorId },
      include: [{ model: User, as: 'fkClient', attributes: ['nick']}],
      /* 'date'를 기준으로 내림차순 정렬 */
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ success: true, rsvList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;