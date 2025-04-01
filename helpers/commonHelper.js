const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateHashPassword = async (normalPassword) => {
    return bcrypt.hashSync(normalPassword, saltRounds)
}

const verifyPassword = async (plianPassword, hashPass) => {
    return bcrypt.compareSync(plianPassword, hashPass);
};

module.exports = {
    generateHashPassword,
    verifyPassword
}