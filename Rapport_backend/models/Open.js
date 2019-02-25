module.exports = (sequelize, DataTypes) => {
  const Open = sequelize.define('open', {
    startDate: {  // 자동 오픈 시작일
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
    endDate: {  // 자동 오픈 기한 날짜
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null
    },
    MON9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    MON18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    TUE18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    WED18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    THU18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    FRI18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SAT18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN9: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN10: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN11: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN12: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN13: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN14: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN15: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN16: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN17: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    SUN18: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    /* (foreign key 및 자동 생성 컬럼)
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
  
  return Open;
};