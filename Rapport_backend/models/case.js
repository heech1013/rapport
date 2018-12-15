module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('case', {

    // fkCounselorId(케이스 담당 상담사): User 스키마의 id를 foreign key로 가짐

    // fkClientId(상담신청 고객): User 스키마의 id를 foreign key로 가짐. 값이 있다는 것은 최소한 예약 신청 단계에 있다는 의미이다.

    date: {  // 상담 날짜
      type: DataTypes.DATEONLY,  // 자료형 검토 필요
      allowNull: false,
    },
    time: {  // value로 치환한 한시간 단위 range (ex: 12:00 ~ 12:50 -> 1 )
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    confirmation: {  // 예약 확정(결제 완료)
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    price: {  // 해당 케이스를 오픈할 당시 상담사 프로필 가격 정보
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {  // 해당 케이스를 오픈할 당시 상담사 프로필 주소 정보
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

  return Case;
};