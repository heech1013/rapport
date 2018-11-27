/** join 이슈
 * 우선은 이메일 인증 과정 없이 구현한 상태. 추후 nodemailer로 이메일 인증 추가구현?
 * 비밀번호 제한두기(몇 자 이상, 특수문자 한 개 이상 등), 비밀번호 확인(재입력, 똑같이 입력 했을 시 통과)
 * bcrypt 설치 오류(의존성 문제. 노드 버전 문제 때문인 것으로 추정)로 인해 bcrypt-nodejs 사용 
 * isLoggedIn, isNotLoggedIn 구현
 * 회원가입 시 email말고도 상담사의 이름이나 자격번호 등으로 중복 확인 절차가 필요.?
 */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');

const { User, CounselorProfile, CounselorField } = require('../models');

const router = express.Router();

/* GET '/counselor/auth': 상담사 추가. 인증 이메일의 링크를 통해 접근 */
router.get('/auth', async(req, res, next) => {
  try{
    // 올바른 경로를 통해 접근했는지를 확인하기 위해 토큰 검정.
    const { email, token } = req.query;
    let result = await bcrypt.compareSync(process.env.EMAIL_TOKEN, token);  // boolean
    if (result) {  // 토큰 일치
      await User.update(
        { emailAuthentication: true },
        { where: { userType: 'counselor', email }}
      );
      return res.status(200).json({ joinAuth: true });
    } else {
      return res.status(401).json({ joinAuth: false });
    }
  } catch(error) {
    next(error);
  }
});

/* GET '/counselor': 모든 상담사 불러오기. 아직 필요 없음  */

/* POST '/counselor': 상담사 생성(회원가입) */
router.post('/', async (req, res, next) => {
  try{

    let {
      email, phoneNumber, password,  // 계정 정보(User)
      name, address, price, career, simpleIntroduction, detailIntroduction,  // 프로필 정보(CounselorProfile)
      family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // 상담 분야 정보(CounselorField)
    } = req.body;  // 나 혼자 테스트용
    // } = req.body.counselor;  // 실제 테스트용
    let userType = 'counselor';  // 계정 정보
    // nick은 null로 입력된다.
    // counselorField 항목의 경우 true, false로만 입력 받는다(null이나 "", '' 안됨.)
    // 이메일 중복 검사
    let exEmail = await User.find({ where: { email }});
    if (exEmail) {
      return res.status(400).json({ emailOverlap: true });
    }

    let hash = bcrypt.hashSync(password);
    await User.create({
      userType, email, phoneNumber,
      password: hash,
      CounselorProfile: {
        name, address, price, career,
        simpleIntroduction, detailIntroduction
      },
      CounselorField: {
        family, relationship, personality, emotion,
        sexual, addiction, lifestyle, development, study
      }
    },{
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile'
        },
        {
          model: CounselorField,
          as: 'CounselorField'
        }
      ]
    });

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
      html: '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>' + "<a href='http://localhost:3000/counselor/auth/?email=" + email + '&token=' + token + "'>회원가입 인증 완료하기</a>"
    }
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return res.status(500).json({ join: false });
      } else {  // 계정 생성 + 이메일 전송 성공
        return res.status(200).json({ join: true });  // info 옵션 다수(messageId, accepted, rejected, pending, response)
      }
    });

  } catch (error) {
    next(error);
  }
});

/* GET '/counselor/:id' :상담사 자세히 보기 */
router.get('/:id', async (req, res, next) => {
  try{
    let id = parseInt(req.params.id, 10);
    let counselor = await User.find({ where: { userType: 'counselor', id }});
    res.render('counselor', {
      //user: req.user,
      counselor
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;