/** join 이슈
 * 비밀번호 재확인 구현(클라이언트 단)
 * 이메일, 비밀번호 유효성 검사 필요(ts)
 * bcrypt 설치 오류(의존성 문제. 노드 버전 문제 때문인 것으로 추정)로 인해 bcrypt-nodejs 사용 
 * isLoggedIn, isNotLoggedIn 구현
 */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');

const { User } = require('../models');

const router = express.Router();

/* GET '/user/auth' : 일반 사용자 추가. 인증 이메일의 링크를 통해 접근 */
router.get('/auth', async (req, res, next) => {
  try {
    // 올바른 경로를 통해 접근했는지를 확인하기 위해 토큰 검정.
    const { email, token } = req.query;
    console.log('.env.EMAIL_TOKEN='+process.env.EMAIL_TOKEN);
    console.log('token='+token);
    let result = await bcrypt.compareSync(process.env.EMAIL_TOKEN, token);  // boolean
    if (result) {
      return res.status(200).json({ message: 'Authentication Success', email });
    } else {
      return res.status(401).json({ message: 'Authentication Failed' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 클라이언트단에서 서버의 성공 코드/메시지를 받은 유저에게만 뷰를 제공하도록 제어 가능. */

router.post('/auth', async (req, res, next) => {
  try {
    const { email, nick, password } = req.body;
    let hash = bcrypt.hashSync(password);
    await User.create({
      email,
      nick,
      password: hash
    });
    return res.status(201).json({ message: 'Account Created' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* GET '/user' : 일반 사용자 모두 조회. 아직 필요 없음 */

/* POST '/user' : 회원가입(이메일 인증) */
// GET '/join/user'의 form으로부터 정보 전달 받음. page.js 참고
router.post('/', async (req, res, next) => {
  try {
    let { email } = req.body;
    let exUser = await User.find({ where: { email }});
    if (exUser) {
      res.status(400).json({ message: 'Duplicate Email Error' });
      //return res.redirect('/join');
      return;
    }
    let token = bcrypt.hashSync(process.env.EMAIL_TOKEN);  // 인증경로 검증을 위한 토큰 생성(인증코드->암호화)
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rapport5959@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });
    let mailOption = {
      from: "'라포' rapport5959@gmail.com",
      to: email,
      subject: '[라포] 이메일 인증링크가 도착하였습니다!',
      html: '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>' + "<a href='http://localhost:5959/user/auth/?email=" + email + '&token=' + token + "'>회원가입 인증 완료하기</a>"
    }
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        res.status(500).json({ message: 'Mail Send Error' });
      } else {  // 성공
        res.status(200).json({ message: info.envelope });  // info 옵션 다수(messageId, accepted, rejected, pending, response)
      }
    });

    //return res.redirect('/');
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = router;