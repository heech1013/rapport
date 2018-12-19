const router = require('express').Router();
const { Sequelize, User, CounselorProfile, CounselorLocation, CounselorField, Case } = require('../models');

const Op = Sequelize.Op;

/* GET '/search/counselor' : 초기 메인 화면의 검색 필터 */
router.get('/counselor', async (req, res, next) => {
  try{  // 해당 date의 case를 오픈하지 않은 상담사는 뜨지 않는다.
    const { date } = req.query;
    let field = req.query.field.split(',');  // req.query 배열 생성
    let location = req.query.location.split(',');
    const condition = { "date": date, "field": field, "location": location };
    // /search/counselor?date=2018. 11. 28.&field=family,relationship&location=GS,YC
    // /search/counselor?date=2018. 11. 28.&field=&location=
    
    const dateRegExp = /([12]\d{3}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01]))/;
    if (!dateRegExp.test(date)) {
      return res.status(400).json({ validationError: true, body: "date" });
    }

    /* where clause 생성 */
    let caseClause = { fkClientId : null };
    if (date.length) {
      caseClause = { fkClientId: null, date: date };
    } else { return res.status(400).json({ validationError: true, body: "date" }); }

    let fieldClause = {};
    if (field.length) {
      // field = JSON.parse(field);
      let reformattedFieldArray = field.map((x) => {
        let rx = {};
        rx[x] = true;
        return rx;
      });
      fieldClause = { [Op.or] : reformattedFieldArray};
    }

    let locationClause = {};
    if (location.length) {
      let reformattedLocationArray = location.map((x) => {
        let rx = {};
        rx[x] = true;
        return rx;
      });
      locationClause = { [Op.or] : reformattedLocationArray };
    }
    // 예시 fieldClause = {  [Op.or] : [ {family:true}, {relationship:true} ]  }

    const searchResults = await User.findAll({
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
    return res.status(200).json({searchResults: searchResults, condition: condition });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

/** err / 참고
   * 정보를 가져오거나 where문에 조건으로써 model이 들어가기 위해서는 include에 모델이 명시가 되어야 한다(err: Unknown column ~ in 'where clause')
   * include clause에는 model, as를 둘 다 명시해야 한다(이를 위해 model/index.js에서 as를 명시하여 associate한다. 일대일, 일대다 포함)
   * top eagerly load(where)는 as를 통해 정의한 모델명을 사용한다.
   * 일대일의 경우 같은 foreign key를 정의한 hasOne, belongsTo를 모두 사용하여 associate한다.
   * location, field가 정의되지 않은(해당 상담사의 id를 fk키로 가지고있지 않은) 상담사는 검색되지 않는다.
   */