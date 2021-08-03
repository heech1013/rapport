module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define('application', {
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
  }, {
    timestamps: true,
    underscored: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return Application;
};