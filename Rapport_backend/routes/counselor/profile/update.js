require('dotenv').config();
const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs')
const format = require('date-fns/format');

const validationResult = require('../../../middlewares/validator/validationResult');
const phoneNumberValidator = require('../../../middlewares/validator/phoneNumberValidator');

const { sequelize, User, CounselorProfile, CounselorField, Certification } = require('../../../models');

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'ap-northeast-2'
    });

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) next(err);
        console.log('*******************files', files);
        const {
          phoneNumber,
          name, address, price, career, simpleIntroduction, detailIntroduction,  // CounselorProfile
          family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // CounselorField
        } = fields;
        
        await validationResult(req);
        await phoneNumberValidator(phoneNumber);

        const S3Updater = (type) => new Promise((resolve, reject) => {
          let tempFilePath, srcUpdateFunc;

          if (type === '프로필') {
            tempFilePath = files.profileImg.path;
            srcUpdateFunc = (data) => new Promise(async (resolve, reject) => {
              try {
                await CounselorProfile.update({ profileImgSrc: data.Location }, { where: { fkCounselorId: id }, transaction });
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          } else if (type === '임상심리전문가') {
            tempFilePath = files.KClinicalPAImg.path;
            srcUpdateFunc = (data) => new Promise(async (resolve, reject) => {
              try {
                await Certification.update({ KClinicalPAImgSrc: data.Location }, { where: { fkCounselorId: id }, transaction });
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          } else if (type === '상담심리사') {
            tempFilePath = files.KCounselingPAImg.path;
            srcUpdateFunc = (data) => new Promise(async (resolve, reject) => {
              try {
                await Certification.update({ KCounselingPAImgSrc: data.Location }, { where: { fkCounselorId: id }, transaction });
                resolve();
              } catch (error) {
                reject(error);
              }
            });
          }

          const params = {
            Bucket: 'rapport-image',  // S3 bucket 설정
            Key: `${id}/${type}(${format(new Date(), 'YYYY-MM-DD HH:mm:ss')})`,  // S3에 저장될 파일 이름 설정
            ACL: 'public-read',  // 접근 권한. public-read여야 웹에서 이미지로 접근 가능
            Body: fs.createReadStream(tempFilePath),  // files(업로드 파일 정보).input_file(<form>의 <input>의 지정한 name 명).path(해당 파일이 저장된 임시 경로)
            ContentType: 'image/jpg'  // 웹에서 이미지를 로드했을 때 자동으로 파일이 다운로드 되는 것을 방지한다.
          };
          /* 업로드한 파일이 formidable을 통해 임시 경로에 저장된다. 이 임시파일을 S3에 업로드한다. */
          S3.upload(params, async (err, data) => {
            if (err) {
              reject(err);
            } else {
              console.log(`(1) ${type} S3 Update Success. img_src: `, data.Location);
              /* 업로드한 사진의 src를 해당 유저의 해당 DB에 업데이트한다. */
              await srcUpdateFunc(data);
              /* 임시경로에 저장된 파일을 삭제한다. */
              fs.unlink(tempFilePath, (err) => {
                if (err) {
                  reject(err);
                } else {
                  console.log(`(2) ${type} Temp Files Delete Success. temparary file path: `, tempFilePath);
                  resolve();
                }
              });
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
          if (files.profileImg !== undefined || null) {
            await S3Updater('프로필');
          }
          if (files.KClinicalPAImg !== undefined || null) {
            await S3Updater('임상심리전문가');
          }
          if (files.KCounselingPAImg !== undefined || null) {
            await S3Updater('상담심리사');
          }
          await transaction.commit();
          return res.status(201).json({ success: true });
        } catch (error) {
          await transaction.rollback();
          next(error);
        }        
      } catch (error) {
        next(error);
      }    
  })
  } catch (error) {
    next(error);
  }
};

module.exports = update;