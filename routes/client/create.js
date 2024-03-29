const bcrypt = require('bcrypt');

const validationResult = require('../../middlewares/validator/validationResult');
const nickValidator = require('../../middlewares/validator/nickValidator');
const phoneNumberValidator = require('../../middlewares/validator/phoneNumberValidator');
const overlapTester = require('../../middlewares/overlapTester/overlapTester');

const { User } = require('../../models');

const create = async (req, res, next) => {
  try {
    const { email, nick, phoneNumber, password } = req.body;
    
    validationResult(req);
    nickValidator(nick);
    phoneNumberValidator(phoneNumber);

    overlapTester('email', email);
    overlapTester('nick', nick);

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      email, nick, phoneNumber,
      userType: 'client',
      password: hash
    });
    
    // 계정 생성
    return res.status(200).json({ success: true });

  } catch (error) {
    next(error);
  }
};

module.exports = create;