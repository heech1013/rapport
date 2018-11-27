/** 이슈
 * 
 */

/* 상담사용 상담 가능 지역 정보 */
module.exports = (sequelize, DataTypes) => {
  const CounselorLocation = sequelize.define('counselorLocation', {

    // id: 자동생성

    // fkCounselorId: User 스키마의 상담사 id를 foreign key로 가짐.

    GS: {  // 강서
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    YC: {  // 양천
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GR: {  // 구로
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    YDP: {  // 영등포
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    DJ: {  // 동작
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GC: {  // 금천
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GA: {  // 관약
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    SC: {  // 서초
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GN: {  // 강남
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    SP: {  // 송파
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GD: {  // 강동
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    MP: {  // 마포
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    EP: {  // 은평
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    SDM: {  // 서대문
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    JN: {  // 종로
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    YS: {  // 용산
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    SB: {  // 성북
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GB: {  // 강북
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    DB: {  // 도봉
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    NW: {  // 노원
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    JNg: {  // 중랑
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    DDM: {  // 동대문
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    SD: {  // 성동
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    GJ: {  // 광진
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    // updatedAt : 자동 생성

    // createdAt : 자동 생성
    
  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style(updatedAt, createdAt)
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return CounselorLocation;
};