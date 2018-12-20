const nodemailer = require('nodemailer');

const validationResult = require('../../middlewares/validator/validationResult');
const nickValidator = require('../../middlewares/validator/nickValidator');
const phoneNumberValidator = require('../../middlewares/validator/phoneNumberValidator');
const overlapTester = require('../../middlewares/overlapTester/overlapTester');

const { User } = require('../../models');

const create = async (req, res, next) => {
  try{
    const { email, nick, phoneNumber, password } = req.body;
    const userType = 'client';
    
    await validationResult();
    await nickValidator(nick);
    await phoneNumberValidator(phoneNumber);

    await overlapTester('email', email);
    await toverlapTester('nick', nick);

    const hash = bcrypt.hashSync(password);
    await User.create({
      userType, email, nick, phoneNumber,
      password: hash
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
      html: '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>' + "<a href='http://localhost:3000/client/auth/?email=" + email + '&token=' + token + "'>회원가입 인증 완료하기</a>"
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

module.exports = create;