/** 이슈
 * MySQL - 서버를 재시작할 때마다 다시 생성되는 건지, 똑같은게 있으면 냅두는건지.. 약간 달라지면 지우고 바꾸는건지 새로 다시 만드는건지 등 확인 필요
 * 외부 접근 보안 점검 필요(mysql admin 계정, password, port, RDS 등..)
 */
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
  config.database, config.user, config.password, config
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Counselor = require('./counselor')(sequelize, Sequelize);
db.Case = require('./case')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

/** 상담사:상담케이스 = 1:M */
db.Counselor.hasMany(db.Case)  //default option: { foreignKey: 'counselorId', sourceKey: 'id'}
db.Case.belongsTo(db.Counselor) //default option: { foreignKey: 'counselorId', sourceKey: 'id '}
/** 고객:상담케이스 = 1:M */
db.User.hasMany(db.Case)  //default option: { foreignKey: 'userId', sourceKey: 'id'}
db.Case.belongsTo(db.User)  //default option: { foreignKey: 'userId', sourceKey: 'id'}

module.exports = db;