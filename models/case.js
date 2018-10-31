module.exports = (sequelize, DataTypes) => {
  const Case = sequelize.define('case', {
    // counselorId(케이스 담당 상담사): foreign key
    // counselor_location: 보여줄 때만 include로 보여주면 될 듯. 다시 확인 필요
    
    price: {  // 해당 케이스에 상담사가 정한 가격
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {  // 상담 날짜
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {  // value로 치환한 한시간 단위 range (ex:  12:00 ~ 12:50 -> 1 )
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // userId(상담신청고객): foreign key

  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return Case;
};