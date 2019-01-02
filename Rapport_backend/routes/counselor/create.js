const bcrypt = require('bcrypt-nodejs');

const validationResult = require('../../middlewares/validator/validationResult');
const phoneNumberValidator = require('../../middlewares/validator/phoneNumberValidator');
const overlapTester = require('../../middlewares/overlapTester/overlapTester');
const mailer = require('../../middlewares/mailer/mailer');

const { User, CounselorField, CounselorLocation, CounselorProfile } = require('../../models');

const create = async (req, res, next) => {
    try {
      const {
        email, phoneNumber, password,  // User
        name, address, price, career, simpleIntroduction, detailIntroduction,  // CounselorProfile
        family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // CounselorField
      } = req.body;
      const userType = 'counselor';
      // counselor의 nick은 null

      await validationResult(req);
      await phoneNumberValidator(phoneNumber);
      await overlapTester('email', email);
  
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
        },
        CounselorLocation: {
          GS : false,
          YC : false,
          GR : false,
          YDP : false,
          DJ : false,
          GC : false,
          GA : false,
          SC : false,
          GN : false,
          SP : false,
          GD : false,
          MP : false,
          EP : false,
          SDM : false,
          JN : false,
          YS : false,
          SB : false,
          GB : false,
          DB : false,
          NW : false,
          JNg : false,
          DDM : false,
          SD : false,
          GJ : false,
          JG : false
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
          },
          {
            model: CounselorLocation,
            as: 'CounselorLocation'
          }
        ]
      });
      
      await mailer(email);
      
      // 계정 생성 + 이메일 전송 성공
      return res.status(200).json({ success: true });
  
    } catch (error) {
      next(error);
    }
  }

module.exports = create;