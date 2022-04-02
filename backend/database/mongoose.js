// This file will handle connection logic to Mongodb
require('dotenv').config()

const MONGODB_URI = process.env.DB_STRING;
const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI)
    .then(()=>console.log('connected'))
    .catch(e=>console.log(e));


module.exports = { mongoose }