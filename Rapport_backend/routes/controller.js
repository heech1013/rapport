const router = require('express').Router();

const { checkForLogin } = require('../middlewares/validator/check');
const tokenVerify = require('../middlewares/tokenVerify/tokenVerify');

const login = require('./login');
const search = require('./search');
const s3Form = require('./s3Form');
const s3 = require('./s3');

/* REST API */
router.use('/client', require('./client/controller'));
router.use('/counselor', require('./counselor/controller'));
router.use('/manage', tokenVerify('manager'), require('./manage/controller'));

/* etc routes */
router.post('/login', checkForLogin, login);
router.get('/search', search);
router.get('/s3', s3Form);
router.post('/s3', s3);

/* 
  By default, if authentication fails, Passport will respond with a 401 Unauthorized status,
  and any additional route handlers will not be invoked.
  If authentication succeeds, the next handler will be invoked
  and the req.user property will be set to the authenticated user.
*/

module.exports = router;