const User = require('../models/userModel');
const ObjectId = require('mongoose').Types.ObjectId;
const messages = require("../constants/constMessages");
const { generateHashPassword, verifyPassword } = require('../helpers/commonHelper');
const authMiddleware = require("../middlewares/authMiddleware.js")

const checkDuplicateEmail = async (email) => {
    console.log("email---------------", email);
    return await User.findOne(
      { email, isActive: true },
      { _id: 1, email: 1, name: 1, isActive: 1 }
    );
};

// user registration
const registerUser = async(data) => {
    const emailDetails = await checkDuplicateEmail(data.email);
    if (emailDetails){
        return {
            isDuplicateEmail: true
        }
    }
    const hashedPassword = await generateHashPassword(data.password);

    if(!emailDetails){
        const inputData = {
            name: data.name,
            email: data.email,
            password: hashedPassword            
        }
        const userData = new User(inputData)
        const result = await userData.save();
        return result
    }
    return false;
};

const signInByPassword = async(data) => {
    const userData = await User.findOne({ email: data.email, isActive: true });
    if (!userData) {
        return false;
    }
    const isPasswordValid = await verifyPassword(data.password, userData.password);
    if (!isPasswordValid){
        return {
            incorrectPassword: true
        }
    }
    const token = await authMiddleware.generateUserToken({ 
        email: userData.email
    });
    return { token , userData};
}

/// only sign in by email

module.exports = {
    checkDuplicateEmail,
    registerUser,
    signInByPassword
};