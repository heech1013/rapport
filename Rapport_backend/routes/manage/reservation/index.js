const { Reservation, User, CounselorProfile } = require('../../../models');

/* 정보: id / 상담사 이름 / 상담사 전화번호 / 사용자 닉네임 / 사용자 전화번호 / 날짜 / 시간 
- 조건: 1회기만 뜨게. 신청 시 5회기까지 모두 confirm 처리해야 한다.
- 우선은 날짜 관계 없이 다 뜨게(날짜를 기준으로 내림차순 정렬- 미래(최신)의 날짜가 위로 오도록.)
*/

const index = async (req, res, next) => {
  try {
    const rsvList = await Reservation.findAll({
      attributes: ['id', 'date', 'time', 'confirmation', 'serviceType', 'address', 'rentalLocation'],
      include: [
        { model: User, as: 'fkClient', attributes: ['nick', 'phoneNumber']},
        { 
          model: User, as: 'fkCounselor', attributes: ['phoneNumber'],
          include: [{ model: CounselorProfile, as: 'CounselorProfile', attributes: ['name']}]
        }
      ],
      /* 'date'를 기준으로 내림차순 정렬 */
      order: [['date', 'DESC']]
    });

    return res.status(200).json({ success: true, rsvList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;