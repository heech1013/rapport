const { check } = require('express-validator/check');

const checkForClient = [
  check('email').isEmail(),
  check('password').isLength({ min:8, max:16 })
];

const checkForCounselor = [
  check('email').isEmail(),
  check('password').isLength({ min: 8, max: 16 }),
  check('price').isNumeric(),
  check('family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study').isBoolean()
];

const checkForReservation = [
  check('date', 'name', 'problem').isLength({ min: 1 }),
  check('time', 'sex', 'age').isNumeric()
];

const checkForCounselorProfile = [
  check('price').isNumeric(),
  check('family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study').isBoolean()
];

const checkForCounselorManage = [
  check('qualification',
    'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP',
    'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG'
  ).isBoolean()
];

module.exports = { checkForClient, checkForCounselor, checkForReservation, checkForCounselorProfile, checkForCounselorManage };