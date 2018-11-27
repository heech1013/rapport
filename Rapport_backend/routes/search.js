const express = require('express');

const {
  Sequelize,
  User,
  CounselorProfile,
  CounselorLocation,
  CounselorField,
  Case
} = require('../models');
const Op = Sequelize.Op;

const router = express.Router();

/* GET '/search/counselor' : 초기 메인 화면의 검색 필터 */
router.get('/counselor', async (req, res, next) => {
  try{
    // 필터: 분야, 날짜, 지역
    // 케이스가 하나도 없으면 띄워주지 않아야 한다.
    // query문 예시 : '.../search/counselor?date=2018-11-23&field=["family", "relationship"]&location=["GS", "YC"]'
    // 값을 안주는 경우: '...?date=&field=&location='
    {
      /* Top Eagerly where load */
      // let whereClause = {
      //   userType : 'counselor',
      // };
      // let caseReservationCondition = '$OpenCases.fkClientId$';
      //   whereClause[caseReservationCondition] = null;  // 무조건 전제: 예약되지 않은 case를 가진 상담사(User)만 필터링. / 예약되지 않으면 confirmation도 없다.
      // if (date.length) {  // date 필터 조건을 넣었을 경우 해당 date를 가졌으면서 예약되지 않은 case를 가진 상담사를 필터링
      //   let caseDateCondition = '$OpenCases.date$';
      //   whereClause[caseDateCondition] = date;
      // }
      // if (field.length) {
      //   let fieldCondition = "'$counselorField." + field + "$'";
      //   whereClause[fieldCondition.replace(/^'(.*)'$/, '$1')] = true;  // 작은 따옴표를 제거하는 동시에 whereClause에 삽입해야 한다.
      // }
      // if (location.length) {
      //   let locationCondition = "'$counselorLocation." + location + "$'";
      //   whereClause[locationCondition.replace(/^'(.*)'$/, '$1')] = true;
      // }
      /* whereClause문 완성 예시
        where: {
          '$OpenCases.date$' : '2018-11-23',
          '$counselorField.family$' : true,
          '$counselorLocation.GS$' : true,
        }
      */
    }
    let { date, field, location } = req.query;
    // 예시 field = ["family", "relationship"];
    
    let caseClause = { fkClientId : null};
    if (date.length) {
      caseClause[date] = date;
    }

    let fieldClause = {};
    if (field.length) {
      field = JSON.parse(field);
      let reformattedFieldArray = field.map((x) => {
        let rx = {};
        rx[x] = true;
        return rx;
      });
      fieldClause = { [Op.or] : reformattedFieldArray};
    }
    
    let locationClause = {};
    if (location.length) {
      location = JSON.parse(location);
      let reformattedLocationArray = location.map((x) => {
        let rx = {};
        rx[x] = true;
        return rx;
      });
      locationClause = { [Op.or] : reformattedLocationArray };
    }

    // 예시 fieldClause = {  [Op.or] : [ {family:true}, {relationship:true} ]  }

    // 테스트해보기
    console.log(caseClause, fieldClause, locationClause);
    let a = await User.findAll({
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
    return res.status(200).json(a);
  } catch (error) {
    next(error);
  }

  /** 에러 없이 SELECT를 하기 위한 조건
   * 정보를 가져오거나 where문에 조건으로써 model이 들어가기 위해서는 include에 모델이 명시가 되어야 한다(err: Unknown column ~ in 'where clause')
   * include clause에는 model, as를 둘 다 명시해야 한다(이를 위해 model/index.js에서 as를 명시하여 associate한다. 일대일, 일대다 포함)
   * top eagerly load(where)는 as를 통해 정의한 모델명을 사용한다.
   * 일대일의 경우 같은 foreign key를 정의한 hasOne, belongsTo를 모두 사용하여 associate한다.
   * location, field가 정의되지 않은(해당 상담사의 id를 fk키로 가지고있지 않은) 상담사는 검색되지 않는다.
   */
  
});

module.exports = router;