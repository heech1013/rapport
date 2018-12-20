const bcrypt = require('bcrypt-nodejs');


const CustomError = require('../../errorHandler/customError');
const { User } = require('../../models');

const emailAuth = async (req, res, next) => {
  try {
    // 올바른 경로를 통해 접근했는지를 확인하기 위해 토큰 검정.
    const { email, token } = req.query;
    let result = await bcrypt.compareSync(process.env.EMAIL_TOKEN, token);  // boolean
    if (result) {  // 토큰 일치
      await User.update(
        { emailAuthentication: true },
        { where: { userType: 'client', email }}
      );
      return res.status(200).json({ joinAuth: true });
    } else {
      return next(CustomError('TokenError'));
    }
  } catch (error) {
    next(error);
  }
};



module.exports = { emailAuth, create };