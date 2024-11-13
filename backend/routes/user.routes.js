const router = require('express').Router();
const userCtrl = require('../controllers/user.controllers');
const { protect } = require('../middleware/auth');


router.route('/create-user')
    .post(userCtrl.registerUsers);

router.route('/login')
    .post(userCtrl.userLogin)

router.route('/get-user')
    .get(protect, userCtrl.getUser);

router.route('/getUserById/:Id')
    .get(protect, userCtrl.getUserById);


module.exports = router;