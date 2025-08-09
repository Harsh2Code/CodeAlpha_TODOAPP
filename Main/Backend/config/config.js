require('dotenv').config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp'

let maskedMongoURI = mongoURI;
if(mongoURI.startsWith('mongodb+srv://')) {
    maskedMongoURI = mongoURI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$3');
}

console.log('Using MongoDB URI:', maskedMongoURI);
module.exports = {
    mongoURI,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here'
}
