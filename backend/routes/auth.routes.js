const router = require('express').Router();
const authCtrl = require('../controllers/auth.controllers');

router.route('/forgot-password')
    .post(authCtrl.forgotPassword);

module.exports = router;