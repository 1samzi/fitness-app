const router = require('express').Router();
const authCtrl = require('../controllers/auth.controllers');

router.route('/forgot-password')
    .post(authCtrl.forgotPassword);

router.route('/reset-password')
    .post(authCtrl.resetPassword)

module.exports = router;