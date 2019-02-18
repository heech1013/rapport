const addDays = require('date-fns/add_days');
const subDays = require('date-fns/sub_days');

const { Sequelize, User, Reservation } = require('../../../models');

const { Op } = Sequelize;
/* 정보: id / 날짜 / 시간 / 닉네임 / 예약확정상태
- 당일 포함 이후로부터의 데이터만 조회됨.
- 일 = 0, 월 = 1, ..., 토 = 6
    그 주의 일 ~ 토까지의 데이터를 보여주어야 한다.
    만약 date가 화요일이었다 -> 요일(숫자)는 2
    조회 시작일 = date - 2일(i), 조회 마지막일 = date + 4일(6-i)
    date가 일요일 -> 요일은 0
    시작일 = date - 0(i), 마지막일 = date + 6(6-i)
    토요일 -> 6
    시작일 = date - 6(i), 마지막일 = date + 0(6-i)
*/

const index = async (req, res, next) => {
  try {
    const { counselorId, date } = req.query;

    const dayNum = new Date(date).getDay();
    
    const rsvList = await Reservation.findAll({
      attributes: ['id', 'date', 'time', 'confirmation'],
      where: {
        fkCounselorId: counselorId,
        date: {
          [Op.between]: [ subDays(date, dayNum), addDays(date, 7-dayNum) ]
        }
      },
      include: [
        {
          model: User,
          as: 'fkClient',
          attributes: ['nick']
        }
      ]
    });

    return res.status(200).json({ success: true, rsvList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;