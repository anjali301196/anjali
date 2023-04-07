const mongoose = require("mongoose")
const register = mongoose.Schema({

    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    mobnumber: String

})
module.exports = mongoose.model("register", register)