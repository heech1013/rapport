module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('case', {

    // fkCounselorId(케이스 담당 상담사): User 스키마의 id를 foreign key로 가짐

    // fkClientId(상담신청 고객): User 스키마의 id를 foreign key로 가짐. 값이 있다는 것은 최소한 예약 신청 단계에 있다는 의미이다.

    price: {  // 해당 케이스에 상담사가 정한 가격
      type: DataTypes.INTEGER,
      allowNull: false,
    },
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