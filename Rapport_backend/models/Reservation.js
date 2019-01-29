module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('reservation', {
    date: {  // 날짜
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {  // ex) 12시 -> 12 / 15시 -> 15
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    confirmation: {  // 예약 확정(결제 완료)
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    price: {  // (MVP) 해당 케이스를 오픈할 당시 상담사 프로필 가격 정보/ 추후 확장 가능성(따로 가격을 책정할 수 있는 기능)
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {  // (MVP) 해당 케이스를 오픈할 당시 상담사 프로필 주소(개인 상담 공간) 정보/ 추후 확장 가능성(사용자가 여러 상담 공간 중 선택할 수 있는 기능)
      type: DataTypes.TEXT,
      allowNull: false,
    },
    /* foreign key 및 자동 생성 컬럼
      id : 자동 생성
      updatedAt : 자동 생성
      createdAt : 자동 생성
      fkCounselorId : user(userType:counselor) foreign key
      fkClientId : user(userType:client) foreign key
    */
  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  
  return Reservation;
};