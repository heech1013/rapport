const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
  config.database, config.user, config.password, config
);

let db = {};
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
db.Case.belongsTo(db.User, {as: 'fkCounselor', foreignKey: 'fkCounselorId'});

/* user(고객):case(상담케이스) = 1:M */
db.User.hasMany(db.Case, {as: 'ReservedCases', foreignKey: 'fkClientId'});  // Case 스키마에 User 스키마의 id를 'fkClientId'라는 이름으로 추가
db.Case.belongsTo(db.User, {as: 'fkClient', foreignKey: 'fkClientId'});

/* user(상담사):counselorProfile(프로필) = 1:1 */
db.User.hasOne(db.CounselorProfile, { as: 'CounselorProfile', foreignKey: 'fkCounselorId'});
db.CounselorProfile.belongsTo(db.User, {foreignKey: 'fkCounselorId'});  // CounselorProfile 스키마에 user의 id를 'fkCounselorId'라는 이름으로 추가.

/* user(상담사):counselorField(상담분야)` = 1:1 */
db.User.hasOne(db.CounselorField, { as: 'CounselorField', foreignKey: 'fkCounselorId'});
db.CounselorField.belongsTo(db.User, {foreignKey: 'fkCounselorId'});

/* user(상담사):counselorLocation(상담가능지역) = 1:1 */
db.User.hasOne(db.CounselorLocation, { as: 'CounselorLocation', foreignKey: 'fkCounselorId'});
db.CounselorLocation.belongsTo(db.User, {foreignKey: 'fkCounselorId'});

/* case(상담케이스):application(상담신청서) = 1:1 */
db.Case.hasOne(db.Application, { as: 'CaseApplication', foreignKey: 'fkCaseId'});  // Case의 prototype은 getCaseApplication과 setCaseApplication을 사용할 수 있게 된다.
db.Application.belongsTo(db.Case, {foreignKey: 'fkCaseId'});

module.exports = db;