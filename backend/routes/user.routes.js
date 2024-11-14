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

router.route('/updateUser/:Id')
    .post(protect, userCtrl.updateUserById);

router.route('/updateUserEmail/:Id')
    .post(protect, userCtrl.updateUserEmailFromAdmin);

router.route('/deleteUserById/:Id')
    .delete(protect, userCtrl.deleteUserById);
router.route('/log-meal/:Id')
    .post(protect, userCtrl.addMeal);

router.route('/get-meals/:Id')
    .get(protect, userCtrl.getMealsByDate);
    
router.route('/update-meal/:Id')
.post(protect, userCtrl.updateMeal)

module.exports = router;