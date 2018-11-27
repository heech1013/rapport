const express = require('express');

// // 날짜 관련 메소드(date-fns)
// const format = require('date-fns/format');
// const addDays = require('date-fns/add_days');
// const eachDay = require('date-fns/each_day');

// const { Counselor, Case } = require('../models');

const router = express.Router();

/* GET '/case' : 모든 케이스 조회(관리자용) */

/* POST */

// /* GET case/:id : 케이스 추가 form view 요청 */
// router.get('/:id', async (req, res, next) => {  // id는 counselor의 id이다.
//   /** 기능
//    * 1일 ~ 8일 후의 각각의 날짜에 대하여 원하는 시간대의 케이스를 고를 수 있다.
//    * 한 케이스의 시간은 정시부터 50분간(임의 설정)
//    * 복수선택 가능(여러 케이스를 한 번에 열 수 있다)
//    * 이미 오픈한 케이스는 선택불가처리 되어야 한다.
//    * 선택한 케이스들에 대한 정보를 서버단으로 넘겨준다.
//    */
  
//   /** back -> front 로 보내는 정보
//    * 그 날로부터 1일 후의 날짜부터 8일 후의 날짜까지의 배열
//    * 1일 후의 날짜부터 8일 후의 날짜 사이에 해당 상담사가 오픈한 케이스 목록
//    * req.user(layout에 사용. layout의 코드는 추후 따로 점검 필요)
//    * 위의 내 판단과는 별개로 백단에서 프론트단으로 어떤 정보를 넘겨주어야 프론트단 입장에서 정보를 보기좋게 재단에서 표현하고, 
//      또 서버단으로 정보를 편리하게 넘겨줄 수 있을 지 현우가 다시 판단할 필요 있음
//    * 
//    */
  
//   try{
//     // 내일부터 일주일 사이의 날짜배열을 구한다.
//     let today = format(new Date(), 'YYYY-MM-DD');
//     let firstDay = format( addDays(today, 1), 'YYYY-MM-DD');
//     let lastDay = format( addDays(today, 8), 'YYYY-MM-DD');
//     let possibleDays = eachDay(firstDay, lastDay);  // 1~8일 사이의 날짜를 배열로 반환
//     for(i = 0; i < 8; i++) {
//       possibleDays[i] = format(possibleDays[i], 'YYYY-MM-DD');
//     }

//     let id = parseInt(req.params.id, 10);
//     // 이미 오픈한 케이스 목록을 가져온다. 해당 케이스는 프론트단에서 체크하지 못하도록 조치하기 위해서
//     // ㄴ> 추후 구현이 필요. 현재 프론트로 넘기기는 하지만 사용하지는 않는 정보.
//     let openedCaseList = await Case.findAll({
//       where: {
//         counselorId: id,  // 해당 counselor가 오픈한 케이스 목록을 가져온다.
//         date: {
//           // firstDay와 lastDay 사이의 날짜를 date로 가진 데이터를 가져온다.
//           between: [firstDay, lastDay]
//         }
//       }
//     });

//     res.render('case_enrollment_form', {
//       user: req.user,
//       possibleDays,
//       openedCaseList
//     })

//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// /* POST /case/:id : 케이스 추가 기능 */
// router.post('/:id', async (req, res, next) => {
//   try {
//     /** 기능
//      * 프론트단은 상담자가 오픈하고자 하는 케이스에 대한 정보를 서버단에 넘겨준다.
//      * 서버단은 프론트로부터 받은 정보를 바탕으로 Case 스키마에 적절한 columns를 삽입한다.
//      */
//     /** front -> back 으로 보내는 정보
//      * 오픈하고자 하는 케이스의 날짜와 시간에 대한 정보.
//      * 즉 오픈하겠다고 체크한 케이스의 date, time 정보만 있으면 된다.(Case model 참고)
//      */
//     /** 구현하기 어려운 점
//      * 배열이나 json으로 들어오는 정보를 MySQL에 넣는 방법(여러 개의 column을 한 번에 넣어야 한다는 점, 몇 개가 들어올지 모르는 점도 문제)
//      * 프론트로부터 정보를 어떻게 받아야 서버단에서 MySQL에 multiple columns을 효율적으로 삽입할 수 있을지 모르겠다(현재 찾아보는 중)
//      */
//     /** MySQL 삽입 예시(Cases)
//      * |id|price|   date    |time|counselorId(foreign key)|userId(foreign key)|
//      *  13    5   2018-12-01   1            23                      null
//      *  14    5   2018-12-01   3            23                      null
//      *  15    5   2018-12-02   1            23                      null
//      * case의 id는 자동순차증가, price는 미리 정해진 정보, counselorId는 라우터 진입 시의 :id로부터 받을 수 있다. userId는 추후 예약이 성사될 때 추가.
//        프론트단에게 받아야 할 정보는 date와 time.
//      * 
//      */
//     /* 날짜 데이터 자체를 주고받지 말고, 이런 식으로 변환해서 주고받는 것도 고려
//                     | today+1 | +2 | +3 | +4 | +5 | +6 | +7 | +8
//       12:00 - 12:50 |   1a      2a   3a   4a   5a   6a   7a   8a
//       13:00 - 13:50 |   1b      2b   3b   4b   5b   6b   7b   8b
//     */

//     let today = format(new Date(), 'YYYY-MM-DD');
//     let firstDay = format( addDays(today, 1), 'YYYY-MM-DD');
//     let lastDay = format( addDays(today, 8), 'YYYY-MM-DD');
//     let possibleDays = eachDay(firstDay, lastDay);
//     for(let i = 0; i < 8; i++) {
//       possibleDays[i] = format(possibleDays[i], 'YYYY-MM-DD');
//     }

//     let { id } = req.params;
//     let { price } = req.body;
//     let inputList = [];
//     for(let j = 0; j < 8; j++) {
//       eval('inputList[j] = req.body.time_of_' + possibleDays[j] + ';');
//     }

//     /* 
//       inputList[1] = req.body.time_of_2018-10-09; <- [1,2,..] 이런 식? {1,2,...}?
//       inputList[2] = req.body.time_of_2018-10-10; <- [2,3,..]
//       ...
//       inputList = [[1,2], [2,3], [..], ...]
//       inputList[1] = [1,2]
//       inputList[1][1] = 1
//       inputList[1][2] = 2
//     */
   
//     /*
//     // 디비 요청 너무 과도하게 들어간다 배포용으로는 절대 안될듯.
//     for(let y = 0; y < 8; y++) {
//       for(let x in inputList[y]) {
//         await Case.create({
//           counselorId: id,
//           price,
//           date: possibleDays[y],
//           time: x,
//           userId: null,  // ?  
//         });
//       }
//     }
//     */

//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;