const mongoose = require('mongoose');


const Users = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        // unique: true,
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
    money: Number,
    savedRecipients: [
        {
           body: String,
           userId: String,
           createdAt: String,
           bankAccountNumber: String
        }
    ],
})

let UserSchema = mongoose.model("users", Users);
module.exports = UserSchema