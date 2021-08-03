module.exports = (sequelize, DataTypes) => {
  const CounselorProfile = sequelize.define('counselorProfile', {
    name: {  // 상담사 이름
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: false,
    },
    address: {  // 개인 상담사의 개인공간 주소
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    price: {  // 상담 비용
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    career: {  // 경력 & 연혁
      type: DataTypes.TEXT,
      allowNull: true,
    },
    simpleIntroduction: {  // 한 줄 인사
      type: DataTypes.TEXT,
      allowNull: true,
    },
    detailIntroduction: {  // 소개 & 특이사항
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImgSrc: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return CounselorProfile;
};