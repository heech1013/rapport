/** 이슈
 * 닉네임 중복 / 비밀번호 등 프론트단에서 제한 필요
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    //id
    userType: {
      type: DataTypes.STRING(10),
      defaultValue: 'user',
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    nick: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,  // (SNS 로그인 염두)
    },
    provider: {  // local 및 SNS 로그인 구분
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local',
    },
  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return User;
};