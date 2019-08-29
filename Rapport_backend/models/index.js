const Sequelize = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(
  config.database, config.user, config.password, config
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.CounselorProfile = require('./CounselorProfile')(sequelize, Sequelize);
db.CounselorField = require('./CounselorField')(sequelize, Sequelize);
db.CounselorLocation = require('./CounselorLocation')(sequelize, Sequelize);
db.CounselorRentalLocation = require('./CounselorRentalLocation')(sequelize, Sequelize);
db.Certification = require('./Certification')(sequelize, Sequelize);
db.Open = require('./Open')(sequelize, Sequelize);
db.Close = require('./Close')(sequelize, Sequelize);
db.Reservation = require('./Reservation')(sequelize, Sequelize);
db.Application = require('./Application')(sequelize, Sequelize);

/* User(상담사):CounselorProfile(프로필) = 1:1 */
db.User.hasOne(db.CounselorProfile, { as: 'CounselorProfile', foreignKey: 'fkCounselorId'});
db.CounselorProfile.belongsTo(db.User, { foreignKey: 'fkCounselorId' });  // CounselorProfile 스키마에 User의 id를 'fkCounselorId'라는 이름으로 추가.
/* User(상담사):CounselorField(상담분야)` = 1:1 */
db.User.hasOne(db.CounselorField, { as: 'CounselorField', foreignKey: 'fkCounselorId'});
db.CounselorField.belongsTo(db.User, { foreignKey: 'fkCounselorId' });
/* User(상담사):CounselorLocation(상담가능지역) = 1:1 */
db.User.hasOne(db.CounselorLocation, { as: 'CounselorLocation', foreignKey: 'fkCounselorId'});
db.CounselorLocation.belongsTo(db.User, { foreignKey: 'fkCounselorId' });
/* User(상담사):CounselorRentalLocation(공간대여 상담가능지역) = 1:1 */
db.User.hasOne(db.CounselorRentalLocation, { as: 'CounselorRentalLocation', foreignKey: 'fkCounselorId'});
db.CounselorRentalLocation.belongsTo(db.User, { foreignKey: 'fkCounselorId' });
/* User(상담사):Certification(자격증) = 1:1 */
db.User.hasOne(db.Certification, { as: 'Certification', foreignKey: 'fkCounselorId'});
db.Certification.belongsTo(db.User, { foreignKey: 'fkCounselorId' });
/* User(상담사):Open(자동오픈) = 1:1 */
db.User.hasOne(db.Open, { as: 'Open', foreignKey: 'fkCounselorId' });
db.Open.belongsTo(db.User, { as: 'fkCounselor', foreignKey: 'fkCounselorId' })
/* User(상담사):Close(휴무일) = 1:M */
db.User.hasMany(db.Close, { as: 'Close', foreignKey: 'fkCounselorId' });
db.Close.belongsTo(db.User, { as: 'fkCounselor', foreignKey: 'fkCounselorId' })
/* User(상담사):Reservation(예약) = 1:M */
db.User.hasMany(db.Reservation, { as: 'Reserved', foreignKey: 'fkCounselorId' });  // Reservation 스키마에 User 스키마의 id를 'fkCounselorId'라는 이름으로 추가
db.Reservation.belongsTo(db.User, { as: 'fkCounselor', foreignKey: 'fkCounselorId' });
/* User(고객):Reservation(예약) = 1:M */
db.User.hasMany(db.Reservation, { as: 'Reserving', foreignKey: 'fkClientId' });  // Reservation 스키마에 User 스키마의 id를 'fkClientId'라는 이름으로 추가
db.Reservation.belongsTo(db.User, { as: 'fkClient', foreignKey: 'fkClientId' });
/* Reservation(예약):application(상담신청서) = 1:1 */
db.Reservation.hasOne(db.Application, { as: 'Application', foreignKey: 'fkReservationId'});  // Reservation의 prototype은 getApplication과 setApplication을 사용할 수 있게 된다.
db.Application.belongsTo(db.Reservation, { foreignKey: 'fkReservationId' });

module.exports = db;