const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../index')
const query = require('../query/query')
const moment = require('moment');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { generatePassword, generateOTP, sendEmail, validPassword } = require('../helpers/commonfile');


const userColl = db.collection('Users');

const registerUsers = async (req, res, next) => {
    try {

        let userData = req.body

        let getUser = await query.findOne(userColl, { email: userData.email })
        if (getUser) {
            return next(new APIError(`User already exists, Plese try another email!!`, httpStatus.BAD_REQUEST, true))
        }

        userData.password = generatePassword(req.body.password)

        if (!userData.userType) {
            userData.userType = 'user'
        }

        let registerUsers = await query.insert(userColl, userData)

        let obj = resPattern.successPattern(httpStatus.OK, registerUsers.ops, 'success');
        return res.status(obj.code).json(obj)

    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}


const userLogin = async (req, res, next) => {
    try {
        const { password } = req.body;
        const reqData = { email: req.body.email }

        let userData = await query.findOne(userColl, reqData);

        if (!userData || userData.password == null) {
            const message = `Incorrect email or password.`;
            return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
        }
        const isMatch = validPassword(userData.password, password)

        if (isMatch) {
            const token = jwt.sign({ _id: userData._id, email: userData.email, userType: userData.userType }, process.env.JWT_SECRET)
            delete userData.password
            let obj = resPattern.successPattern(httpStatus.OK, { userData, token }, 'success');
            return res.status(obj.code).json(obj)
        } else {
            const message = `Incorrect email or password.`;
            return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
        }

    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getUser = async (req, res, next) => {
    try {
        let getUser = await query.find(userColl, { userType: 'user'});

        let obj = resPattern.successPattern(httpStatus.OK, getUser, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.Id;

        const getUserById = await query.findOne(userColl, { _id: ObjectId(userId) });
        let obj = resPattern.successPattern(httpStatus.OK, getUserById, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateUserById = async (req, res, next) => {
    try {

        const userId = req.params.Id
        const reqData = req.body

        const updatedObj = {
            firstName: reqData.firstName,
            lastName: reqData.lastName,
            sex: reqData.sex,
            height: reqData.height,
            heightUnit: reqData.heightUnit,
            weight: reqData.weight,
            weightUnit: reqData.weightUnit
        }
        let updateUserData = await query.findOneAndUpdate(userColl, { _id: ObjectId(userId) }, { $set: updatedObj });
        let obj = resPattern.successPattern(httpStatus.OK, updateUserData.ops, 'success');
        return res.status(obj.code).json(obj)

    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const updateUserEmailFromAdmin = async(req, res, next) => {
    try{
        const userId = req.params.Id
        const reqData = {email: req.body.email}

        let updateUserData = await query.findOneAndUpdate(userColl, { _id: ObjectId(userId) }, { $set: reqData });
        let obj = resPattern.successPattern(httpStatus.OK, updateUserData.ops, 'success');
        return res.status(obj.code).json(obj)
    }catch(e){
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const deleteUserById = async(req, res, next) => {
    try{
        const userId = req.params.Id

        let updateUserData = await query.deleteOne(userColl, { _id: ObjectId(userId) });
        let obj = resPattern.successPattern(httpStatus.OK, updateUserData.ops, 'success');
        return res.status(obj.code).json(obj)
    }catch(e){
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}



module.exports = {
    registerUsers,
    userLogin,
    getUser,
    getUserById,
    updateUserById,
    updateUserEmailFromAdmin,
    deleteUserById
}