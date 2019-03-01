module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {

    // id : 자동생성
    
    userType: {  // 'client' / 'counselor'
      type: DataTypes.STRING(10),
      allowNull: false
    },
    qualification: {  // (상담사) 자격 인증 여부. 자격 인증이 완료되어야 상담사로 활동할 수 있다.
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    emailAuthentication: {  // 이메일 인증 여부
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },
    nick: {  // 일반 사용자용
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,  // (true: SNS 로그인)
    },
    provider: {  // local 및 SNS 로그인 구분
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local',
    },

    // updatedAt : 자동 생성

    // createdAt : 자동 생성

  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style(updatedAt, createdAt)
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return User;
};