require('dotend').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/soci'

let maskedMongoURI = mongoURI;
if(mongoURI.startsWith('mongo+srv://')) {
    maskedMongoURI = mongoURI.replace(/(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/, '$1*****$3');
}

console.log('using mongoDB-URI: ', maskedMOngoURI);
module.exports ={
    mongoURI,
    jwtSecret: process.env.JWT_SECRET || 'your+secret+here'
}