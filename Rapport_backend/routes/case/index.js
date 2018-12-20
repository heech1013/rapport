const { User, Case } = require('../../models');

const index = async (req, res, next) => {  // GET '/case?counselorId=3&date=2018-12-12'
  try{
    const { counselorId, date } = req.query;
    // 구획 종류: 오픈한 케이스 / 예약신청된 / 예약확정된 / 시간지난?(달력선택 말고 다른 버튼을 둬야 함)
    // 정보: 날짜 및 시간 / 고객 닉네임
    // 기능: 자세히 보기 / 삭제
    const caseList = await Case.findAll({
      attributes: ['id', 'date', 'time', 'confirmation'],
      where: { fkCounselorId : counselorId, date },
      include: [
        {
          model: User,
          as: 'fkClient',
          attributes: ['nick']
        }
      ]
    });
    return res.status(200).json({ caseList });
    /* 오픈한 케이스 : 검색 결과의 모든 케이스
      오픈은 했지만 예약은 안된 케이스: "user"가 null
      예약 신청만 된 케이스: "user"가 있고 confirmation은 false
      예약 신청 후 결제 완료(예약 완료)된 케이스: confirmation이 true
    */
  } catch (error) {
    next(error);
  }
};

module.exports = index;