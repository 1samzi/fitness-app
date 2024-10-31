const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../index')
const query = require('../query/query')
const moment = require('moment');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { generatePassword, generateOTP, sendEmail, generateRandomPassword } = require('../helpers/commonfile');
const { userLogin } = require('./user.controllers');

const userColl = db.collection('Users');


const forgotPassword = async(req, res, next) => {
    try{
        const reqData = { email: req.body.email }

        let userData = await query.findOne(userColl, reqData);

        if (!userData || userData.password == null) {
            const message = `Incorrect email or password.`;
            return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
        }

        const generatedPass = generateRandomPassword();
        const encryptPass = generatePassword(generatedPass);

        let updateUserData = await query.findOneAndUpdate(userColl, reqData, {$set:{password:encryptPass}});

        const emailSubject = 'Fitness App: Reseted password'
        const emailBody = `Here is the Updated password: ${generatedPass}`
        await sendEmail(req.body.email, emailSubject, emailBody);

        let obj = resPattern.successPattern(httpStatus.OK, updateUserData.ops, 'success');
        return res.status(obj.code).json(obj)

    }catch (e){
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

module.exports ={
    forgotPassword
}
