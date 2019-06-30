module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('application', {

    // id: 자동생성

    // fkClientId: User 스키마의 id를 foreign key로 가짐

    name: {  // 고객 실명
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sex: {  // 성별: 남(1), 여(2), 기타(3)
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    age: {  // 나이
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    problem: {  // 주 호소 문제
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // updatedAt : 자동 생성

    // createdAt : 자동 생성
  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style(updatedAt, createdAt)
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return Application;
};