const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator/check');
const { User, CounselorProfile, CounselorField, CounselorLocation, Case } = require('../../models');

const emailAuth = async(req, res, next) => {
  try{
    // 올바른 경로를 통해 접근했는지를 확인하기 위한 토큰 검정.
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
};

const create = async (req, res, next) => {
  try{
    const {
      email, phoneNumber, password,  // User
      name, address, price, career, simpleIntroduction, detailIntroduction,  // CounselorProfile
      family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // CounselorField
    } = req.body;
    const userType = 'counselor';
    // counselor의 nick은 null
    // counselorField 항목의 경우 true, false로만 입력 받는다(null, "", '' 안됨)

    // req check 결과
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
    const exEmail = await User.find({ where: { email }});
    if (exEmail) {
      return res.status(400).json({ emailOverlap: true });
    }

    const hash = bcrypt.hashSync(password);
    await User.create({  // create in association
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
    const token = bcrypt.hashSync(process.env.EMAIL_TOKEN);  // 이메일 인증경로 검증을 위한 토큰 생성 (.env 인증코드 -> 암호화)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rapport5959@gmail.com',
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const mailOption = {
      from: "'라포' rapport5959@gmail.com",
      to: email,
      subject: '[라포] 이메일 인증링크가 도착하였습니다!',
      html: '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>' + "<a href='http://localhost:3000/counselor/auth/?email=" + email + '&token=' + token + "'>회원가입 인증 완료하기</a>"
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return res.status(500).json({ join: false });
      } else {  // 계정 생성 + 이메일 전송 성공
        return res.status(200).json({ join: true });
      }
    });
  } catch (error) {
    next(error);
  }
};

const show = async (req, res, next) => {
  try{
    // const id = parseInt(req.params.id, 10);
    const { id } = req.params;
    const counselorDetail = await User.findOne({
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
          where: { fkClientId: null }
        }
      ]
    });
    return res.status(200).json(counselorDetail);
  } catch (error) {
    next(error);
  }
};

module.exports = { emailAuth, create, show };