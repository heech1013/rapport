const { User, CounselorProfile } = require('../../models');

const index = async (req, res, next) => {
  try{
    const { clientId } = req.query;  // user(client)의 id
    // 구획: 예약 신청 / 확정
    // 정보: 상담사 이름 /  날짜 및 시간 /  예약 상태(신청/확정)
    // 기능 : 자세히 보기 / 예약 신청 취소 (예약 확정 시 취소하려면 고객센터. 환불필요)

    const UserPrototype = await User.findOne({
      where: { id: clientId }
    });
    const reservationList = await UserPrototype.getReservedCases({
      attributes: [ 'id', 'date', 'time', 'confirmation' ],
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
        }
      ]
    });
    return res.status(200).json({ success:true, reservationList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;