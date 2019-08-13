require('dotenv').config();
const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');

const s3 = async (req, res, next) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2'
  });

  const form = new formidable.IncomingForm();
  /* 업로드한 파일을 formidable을 사용하여 임시 경로에 저장한다. */
  form.parse(req, (err, fields, files) => {  // files: 사용자가 업로드한 파일의 정보
    console.log('///fields: ', fields, '///files: ', files);
    const params = {
      Bucket: 'rapport-img',  // S3 bucket 설정
      Key: 'testimg-1', // S3에 저장될 파일 이름 설정
      ACL: 'public-read',  // 접근 권한. public-read여야 웹에서 이미지로 접근 가능
      Body: fs.createReadStream(files.profileImg.path),  // files(업로드 파일 정보).input_file(<form>의 <input>의 지정한 name 명).path(해당 파일이 저장된 임시 경로)
      ContentType: 'image/jpg'  // 웹에서 이미지를 로드했을 때 자동으로 파일이 다운로드 되는 것을 방지한다.
    }
    /* 임시경로에 저장된 파일을 S3에 업로드한다. */
    s3.upload(params, (err, data) => {
      if (err) {
        return next(err);
      } else {
        console.log('S3 Upload Success. img_src: ', data.Location);
      }
    });
    /* 임시경로에 저장된 파일을 삭제한다. */
    fs.unlink(files.profileImg.path, (err) => {
      if (err) {
        next(err);
      } else {
        console.log('Temp Files Delete Success. temparary file path: ', files.profileImg.path);
        return res.status(200).json({ success: true });
      }
    })
  });
}

module.exports = s3;