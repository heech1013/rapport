/** join 이슈
 * bcrypt 설치 오류(의존성 문제. 노드 버전 문제 때문인 것으로 추정)로 인해 bcrypt-nodejs 사용 
 * isLoggedIn, isNotLoggedIn 구현
 */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator/check');

const { User, CounselorProfile, CounselorField, CounselorLocation, Case } = require('../models');

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
router.post('/', [
  check('email').isEmail(),
  check('password').isLength({ min: 8, max: 16 }),  // 비밀번호 자리수 체크(최소 8자리 최대 16자리)
  check('price').isNumeric(),
  check('family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study').isBoolean(),  // boolean 체크
], async (req, res, next) => {
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

    // 형식 체크(위 check 오류 시)
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ validationError: true, body: validationError.array() });
    }
    // 핸드폰 번호 형식 체크: - 포함
    const phoneNumberRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneNumberRegExp.test(phoneNumber)) {
      return res.status(400).json({ validationError: true, body: "phoneNumber"});
    }
    
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
    // 프로필/상담분야/지역 정보
    const id = parseInt(req.params.id, 10);
    let counselorDetail = await User.findOne({
      attributes: ['id'],
      where: { id, userType: 'counselor' },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'career', 'simpleIntroduction', 'detailIntroduction']
        },
        {
          model: CounselorField,
          as: 'CounselorField',
          attributes: [
            'family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study'
          ]
        },
        {
          model: CounselorLocation,
          as: 'CounselorLocation',
          attributes: [
            'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP',
            'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ'
          ]
        },
        {
          model: Case,
          as: 'OpenCases',
          attributes: ['date', 'time'],
          // where: { fkClientId: null }
          // 프론트가 fkClientId가 null인 케이스만 보여준다. 혹은 서버측에서 2차 가공 필요?
        }
      ]
    });
    return res.status(200).json(counselorDetail);
  } catch (error) {
    next(error);
  }
});

module.exports = router;