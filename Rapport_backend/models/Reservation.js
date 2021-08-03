module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('reservation', {
    date: {  // 날짜
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    session: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    serviceType: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    rentalLocation: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: null
    },
    address: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    confirmation: {  // 예약 확정(결제 완료)
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    }
  }, {
    timestamps: true,
    underscored: false,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  
  return Reservation;
};