const dateValidator = require('../middlewares/validator/dateValidator');
const caseClauseMaker = require('../middlewares/clauseMaker/case');
const fieldOrLocationClauseMaker = require('../middlewares/clauseMaker/fieldOrLocation');

const { User, CounselorProfile, CounselorLocation, CounselorField, Case } = require('../models');

/* GET '/search' : 초기 메인 화면의 검색 필터 */
const search = async (req, res, next) => {
  try{  // 해당 date의 case를 오픈하지 않은 상담사는 뜨지 않는다.
    const { date } = req.query;
    const field = req.query.field.split(',');  // req.query 배열 생성
    const location = req.query.location.split(',');
    const condition = { date, field, location };
    // /search/counselor?date=2018. 11. 28.&field=family,relationship&location=GS,YC
    // /search/counselor?date=2018. 11. 28.&field=&location=
    
    await dateValidator(date);

    const caseClause = await caseClauseMaker(date);
    const fieldClause = await fieldOrLocationClauseMaker(field);
    const locationClause = await fieldOrLocationClauseMaker(location);

    const searchResult = await User.findAll({
      attributes: ['id'],
      where: { userType: 'counselor' },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'simpleIntroduction']
        },
        {
          model: Case,
          as: 'OpenCases',
          attributes: ['date'],  // 그냥 id만 넣을까.
          where: { ...caseClause }
        },
        {
          model: CounselorField,
          as: 'CounselorField',
          attributes: ['id'],
          where: { ...fieldClause }
        },
        {
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

/** err / 참고
   * 정보를 가져오거나 where문에 조건으로써 model이 들어가기 위해서는 include에 모델이 명시가 되어야 한다(err: Unknown column ~ in 'where clause')
   * include clause에는 model, as를 둘 다 명시해야 한다(이를 위해 model/index.js에서 as를 명시하여 associate한다. 일대일, 일대다 포함)
   * top eagerly load(where)는 as를 통해 정의한 모델명을 사용한다.
   * 일대일의 경우 같은 foreign key를 정의한 hasOne, belongsTo를 모두 사용하여 associate한다.
   * location, field가 정의되지 않은(해당 상담사의 id를 fk키로 가지고있지 않은) 상담사는 검색되지 않는다.
   */