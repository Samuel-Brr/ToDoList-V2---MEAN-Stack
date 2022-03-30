// This file will handle connection logic to Mongodb

const MONGODB_URI = 'mongodb+srv://Sml-Brr:YVmG4mNq24wxbku2@cluster0.jt4fy.mongodb.net/toDoListV2?retryWrites=true&w=majority'
const mongoose = require('mongoose')

mongoose.connect(MONGODB_URI)
    .then(()=>console.log('connected'))
    .catch(e=>console.log(e));


module.exports = { mongoose }