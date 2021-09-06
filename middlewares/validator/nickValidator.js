const customError = require('../errorHandler/customError');

const nickValidator = (nick) => {
  const nickRegExp = /^[\w가-힣]{2,12}$/;  // 영대소문자/한글/숫자 2~12자리
  if (!nickRegExp.test(nick)) {
    throw customError('ValidationError', 'Nick is not valid.');
  }
}

module.exports = nickValidator;