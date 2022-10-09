const mongoose = require('mongoose');


const Transfer = mongoose.Schema({
    body: String,
    createdAt: String,
    howMuchMoney: String,
    fromUser: {
        bankAccountNumber: String,
        email: String,
        id: String
    },
    toUser: {
        bankAccountNumber: String,
        email: String,
        id: String
    }
})

let UserSchema = mongoose.model("transfers", Transfer);
module.exports = UserSchema