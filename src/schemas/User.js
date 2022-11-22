const mongoose = require('mongoose');


const Users = mongoose.Schema({
    firstName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: String,
    token: String,
    refreshToken: String,
    error: Boolean,
    message: String,
    bankAccountNumber: String,
    premium: Boolean,
    ban: Boolean,
    money: Number,
    sex: [String],
    country: String,
    savedRecipients: [
        {
            recipientsAccount: String,
            recipientsAdress: String,
            recipientsName: String,
            sum: String,
            title: String,
            toRecipient: String,
            trustedRecipient: Boolean,
            createdAt: String,
            required: false
        }
    ],
})

let UserSchema = mongoose.model("users", Users);
module.exports = UserSchema