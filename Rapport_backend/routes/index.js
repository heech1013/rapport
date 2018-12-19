const router = require('express').Router();
const passport = require('passport');

/* REST API */
router.use('/client', require('./client'));

router.use('/counselor', require('./counselor'));

router.use('/case',
  (req, res, next) => {  // authenticate 내부에서 req, res, next를 사용하기 위함
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) { return res.status(500).json({ serverError: true, message: 'JWT Authenticate Error'}); }
      if (user.userType !== 'counselor' || !user.emailAuthentication || !user.qualification) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();  // caseRouter로 넘어간다.
    })(req, res, next);  // Passport.js - Authenticate - Custom Callback / 외부 function으로부터 express의 인자들을 전달받아야 한다.
  },
  require('./case')
);

router.use('/reservation',
  (req, res, next) => {
    passport.authenticate('jwt', {session: false}, function (err, user, info) {
      if (err) { return res.status(500).json({ serverError: true, message: 'JWT Authenticate Error'}); }
      if (user.userType !== 'client' || !user.emailAuthentication) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();  // reservationRouter로 넘어간다.
    })(req, res, next);  // Passport.js - Authenticate - Custom Callback
  },
  require('./reservation')
);

router.use('/profile',
  (req, res, next) => {  // authenticate 내부에서 req, res, next를 사용하기 위함
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) { return res.status(500).json({ serverError: true, message: 'JWT Authenticate Error'}); }
      if (user.userType !== 'counselor' || !user.emailAuthentication || !user.qualification) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();  // profileRouter로 넘어간다.
    })(req, res, next);  // Passport.js - Authenticate - Custom Callback / 외부 function으로부터 express의 인자들을 전달받아야 한다.
  },
  require('./profile')
);

router.use('/manage',
  (req, res, next) => {  // authenticate 내부에서 req, res, next를 사용하기 위함
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
      if (err) { return res.status(500).json({ serverError: true, message: 'JWT Authenticate Error'}); }
      if (user.userType !== 'manager') {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      next();
    })(req, res, next);  // Passport.js - Authenticate - Custom Callback / 외부 function으로부터 express의 인자들을 전달받아야 한다.
  },
  require('./manage')
);

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