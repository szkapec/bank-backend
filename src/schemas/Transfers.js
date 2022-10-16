const mongoose = require('mongoose');


const Transfer = mongoose.Schema({
    body: String,
    createdAt: String,
    howMuchMoney: String,
    fromUser: {
        bankAccountNumber: String,
        email: String,
        id: String,
        firstName: String,
        lastName: String,
    },
    toUser: {
        bankAccountNumber: String,
        email: String,
        id: String,
        firstName: String,
        lastName: String,
    },
    fromNumber: String,
    toNumber: String,
})

let UserSchema = mongoose.model("transfers", Transfer);
module.exports = UserSchema