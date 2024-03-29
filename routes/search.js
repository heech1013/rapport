const dateValidator = require('../middlewares/validator/dateValidator');
const dateRangeValidator = require('../middlewares/validator/dateRange');
const fieldValidator = require('../middlewares/validator/fieldValidator');
const locationValidator = require('../middlewares/validator/locationValidator');
const createOpenClause = require('../utils/createOpenClause');
const createOpenAttrArr = require('../utils/createOpenAttrArr');
const createFieldOrLocationClause = require('../utils/createFieldOrLocationClause');
const searchResultVerifier = require('../middlewares/etcFunc/searchResultVerifier');
const searchResultCleaner = require('../middlewares/etcFunc/searchResultCleaner');

const { User, CounselorProfile, CounselorLocation, CounselorField, Certification, Open, Close, Reservation } = require('../models');

/* GET '/search' : 초기 메인 화면의 검색 필터 */
const search = async (req, res, next) => {
  try {
    const { date } = req.query;
    const field = req.query.field.split(',');  // req.query 배열 생성
    const location = req.query.location.split(',');
    const condition = { date, field, location };
    
    dateValidator(date);
    dateRangeValidator('reservation', date);
    if (field[0].length) {
      fieldValidator(field)
    }
    if (location[0].length) {
      locationValidator(location)
    }

    const openClause = createOpenClause(date);
    const openAttrArr = createOpenAttrArr(date);
    const fieldClause = createFieldOrLocationClause(field);
    const locationClause = createFieldOrLocationClause(location);

    let searchResult = await User.findAll({
      attributes: ['id'],
      where: { userType: 'counselor', qualification: true },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'simpleIntroduction', 'profileImgSrc']
        },
        {
          model: Certification,
          as: 'Certification',
          attributes: ['KCounselingPA_1', 'KCounselingPA_2', 'KClinicalPA']
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
        },
        {  /* 해당 날짜가 startDate와 endDate 사이에 있으며, 해당 요일에 적어도 하나 이상의 시간대를 오픈했는지 확인 */
          model: Open,
          as: 'Open',
          attributes: openAttrArr,
          where: { ...openClause }
        },
        {  // 해당 날짜를 휴무일로 지정하지 않았는지 확인하기 위한 추출
          model: Close,
          as: 'Close',
          attributes: ['date', 'time']
        },
        {  // 해당 날짜에 예약이 다 차있지는 않은지 확인하기 위한 추출
          model: Reservation,
          as: 'Reserved',
          attributes: ['date', 'time']
        }
      ]
    });

    if (searchResult.length) {  // 휴무일, 예약일 검증 함수 / searchResult 정리 함수
      searchResult = searchResultVerifier(date, searchResult);
      searchResult = searchResultCleaner(searchResult);
    }

    return res.status(200).json({ success:true, searchResult, condition });
  } catch (error) {
    next(error);
  }
}

module.exports = search;

/*  /search/counselor?date=2018. 11. 28.&field=family,relationship&location=GS,YC
    /search/counselor?date=2018. 11. 28.&field=&location= (날짜는 필수, field와 location은 공백 가능) */