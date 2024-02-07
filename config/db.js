const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        // console.log(`MongoDB database is connected ${conn.connection.host}`);
        
    } catch (error) {
        // console.log(`Error in MongoDB connection: ${error}`);
    }
};

module.exports = connectDB;
