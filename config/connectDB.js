const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

// Connecting to Mongo Database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Hurray! Connected to database");
    } catch (err) {
        console.error(err);
    }
};

module.exports = connectDB;