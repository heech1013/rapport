const { sequelize, Open, CounselorRentalLocation } = require('../../../models');
const dateValidator = require('../../../middlewares/validator/dateValidator');
const dateRangeValidator = require('../../../middlewares/validator/dateRange');
// const openValidator = require('../../../middlewares/validator/openValidator');

const update = async (req, res, next) => {
  try {
    const { counselorId, open, counselorRentalLocation } = req.body;
    // 유효성 검사
    const { startDate, endDate } = open;
    /* startDate가 null일 때 - endDate도 null로 설정한다 */
    if (!startDate) endDate = null;
    /* startDate가 null이 아닐 때 */
    else {
      await dateValidator(startDate);
      // await dateRangeValidator('future', startDate); // startDate는 범위 제한이 없다.
      /* endDate가 null이 아닐 때 */
      if (endDate) {
        await dateValidator(endDate);
        await dateRangeValidator('minEnd', startDate, endDate); // endDate는 startDate로부터 최소 4주 이후여야 한다.
      }
    }
    /*
    await openValidator(open);
    req.body.open에서 받는 데이터의 확장으로 잠시 폐기.
    */
    const transaction = await sequelize.transaction();
    try {
      await Open.update(
        { ...open }, { where: { fkCounselorId: counselorId }, transaction }
      );
      await CounselorRentalLocation.update(
        { ...counselorRentalLocation }, { where: { fkCounselorId: counselorId }, transaction }
      );
      await transaction.commit();
      return res.status(201).json({ success: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = update;
/*
req.body.counselorId = '45',
req.body.open = {
startDate: '2019-01-28',
endDate: '2019-05-01',
MON9: true,
MON10: true,
...
SUN18: false
}
*/
/*
새로 오픈하는 것은 문제가 되지 않지만, 기존에
오픈되어 있던 요일/시간의 상담종료일("endDate")를 앞당기
려는 경우, 앞당기려는 상담종료일과 기존의 상담종료일 사이
에 이미 예약되어 있는 상담이 있을 수 있다. 이는
그대로 예약되어 진행될 상담케이스로 냅두고, 그 외의 시간
만 닫으면 된다. 다만 이를 상담사에게 알려줄 필요가 있
다. (예를 들어, "상담 종료일을 앞당겨도 기존에 이미 예약된
상담 케이스는 그대로 유지되며, 나머지 요일/시간은 닫히게 
됩니다" 이런 식으로.)
*/