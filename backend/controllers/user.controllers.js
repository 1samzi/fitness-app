const APIError = require('../helpers/APIError');
const resPattern = require('../helpers/resPattern');
const httpStatus = require('http-status');
const db = require('../index')
const query = require('../query/query')
const moment = require('moment');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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

        if(!userData.userType){
            userData.userType = 'user'
        }

        let registerUsers = await query.insert(userColl, userData)

        let obj = resPattern.successPattern(httpStatus.OK, registerUsers.ops, 'success');
        return res.status(obj.code).json(obj)

    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}


const userLogin = async(req, res, next) => {
    try {
        const { password } = req.body;
        const reqData = { email: req.body.email }

        let userData = await query.findOne(userColl, reqData);

        if (!userData || userData.password == null) {
            const message = `Incorrect email or password.`;
            return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
        }
        const isMatch = validPassword(userData.password, password)

        if(isMatch){
            const token = jwt.sign({ _id: userData._id, email: userData.email}, process.env.JWT_SECRET)
            delete userData.password
            let obj = resPattern.successPattern(httpStatus.OK, {userData, token}, 'success');
            return res.status(obj.code).json(obj)
        }else{
            const message = `Incorrect email or password.`;
            return next(new APIError(`${message}`, httpStatus.BAD_REQUEST, true));
        }

    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getUser = async(req, res, next) => {
    try{
        let getUser = await query.find(userColl);

        let obj = resPattern.successPattern(httpStatus.OK, getUser, 'success');
        return res.status(obj.code).json(obj)
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const getUserById = async(req, res, next) => {
    try{
        const userId = req.params.Id;

        const getUserById = await query.findOne(userColl, { _id : ObjectId(userId) });
        let obj = resPattern.successPattern(httpStatus.OK, getUserById, 'success');
        return res.status(obj.code).json(obj)
    }catch (e){
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
}

const addMeal = async (req, res, next) => {
    console.log("Received meal data:", req.body);
    console.log(req.params);

    try {
        const userId = req.params.Id;  
        const mealData = req.body;     

        // current date in YYYY-MM-DD format
        const date = new Date().toISOString().split('T')[0]; 
        mealData.date = date; 

        // Check if a similar meal exists for the same date, section, and label
        const existingMeal = await userColl.findOne(
            { _id: ObjectId(userId), "meals.date": date, "meals.section": mealData.section, "meals.label": mealData.label },
            { projection: { "meals.$": 1 } } 
        );

        if (existingMeal && existingMeal.meals && existingMeal.meals.length > 0) {
            const existingMealData = existingMeal.meals[0];

            // Update quantity and nutrients
            const newQuantity = existingMealData.quantity + mealData.quantity;
            const updatedNutrients = {
                protein: existingMealData.nutrients.protein + mealData.nutrients.protein,
                fat: existingMealData.nutrients.fat + mealData.nutrients.fat,
                carbohydrates: existingMealData.nutrients.carbohydrates + mealData.nutrients.carbohydrates
            };

            const updateResponse = await userColl.updateOne(
                { _id: ObjectId(userId), "meals._id": existingMealData._id },
                { $set: { "meals.$.quantity": newQuantity, "meals.$.nutrients": updatedNutrients } }
            );

            if (updateResponse.matchedCount === 0) {
                return next(new APIError('Meal update failed', httpStatus.NOT_FOUND, true));
            }

            return res.status(200).json({
                code: 200,
                message: 'Meal updated successfully',
                data: updateResponse
            });

        } else {
            // If no similar meal exists, add the new meal with a unique _id
            mealData._id = new ObjectId();

            const updateResponse = await userColl.updateOne(
                { _id: ObjectId(userId) },
                { $push: { meals: mealData } }
            );

            if (updateResponse.matchedCount === 0) {
                return next(new APIError('User not found', httpStatus.NOT_FOUND, true));  
            }

            return res.status(200).json({
                code: 200,
                message: 'Meal added successfully',
                data: updateResponse
            });
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
};

const getMealsByDate = async (req, res, next) => {
    try {
        
        const userId = req.params.Id;
        const date = req.query.date 
        console.log(req.query);
        const user = await userColl.findOne(
            { _id: ObjectId(userId) },
            { projection: { meals: { $filter: { input: "$meals", as: "meal", cond: { $eq: ["$$meal.date", date] } } } } }
        );
        if (!user) {
            return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
        }
        const mealsWithId = user.meals.map((meal) => ({
            ...meal,
            mealId: meal._id,  
        }));
        let obj = resPattern.successPattern(httpStatus.OK, mealsWithId, 'Daily meals fetched successfully');
        return res.status(obj.code).json(obj);
    } catch (e) {
        return next(new APIError(`${e.message}`, httpStatus.BAD_REQUEST, true));
    }
};

// Update meal item (acts as a delete as well)
const updateMeal = async (req, res, next) => {
    try {
        const userId = req.params.Id;
        const mealId = req.body.mealId;  
        const newQuantity = req.body.quantity;  
        const newNutrients = req.body.nutrients;  

        const user = await userColl.findOne({ _id: ObjectId(userId) });
        if (!user) {
            return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
        }

        const mealIndex = user.meals.findIndex(meal => meal._id.toString() === mealId);
        if (mealIndex === -1) {
            return next(new APIError('Meal not found', httpStatus.NOT_FOUND, true));
        }

        // If the quantity is 0, remove the meal
        if (newQuantity === 0) {
            const updateResponse = await userColl.updateOne(
                { _id: ObjectId(userId) },
                { $pull: { meals: { _id: ObjectId(mealId) } } }
            );

            if (updateResponse.modifiedCount === 0) {
                return next(new APIError('Meal not found or could not be deleted', httpStatus.BAD_REQUEST, true));
            }

            return res.status(200).json({
                code: 200,
                message: 'Meal removed successfully'
            });
        } else {
            // Update the meal quantity and nutrients
            const updateResponse = await userColl.updateOne(
                { _id: ObjectId(userId), "meals._id": ObjectId(mealId) },
                {
                    $set: {
                        "meals.$.quantity": newQuantity,
                        "meals.$.nutrients": newNutrients
                    }
                }
            );

            if (updateResponse.modifiedCount === 0) {
                return next(new APIError('Meal could not be updated', httpStatus.BAD_REQUEST, true));
            }

            return res.status(200).json({
                code: 200,
                message: 'Meal updated successfully'
            });
        }
    } catch (e) {
        return next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
    }
};

module.exports = {
    registerUsers,
    userLogin,
    getUser,
    getUserById, 
    addMeal,
    getMealsByDate,
    updateMeal
}