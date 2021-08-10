const { check } = require('express-validator/check');

const checkForParamId = [
  check('id').isLength({ min: 1 }).isNumeric()
];

const checkForClientId = [
  check('clientId').isLength({ min: 1 }).isNumeric()
];

const checkForCounselorId = [
  check('counselorId').isLength({ min: 1 }).isNumeric()
];

const checkForCreateClient = [
  check('email').isLength({ min: 1 }).isEmail(),
  check('password').isLength({ min: 8, max: 16 })
];

const checkForCreateClientRsv = [
  check('date', 'address', 'name', 'problem').isLength({ min: 1 }),
  check('clientId', 'counselorId', 'time', 'price', 'sex', 'age').isLength({ min: 1 }).isNumeric()
];

const checkForDestroyClientRsv = [
  check('id', 'clientId').isLength({ min: 1 }).isNumeric()
];

const checkForCreateCounselor = [
  check('email').isLength({ min: 1 }).isEmail(),
  check('password').isLength({ min: 8, max: 16 }),
  check('price').isLength({ min: 1 }).isNumeric(),
  check(
    'family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study'
  ).isLength({ min: 1 }).isBoolean()
];

const checkForUpdateCounselorProfile = [
  check('id', 'price').isLength({ min: 1 }).isNumeric(),
  check(
    'family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study'
  ).isLength({ min: 1 }).isBoolean()
];

const checkForManageCounselor = [
  check('id').isLength({ min: 1 }).isNumeric(),
  check('qualification',
    'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP',
    'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG'
  ).isLength({ min: 1 }).isBoolean()
];

const checkForLogin = [
  check('email').isLength({ min: 1 }).isEmail(),
  check('password').isLength({ min: 1 })
];

module.exports = {
  checkForParamId,
  checkForClientId,
  checkForCounselorId,
  checkForCreateClient,
  checkForCreateClientRsv,
  checkForDestroyClientRsv,
  checkForCreateCounselor,
  checkForUpdateCounselorProfile,
  checkForManageCounselor,
  checkForLogin
};