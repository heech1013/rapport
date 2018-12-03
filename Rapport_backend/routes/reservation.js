{
// /** 이슈
//  * case.pug에서 체크박스 중복선택 안되게.
//  * 상담신청기능(POST /book_case/:id) - 관계 설정 따로 없이 userId만 추가해도 관계가 알아서 설정되는 것인지.
//  * res.render('booked_info')에 상담사 정보까지 같이 보내기
//  * 상담신청은 일반 user만 가능하게. counselor는 우선 ㄴㄴ
//  */

// const express = require('express');

// // 날짜 데이터 관련 모듈
// const format = require('date-fns/format');
// const addDays = require('date-fns/add_days');

// const { Case } = require('../models');

// const router = express.Router();

// /* GET '/reservation/:id : 상담 신청 기능 */
// router.get('/:id', async (req, res, next) => {  // id는 counselor의 id이다.
//   try {

//     /** 기능
//      * 상담사 한 명(:id를 id로 가진 상담사)에게 받을 수 있는 상담 케이스 표시
//      * 그 날로부터 1일 후 ~ 8일 후 사이의 날짜까지만 표시. 각각의 날짜에 대해 예약 가능한(오픈되어있으며 다른 사용자가 예약하지 않은 상태의 케이스의) 시간 표시
//      * 상담신청기능 이동 링크(버튼) (-> POST '/reservation/:id')
//      */

//     /** 서버단에서 프론트단으로 넘겨주는 정보
//      * 상담사의 id
//      * counselorId(foreign key)가 해당 상담사의 id와 일치하며, 동시에 userId(foreign key)가 null인(예약이 아직 되지 않은!) case 정보.
//      * req.user 정보(로그인 한 사용자의 정보)
//      */

//     let today = format(new Date(), 'YYYY-MM-DD');
//     let firstDay = format( addDays(today, 1), 'YYYY-MM-DD');
//     let lastDay = format( addDays(today, 8), 'YYYY-MM-DD');

//     let id = parseInt(req.params.id, 10);
    
//     /** 
//      * 대안 1. include 옵션을 사용해서 counselor.findAll -> counselor에 associated된 case 목록을 가져오기
//      * 대안 2. Counselor.getCase
//      * 위 대안 중 뭐가 더 나을지 점검 필요.
//      * 어떤 식으로 데이터가 리턴되는지 확인 필요.
//      */
//     let case_bookable = await Case.findAll({
//       where: {
//         counselorId: id,  // 해당 상담사(Counselor)의 케이스를 뽑아온다: 케이스 중 foreign Key(counselorId)가 id인 Case
//         userId: null,  // foreign key(User)
//         date: {
//           // [op.between]: []  // sequelize 공식문서 참고
//           between: [firstDay, lastDay]
//         }
//       }
//     });
    
//     res.render('case_reservation_form', {
//       user: req.user,  // 로그인한 사용자 정보
//       id,  // 사용자가 보고있는 상담사의 id
//       case_bookable,  // 예약 가능한 상담 목록
//     });

//   } catch (error) {
//     next(error);
// }
// });

// /* POST '/reservation/:id : 상담 신청 기능 */
// router.post('/:id', async (req, res, next) => {  // id는 counselor의 id이다.
//   /** 기능
//    * 사용자가 체크한 상담을 예약시켜준다.
//    * 예약확인정보를 사용자에게 보여준다.
//    */
//   /** 프론트단에서 서버로 넘겨주어야 하는 정보
//    * 사용자의 id
//    * 사용자가 체크한 케이스의 날짜와 시간 정보(date, time)
//    */
//   /** MySQL 삽입 예시(Cases)
//      * |id|price|   date    |time|counselorId(foreign key)|userId(foreign key)|
//      *  13    5   2018-12-01   1            23                      null
//      *  14    5   2018-12-01   3            23                      null
//      *  15    5   2018-12-02   1            23                      null
//      * 이 라우터에서 case db에 추가해야 하는 정보는 userId 밖에 없다. userId 필요.
//      * 어떤 case의 userId를 추가해야 하는지 알 수 있게 date와 time 정보 필요.
//      * counselorId는 :id로부터(req.params.id) 확인 가능
//      */
  
//   try {
//     //let counselorId = req.params.id;
//     let case_id = req.body.case_selected;
//     let user_id = req.user.id;

//     let booked_info = await Case.update({
//       userId: user_id
//     }, {
//       where: { id: case_id }
//     });

//     // 추후 몇몇 정보(id정보 등)은 걸러서 내보내도록 정리.
//     res.render('reservation_confirmation', {
//       user: req.user,
//       booked_info
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
}
const express = require('express');

const router = express.Router();

const { User, Case, Application } = require('../models');

router.get('/', async (req, res, next) => {
  try{
    let { date, time } = req.query;
    
  } catch (error) {
    next(error);
  }
});
/** 예약 프로세스
 * Application은 User가 아닌 Case에 1:1로 종속
 * 1회기 예약 -> 나머지 4회기 모두 자동으로 Case에 insert(같은 fkClientId, fkApplicationId)
 * 한 번에 잡히는 4회기의 상담케이스의 date, time을 변경할 수 있는 기능 페이지 필수 (상담사 입장에서)
 * if( 이미 해당 date와 time을 가지는 case가 open되어있다면 & (fkClientId=null) // 또는 case가 없다면 ) 변경할 수 있도록. 그 외에는 불가하게
 * Client 입장에서의 수정 기능은? 고려 필요.  (애초에 상담사 입장에서의 수정이 내담자와의 스케줄 협의 하에 이루어져야 하는데-)
 * -> 애초에 상담케이스를 열 때 가능할 떄만 열어야지. 선약이고 이게. 수정페이지 없어도 돼 그럼?
 * application에 정규표현식.
 */

module.exports = router;