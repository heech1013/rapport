const { Sequelize, User, CounselorProfile, Reservation } = require('../../../models');
const validationResult = require('../../../middlewares/validator/validationResult');

const { Op } = Sequelize;

/* 정보: 상담사 이름 / 날짜 / 시간 / 회기 / 예약 상태(신청/확정)
   기능: 자세히 보기 / 예약 신청 취소 (예약 확정 시 취소하려면 고객센터. 환불 필요)
   자세히 보기 정보: 상담사 이름(프로필로 링크) / 날짜 / 시간 / 회기 / 가격 / 장소 / 상담신청서
   - 당일 포함 그 이후부터 나온다.
*/

const index = async (req, res, next) => {
  try {
    const { clientId } = req.query;

    await validationResult(req);

    const rsvList = await Reservation.findAll({
      attributes: ['id', 'date', 'time', 'session', 'confirmation'],
      where: {
        fkClientId: clientId,
        date: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: 'fkCounselor',
          attributes: ['id'],
          include: [
            {
              model: CounselorProfile,
              as: 'CounselorProfile',
              attributes: ['name']
            }
          ]
        },
      ]
    });

    return res.status(200).json({ success: true, rsvList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;