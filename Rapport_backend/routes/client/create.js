const bcrypt = require('bcrypt-nodejs');

const validationResult = require('../../middlewares/validator/validationResult');
const nickValidator = require('../../middlewares/validator/nickValidator');
const phoneNumberValidator = require('../../middlewares/validator/phoneNumberValidator');
const overlapTester = require('../../middlewares/overlapTester/overlapTester');
const mailer = require('../../middlewares/mailer/mailer');

const { User } = require('../../models');

const create = async (req, res, next) => {
  try{
    const { email, nick, phoneNumber, password } = req.body;
    const userType = 'client';
    
    await validationResult(req);
    await nickValidator(nick);
    await phoneNumberValidator(phoneNumber);

    await overlapTester('email', email);
    await overlapTester('nick', nick);

    const hash = await bcrypt.hashSync(password);

    await User.create({
      userType, email, nick, phoneNumber,
      password: hash
    });
  
    await mailer(email);
    
    // 계정 생성 + 이메일 전송 성공
    return res.status(200).json({ success: true });

  } catch (error) {
    next(error);
  }
};

module.exports = create;