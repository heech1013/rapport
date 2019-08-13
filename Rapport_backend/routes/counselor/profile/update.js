require('dotenv').config();
const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs')

const validationResult = require('../../../middlewares/validator/validationResult');
const phoneNumberValidator = require('../../../middlewares/validator/phoneNumberValidator');

const { sequelize, User, CounselorProfile, CounselorField } = require('../../../models');

const update = async (req, res, next) => {
  try {
    const { id } = req.params;  // :id를 현우가 보내야 함. url 상에서 수정할 수 없게. id가 7인 사용자가 id가 9인 사용자의 프로필 수정 요청을 보낼 수 없게.
    const {
      phoneNumber,  // User
      name, address, price, career, simpleIntroduction, detailIntroduction,  // CounselorProfile
      family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // CounselorField
    } = req.body;

    await validationResult(req);
    await phoneNumberValidator(phoneNumber);

    const S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2'
    });

    const form = new formidable.IncomingForm();

    /* 업로드한 파일을 임시 경로에 저장한다. */
    form.parse(req, (err, fields, files) => {
      const params = {
        Bucket: 'rapport-img',  // S3 bucket 설정
        Key: `${newUser.id}/프로필`, // S3에 저장될 파일 이름 설정
        ACL: 'public-read',  // 접근 권한. public-read여야 웹에서 이미지로 접근 가능
        Body: fs.createReadStream(files.profileImg.path),  // files(업로드 파일 정보).input_file(<form>의 <input>의 지정한 name 명).path(해당 파일이 저장된 임시 경로)
        ContentType: 'image/jpg'  // 웹에서 이미지를 로드했을 때 자동으로 파일이 다운로드 되는 것을 방지한다.
      };

      /* 특정 파일을 제출했을 때만 S3에 업데이트한다. (S3의 파일명으로 지정되는 Key 값이 같으므로 기존 이미지가 새로 대체된다) */
      if (files.profileImg.size) {
        S3.upload(params, (err, data) => {
          if (err) {
            return next(err);
          } else {
            console.log('S3 Upload Success. img_src: ', data.Location);
            /* 업로드한 프로필 사진의 src를 해당 유저의 DB에 업데이트한다. */
            CounselorProfile.update({ profileImgSrc: data.Location }, { where: { fkCounselorId: id }});
          }
        });
      }
      /* 임시경로에 저장된 파일을 삭제한다. 파일 크기가 0이어도 임시 파일이 생성된다. */
      fs.unlink(files.profileImg.path, (err) => {
        if (err) {
          next(err);
        } else {
          console.log('Temp Files Delete Success. temparary file path: ', files.profileImg.path);
        }
      });
    });

    const transaction = await sequelize.transaction();
    try {
      await User.update({ phoneNumber }, { where: { id, userType: 'counselor' }, transaction });
      await CounselorProfile.update(
        { name, address, price, career, simpleIntroduction, detailIntroduction },
        { where: { fkCounselorId: id }, transaction }
      );
      await CounselorField.update(
        { family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study },
        { where: { fkCounselorId: id }, transaction }
      );
      await transaction.commit();
      return res.status(201).json({ success: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = update;