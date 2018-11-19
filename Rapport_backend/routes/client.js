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

/* GET '/client/auth' : 일반 사용자 추가. 인증 이메일의 링크를 통해 접근 */
router.get('/auth', async (req, res, next) => {
  try {
    // 올바른 경로를 통해 접근했는지를 확인하기 위해 토큰 검정.
    const { email, token } = req.query;
    let result = await bcrypt.compareSync(process.env.EMAIL_TOKEN, token);  // boolean
    if (result) {  // 토큰 일치
      await User.update(
        { emailAuthentication: true },
        { where: { userType: 'client', email }}
      );
      // 500 추가: 디비 insert 실패했을 경우
      return res.status(200).json({ message: 'Email Authentication Success' });
    } else {
      return res.status(401).json({ message: 'Email Authentication Failed' });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* GET '/client' : 일반 사용자 모두 조회. 아직 필요 없음 */

/* POST '/client' : 회원가입(이메일 인증) */
// GET '/join/client'의 form으로부터 정보 전달 받음. page.js 참고
router.post('/', async (req, res, next) => {
  try {
    let { email, nick, phoneNumber, password } = req.body.client;  // req.body.client.email 형식으로 전달됨. 실제 테스트용
    // let { email, nick, phoneNumber, password } = req.body;  // 나혼자 테스트 용
    let userType = 'client';

    let exUser = await User.find({ where: { email }});
    if (exUser) {  // 없으면 exUser가 어떻게 출력이 되며, 그거에 따라 if(false)가 될련지 검증 필요
      return res.status(400).json({ message: 'Already Existing Email' });
    }
    let hash = bcrypt.hashSync(password);
    await User.create({
      userType,
      email,
      nick,
      phoneNumber,
      password: hash
    });
    // res.status(201).json({ message: 'Account Created' });  // catch를 따로 줘서 각각의 에러처리가 필요.
    // 굳이 성공은 안보냄. 메일 전송 성공이 되면 디비 저장도 성공했다는 뜻.

    /* 이메일 전송 */
    let token = bcrypt.hashSync(process.env.EMAIL_TOKEN);  // 이메일 인증경로 검증을 위한 토큰 생성 (.env 인증코드 -> 암호화)
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
      html: '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>' + "<a href='http://localhost:5959/client/auth/?email=" + email + '&token=' + token + "'>회원가입 인증 완료하기</a>"
    }
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Mail Sending Error' });
      } else {  // 이메일 전송 성공
        return res.status(200).json({ message: 'Mail Sending Success' });  // info 옵션 다수(messageId, accepted, rejected, pending, response)
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;