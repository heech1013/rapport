const router = require('express').Router();

const tokenVerify = require('./tokenVerify');

/* REST API */
router.use('/client', require('./client'));
router.use('/counselor', require('./counselor'));
router.use('/case', tokenVerify('counselor'), require('./case'));
router.use('/reservation', tokenVerify('client'), require('./reservation'));
router.use('/profile', tokenVerify('counselor'), require('./profile'));
router.use('/manage', tokenVerify('manager'), require('./manage'));

/* etc routes */
router.use('/login', require('./login'));
router.use('/search', require('./search'));

/* 
  By default, if authentication fails, Passport will respond with a 401 Unauthorized status,
  and any additional route handlers will not be invoked.
  If authentication succeeds, the next handler will be invoked
  and the req.user property will be set to the authenticated user.
*/

module.exports = router;