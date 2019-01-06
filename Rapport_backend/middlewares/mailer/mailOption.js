const bcrypt = require('bcrypt-nodejs');

require('dotenv').config();

const mailOption = (email) => {
  const token = bcrypt.hashSync(process.env.EMAIL_TOKEN);

  const mailOption = {
    from: "'라포' rapport5959@gmail.com",
    to: email,
    subject: '[라포] 이메일 인증링크가 도착하였습니다!'
  };
  if (process.env.NODE_ENV === 'production') {
    mailOption.html = '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>'
    + "<a href='" + process.env.EC2_DNS + ':5959/emailAuth/?email=' + email
    + '&token=' + token + "'>회원가입 인증 완료하기</a>"
  } else {
    mailOption.html =
      '<p>아래의 링크를 클릭하여 회원가입을 완료해주세요!<p>'
      + "<a href='http://localhost:5959/emailAuth/?email=" + email
      + '&token=' + token + "'>회원가입 인증 완료하기</a>"
  }

  return mailOption;
}

module.exports = mailOption;