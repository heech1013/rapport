module.exports = (sequelize, DataTypes) => {
  const CounselorProfile = sequelize.define('counselorProfile', {

    // id: 자동생성
    
    // fkCounselorId: User 스키마의 상담사 id를 foreign key로 가짐.

    name: {  // 상담사 이름
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: false,
    },
    address: {  // 개인 상담사의 개인공간 주소
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {  // 상담 비용
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    career: {  // 경력 & 연혁 (데이터 형식에 대해 프론트에게 의견을 물어봐야)
      type: DataTypes.JSON,
      allowNull: true,
    },
    simpleIntroduction: {  // 한 줄 인사
      type: DataTypes.TEXT,
      allowNull: true,
    },
    detailIntroduction: {  // 소개 & 특이사항 (데이터 형식에 대해 프론트에게 의견을 물어봐야)
      type: DataTypes.JSON,
      allowNull: true,
    },

    // updatedAt : 자동 생성

    // createdAt : 자동 생성

  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style(updatedAt, createdAt)
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return CounselorProfile;
};