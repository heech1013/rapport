/** 이슈
 * MySQL - 서버를 재시작할 때마다 다시 생성되는 건지, 똑같은게 있으면 냅두는건지.. 약간 달라지면 지우고 바꾸는건지 새로 다시 만드는건지 등 확인 필요(rds에서)
 * 외부 접근 보안 설정 점검 필요(mysql admin 계정, password, port, RDS 등..)
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

db.User = require('./user')(sequelize, Sequelize);
db.Case = require('./case')(sequelize, Sequelize);
db.CounselorProfile = require('./counselorProfile')(sequelize, Sequelize);
db.CounselorField = require('./counselorField')(sequelize, Sequelize);
db.CounselorLocation = require('./counselorLocation')(sequelize, Sequelize);
db.Application = require('./application')(sequelize, Sequelize);

/* user(상담사):case(상담케이스) = 1:M */
db.User.hasMany(db.Case, {as: 'OpenCases', foreignKey: 'fkCounselorId'});  // Case 스키마에 User 스키마의 id를 'fkCounselorId'라는 이름으로 추가
db.Case.belongsTo(db.User, {foreignKey: 'fkCounselorId'});

/* user(고객):case(상담케이스) = 1:M */
db.User.hasMany(db.Case, {as: 'ReservedCases', foreignKey: 'fkClientId'});  // Case 스키마에 User 스키마의 id를 'fkClientId'라는 이름으로 추가
db.Case.belongsTo(db.User, {foreignKey: 'fkClientId'});

/* user(상담사):counselorProfile(프로필) = 1:1 */
db.User.hasOne(db.CounselorProfile, { as: 'CounselorProfile', foreignKey: 'fkCounselorId'});
db.CounselorProfile.belongsTo(db.User, {foreignKey: 'fkCounselorId'});  // CounselorProfile 스키마에 user의 id를 'fkCounselorId'라는 이름으로 추가.

/* user(상담사):counselorField(상담분야)` = 1:1 */
db.User.hasOne(db.CounselorField, { as: 'CounselorField', foreignKey: 'fkCounselorId'});
db.CounselorField.belongsTo(db.User, {foreignKey: 'fkCounselorId'});

/* user(상담사):counselorLocation(상담가능지역) = 1:1 */
db.User.hasOne(db.CounselorLocation, { as: 'CounselorLocation', foreignKey: 'fkCounselorId'});
db.CounselorLocation.belongsTo(db.User, {foreignKey: 'fkCounselorId'});

/* user(고객):application(상담신청서) = 1:1 */
db.User.hasOne(db.Application, { as: 'ClientApplication', foreignKey: 'fkClientId'});
db.Application.belongsTo(db.User, {foreignKey: 'fkClientId'});

/* 상담사의 지역(location)과 분야(field)는 User 스키마와만 1:1 association이 되어있고,
  프로필(profile)과는 association이 되어있지 않다. */
/* belongsTo 만 사용해서는 association이 이루어지지 않는다(-> +hasOne)
  1대다 관계에서 source model에 fk키가 추가되지 않더라도 include 옵션을 통해 연합된 모델들을 find할 수 있다. */

module.exports = db;