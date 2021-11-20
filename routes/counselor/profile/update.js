require("dotenv").config();
const AWS = require("aws-sdk");
const formidable = require("formidable");
const fs = require("fs");
const format = require("date-fns/format");

const validationResult = require("../../../middlewares/validator/validationResult");
const phoneNumberValidator = require("../../../middlewares/validator/phoneNumberValidator");

const {
  sequelize,
  User,
  CounselorProfile,
  CounselorField,
  Certification,
} = require("../../../models");

const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    const S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: "ap-northeast-2",
    });

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) next(err);

      const {
        phoneNumber,
        name,
        address,
        price,
        career,
        simpleIntroduction,
        detailIntroduction, // CounselorProfile
        family,
        relationship,
        personality,
        emotion,
        sexual,
        addiction,
        lifestyle,
        development,
        study, // CounselorField
      } = fields;

      validationResult(req);
      phoneNumberValidator(phoneNumber);

      const updateS3 = (type) => {
        let tempFilePath, srcUpdateFunc;

        if (type === "PROFILE") {
          tempFilePath = files.profileImg.path;

          srcUpdateFunc = async (data) => {
            await CounselorProfile.update(
              { profileImgSrc: data.Location },
              { where: { fkCounselorId: id }, transaction }
            );
          };
        } else if (type === "K_CLINICAL_PA") {
          tempFilePath = files.KClinicalPAImg.path;

          srcUpdateFunc = async (data) => {
            await Certification.update(
              { KClinicalPAImgSrc: data.Location },
              { where: { fkCounselorId: id }, transaction }
            );
          };
        } else if (type === "K_COUNSELING_PA") {
          tempFilePath = files.KCounselingPAImg.path;

          srcUpdateFunc = async (data) => {
            await Certification.update(
              { KCounselingPAImgSrc: data.Location },
              { where: { fkCounselorId: id }, transaction }
            );
          };
        }

        const params = {
          // S3 bucket 설정
          Bucket: "rapport-image",
          // S3에 저장될 파일 이름 설정
          Key: `${id}/${type}(${format(new Date(), "YYYY-MM-DD HH:mm:ss")})`,
          // 접근 권한. public-read여야 웹에서 이미지로 접근 가능
          ACL: "public-read",
          // files(업로드 파일 정보).input_file(<form>의 <input>의 지정한 name 명).path(해당 파일이 저장된 임시 경로)
          Body: fs.createReadStream(tempFilePath),
          // 웹에서 이미지를 로드했을 때 자동으로 파일이 다운로드 되는 것을 방지한다.
          ContentType: "image/jpg",
        };

        /* 업로드한 파일이 formidable을 통해 임시 경로에 저장된다. 이 임시파일을 S3에 업로드한다. */
        S3.upload(params, async (err, data) => {
          if (err) {
            throw err;
          }

          /* 업로드한 사진의 src를 해당 유저의 해당 DB에 업데이트한다. */
          await srcUpdateFunc(data);

          /* 임시경로에 저장된 파일을 삭제한다. */
          fs.unlink(tempFilePath, (err) => {
            if (err) {
              throw err;
            }
          });
        });
      };

      const transaction = await sequelize.transaction();

      try {
        await User.update(
          { phoneNumber },
          { where: { id, userType: "counselor" }, transaction }
        );

        await CounselorProfile.update(
          {
            name,
            address,
            price,
            career,
            simpleIntroduction,
            detailIntroduction,
          },
          { where: { fkCounselorId: id }, transaction }
        );

        await CounselorField.update(
          {
            family,
            relationship,
            personality,
            emotion,
            sexual,
            addiction,
            lifestyle,
            development,
            study,
          },
          { where: { fkCounselorId: id }, transaction }
        );

        if (files.profileImg) {
          updateS3("PROFILE");
        } else if (files.KClinicalPAImg) {
          updateS3("K_CLINICAL_PA");
        } else if (files.KCounselingPAImg) {
          updateS3("K_COUNSELING_PA");
        }

        await transaction.commit();
        return res.status(201).json({ success: true });
      } catch (error) {
        await transaction.rollback();
        next(error);
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = update;
