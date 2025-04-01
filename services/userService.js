const User = require('../models/userModel');

/**FUNC- TO VERIFY ACTIVE USER*/
const verifyEmployee = async (email) => {
    console.log("empId-----------", email);
    return await User.findOne(
      { email, isActive: true },
      {
        _id: 1,
        email: 1,
        name: 1,
        role: 1,
        isActive: 1,
      }
    );
};

module.exports = {
    verifyEmployee
};