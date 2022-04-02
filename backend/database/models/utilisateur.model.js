const mongoose = require('mongoose')
const Schema = mongoose.Schema


const utilisateurSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Utilisateur", utilisateurSchema)