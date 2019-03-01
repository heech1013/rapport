const bcrypt = require('bcrypt');

const CustomError = require('../middlewares/errorHandler/customError');
const { User } = require('../models');

require('dotenv').config();

const emailAuth = async (req, res, next) => {
    try {
      const { email, token } = req.query;
      const result = await bcrypt.compare(process.env.EMAIL_TOKEN, token);  // boolean
      if (result) {  // true, 일치
        await User.update(
          { emailAuthentication: true },
          { where: { email } }
        );
        return res.status(200).json({ success : true });
      } else {
        return next(CustomError('TokenError'));
      }
    } catch (error) {
      next(error);
    }
  }


module.exports = emailAuth;