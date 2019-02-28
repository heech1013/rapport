const dateValidator = require('../middlewares/validator/dateValidator');
const dateRangeValidator = require('../middlewares/validator/dateRange');
const fieldValidator = require('../middlewares/validator/fieldValidator');
const locationValidator = require('../middlewares/validator/locationValidator');
const openClauseMaker = require('../middlewares/clauseMaker/open');
const closeClauseMaker = require('../middlewares/clauseMaker/close');
const fieldOrLocationClauseMaker = require('../middlewares/clauseMaker/fieldOrLocation');

const { User, CounselorProfile, CounselorLocation, CounselorField, Open, Close } = require('../models');

/* GET '/search' : 초기 메인 화면의 검색 필터 */
const search = async (req, res, next) => {
  try {
    const { date } = req.query;
    const field = req.query.field.split(',');  // req.query 배열 생성
    const location = req.query.location.split(',');
    const condition = { date, field, location };
    
    await dateValidator(date);
    await dateRangeValidator('reservation', date);
    if (field[0].length) {
      await fieldValidator(field)
    }
    if (location[0].length) {
      await locationValidator(location)
    }
    

    const openClause = await openClauseMaker(date);
    const closeClause = await closeClauseMaker(date);
    const fieldClause = await fieldOrLocationClauseMaker(field);
    const locationClause = await fieldOrLocationClauseMaker(location);

    /* 상담사가 그 날을 열어놓았으며 휴무일이 아니어도, 예약이 다 차있는 경우는 걸러내지 못했다. */
    const searchResult = await User.findAll({
      attributes: ['id'],
      where: { userType: 'counselor' },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'simpleIntroduction']
        },
        {  // 해당 날짜가 startDate와 endDate 사이에 있으며, 해당 요일에 적어도 하나 이상의 시간대를 오픈했는지 확인
          model: Open,
          as: 'Open',
          attributes: ['id'],
          where: { ...openClause }
        },
        {  // 해당 날짜를 휴무일로 지정하지 않았는지 확인
          model: Close,
          as: 'Close',
          attributes: ['id'],
          where: { ...closeClause }
        },
        {  // 해당 분야 중 적어도 하나 이상을 가능 분야로 설정하였는지 확인
          model: CounselorField,
          as: 'CounselorField',
          attributes: ['id'],
          where: { ...fieldClause }
        },
        {  // 해당 지역에 개인 상담 공간이 있는지 확인
          model: CounselorLocation,
          as: 'CounselorLocation',
          attributes: ['id'],
          where: { ...locationClause }
        }
      ],
    })
    return res.status(200).json({ success:true, searchResult, condition });
  } catch (error) {
    next(error);
  }
}

module.exports = search;

/*  /search/counselor?date=2018. 11. 28.&field=family,relationship&location=GS,YC
    /search/counselor?date=2018. 11. 28.&field=&location= (날짜는 필수, field와 location은 공백 가능) */

/** err / 참고
   * 정보를 가져오거나 where문에 조건으로써 model이 들어가기 위해서는 include에 모델이 명시가 되어야 한다(err: Unknown column ~ in 'where clause')
   * include clause에는 model, as를 둘 다 명시해야 한다(이를 위해 model/index.js에서 as를 명시하여 associate한다. 일대일, 일대다 포함)
   * top eagerly load(where)는 as를 통해 정의한 모델명을 사용한다.
   * 일대일의 경우 같은 foreign key를 정의한 hasOne, belongsTo를 모두 사용하여 associate한다.
   * location, field가 정의되지 않은(해당 상담사의 id를 fk키로 가지고있지 않은) 상담사는 검색되지 않는다.
   */