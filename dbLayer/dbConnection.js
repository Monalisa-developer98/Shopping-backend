const mongoose = require("mongoose");
const dbUrl = `${process.env.DATABASE_URL}/${process.env.DB_NAME}`;

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(dbUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(error) {
        console.log(error);
        console.info(`Error while connecting to database, ${error} `);
        process.exit(1);
    }
}

module.exports = connectDB;