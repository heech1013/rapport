const bcrypt = require('bcrypt-nodejs');

const validationResult = require('../../middlewares/validator/validationResult');
const phoneNumberValidator = require('../../middlewares/validator/phoneNumberValidator');
const overlapTester = require('../../middlewares/overlapTester/overlapTester');
const mailer = require('../../middlewares/mailer/mailer');

const { User, CounselorField, CounselorLocation, CounselorProfile, Open } = require('../../models');

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
          GS : false, YC : false, GR : false, YDP : false, DJ : false, GC : false, GA : false, SC : false, GN : false, SP : false, GD : false, MP : false,
          EP : false, SDM : false, JN : false, YS : false, SB : false, GB : false, DB : false, NW : false, JNg : false, DDM : false, SD : false, GJ : false, JG : false
        },
        Open: {
          "startDate": null, "endDate": null,
          "MON9": false, "MON10": false, "MON11": false, "MON12": false, "MON13": false, "MON14": false,"MON15": false,"MON16": false, "MON17": false, "MON18": false,
          "TUE9": false, "TUE10": false, "TUE11": false, "TUE12": false, "TUE13": false, "TUE14": false,"TUE15": false,"TUE16": false, "TUE17": false, "TUE18": false,
          "WEN9": false, "WEN10": false, "WEN11": false, "WEN12": false, "WEN13": false, "WEN14": false,"WEN15": false,"WEN16": false, "WEN17": false, "WEN18": false,
          "THU9": false, "THU10": false, "THU11": false, "THU12": false, "THU13": false, "THU14": false,"THU15": false,"THU16": false, "THU17": false, "THU18": false,
          "FRI9": false, "FRI10": false, "FRI11": false, "FRI12": false, "FRI13": false, "FRI14": false,"FRI15": false,"FRI16": false, "FRI17": false, "FRI18": false,
          "SAT9": false, "SAT10": false, "SAT11": false, "SAT12": false, "SAT13": false, "SAT14": false,"SAT15": false,"SAT16": false, "SAT17": false, "SAT18": false,
          "SUN9": false, "SUN10": false, "SUN11": false, "SUN12": false, "SUN13": false, "SUN14": false,"SUN15": false,"SUN16": false, "SUN17": false, "SUN18": false
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
          },
          {
            model: Open,
            as: 'Open'
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