/** 이슈
 * 
 */

/* 상담사용 상담 분야 정보 */
module.exports = (sequelize, DataTypes) => {
  const CounselorField = sequelize.define('counselorField', {

    // id: 자동생성

    // userId: 상담사 id(foreign key)
    
    family: {  // 가족
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    relationship: {  // 대인관계
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    personality: {  // 성격
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    emotion: {  // 정서(우울 및 불안)
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    sexual: {  // 성관련
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    addiction: {  // 중독
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    lifestyle: {  // 생활습관
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    development: {  // 발달 및 교육
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    study: {  // 학업 및 진로
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }

    // updatedAt : 자동 생성

    // createdAt : 자동 생성
    
  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style(updatedAt, createdAt)
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return CounselorField;
};