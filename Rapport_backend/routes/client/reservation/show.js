const { User, CounselorProfile, Reservation, Application } = require('../../../models');
const validationResult = require('../../../middlewares/validator/validationResult');
const CustomError = require('../../../middlewares/errorHandler/customError');

/* 자세히 보기 정보: 상담사 이름(프로필로 링크) / 날짜 / 시간 / 회기 / 가격 / 장소 / 상담신청서 */

const show = async (req, res, next) => {
  try {
    const { id } = req.params;  // reservation의 id

    await validationResult(req);

    const rsvDetail = await Reservation.findOne({
      attributes: ['date', 'time', 'session', 'price', 'address'],
      where: { id },
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
        {
          model: Application,
          as: 'Application',
          attributes: ['name', 'sex', 'age', 'problem']
        }
      ]
    });

    /* 조회된 데이터가 없을 때 */
    if (!rsvDetail) {
      return next(
        CustomError('BadRequest', 'Reservation is not exist.')
      )
    }

    
    return res.status(200).json({ success:true, rsvDetail });
  } catch (error) {
    next(error);
  }
};

module.exports = show;