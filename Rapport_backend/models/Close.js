module.exports = (sequelize, DataTypes) => {
  const Close = sequelize.define('close', {
    date: {  // 휴무일 날짜
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {  // 휴무일 시간 ex) 12시 -> 12 / 15시 -> 15
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    /* foreign key 및 자동 생성 컬럼
      id: 자동 생성
      updatedAt : 자동 생성
      createdAt : 자동 생성
      fkCounselorId : User(userType:counselor) foreign key
    */
  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  
  return Close;
};