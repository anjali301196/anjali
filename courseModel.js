const mongoose = require("mongoose")
const courseData = mongoose.Schema(
    {
    course:String,
    // {timestamps:true}
},
{timestamps:true}
);
module.exports=mongoose.model("courseData",courseData)