module.exports = (sequelize, DataTypes) => {
  const Certification = sequelize.define('certification', {
    KCounselingPA_1: {  // 한국상담심리학회 상담심리전문가 1급
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    KCounselingPA_2: {  // 한국상담심리학회 상담심리전문가 2급
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    KClinicalPA: {  // 한국임상심리학회 임상심리전문가
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    KCounselingPAImgSrc: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    KClinicalPAImgSrc: {
      type: DataTypes.STRING(200),
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });

  return Certification;
};