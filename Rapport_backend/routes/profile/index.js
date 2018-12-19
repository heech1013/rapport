const router = require('express').Router();
const { check } = require('express-validator/check');
const ctrl = require('./profile.ctrl');

router.get('/:id', ctrl.show);

router.put('/:id', [
    check('price').isNumeric(),
    check('family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study').isBoolean()
  ],
  ctrl.update
);

module.exports = router;