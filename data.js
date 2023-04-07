const mongoose = require("mongoose")
const studentSchema = mongoose.Schema({
    name:String,
    email:String,
    mobileNumber:String,
    whatsappNumber:String,
    gender:String,
    dob:String,
    address:String,
    workingExp:String,
    company:String,
    fees:Number,
    course:String,
    createdBy:String
})
module.exports=mongoose.model("data",studentSchema)