const mongoose = require("mongoose")
const profileSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    Image:{
        data:Buffer,
        contentType: String
    }
})

module.exports= mongoose.model("Profile",profileSchema)