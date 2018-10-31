/** join 이슈
 * 우선은 이메일 인증 과정 없이 구현한 상태. 추후 nodemailer로 이메일 인증 추가구현?
 * 비밀번호 제한두기(몇 자 이상, 특수문자 한 개 이상 등), 비밀번호 확인(재입력, 똑같이 입력 했을 시 통과)
 * bcrypt 설치 오류(의존성 문제. 노드 버전 문제 때문인 것으로 추정)로 인해 bcrypt-nodejs 사용 
 * isLoggedIn, isNotLoggedIn 구현
 */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');

const { User } = require('../models');

const router = express.Router();

/* GET '/user' : 일반 사용자 모두 조회. 아직 필요 없음 */

/* POST '/user' : 일반 사용자 생성(회원가입) */
// GET '/join/user'의 form으로부터 정보 전달 받음. page.js 참고
router.post('/', async (req, res, next) => {
  try {
    let { email, nick, password } = req.body;
    let exUser = await User.find({ where: { email }});
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    let hash = bcrypt.hashSync(password);
    await User.create({
      email,
      nick,
      password: hash
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router;