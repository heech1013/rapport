/** join 이슈
 * 우선은 이메일 인증 과정 없이 구현한 상태. 추후 nodemailer로 이메일 인증 추가구현?
 * 비밀번호 제한두기(몇 자 이상, 특수문자 한 개 이상 등), 비밀번호 확인(재입력, 똑같이 입력 했을 시 통과)
 * bcrypt 설치 오류(의존성 문제. 노드 버전 문제 때문인 것으로 추정)로 인해 bcrypt-nodejs 사용 
 * isLoggedIn, isNotLoggedIn 구현
 * 회원가입 시 email말고도 상담사의 이름이나 자격번호 등으로 중복 확인 절차가 필요.
 */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const { Counselor } = require('../models');

const router = express.Router();

/* GET '/counselor': 모든 상담사 불러오기. 아직 필요 없음  */

/* POST '/counselor': 상담사 생성(회원가입) */
// GET '/join/counselor'의 form으로부터 정보 전달 받음. page.js 참고
router.post('/', async (req, res, next) => {
  try {
    let { email, password, name, field, location, price, career, detail } = req.body;
    let exCounselor = await Counselor.find({ where: { email }});
    if (exCounselor) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      //return res.redirect('/join');
      return;
    }
    let hash = bcrypt.hashSync(password);
    await Counselor.create({
      // authed: false (아직 자격 인증 절차 없는 상태임. default value가 false)
      // userType: 'counselor'(default value가 counselor)
      email, name, field, location, price, career, detail,
      password: hash
    });
    //return res.redirect('/');
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* GET '/counselor/:id' :상담사 자세히 보기 */
router.get('/:id', async (req, res, next) => {
  try{
    let id = parseInt(req.params.id, 10);
    let counselor = await Counselor.find({ where: { id }});
    res.render('counselor', {
      user: req.user,
      counselor
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;