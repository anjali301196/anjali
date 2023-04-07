const mongoose = require("mongoose")
const studentEnquiry = mongoose.Schema({
    
    studentname:String,
   studentnumber :String,
    coursename:String,
    feedback:String
})
module.exports=mongoose.model("studentEnquerie",studentEnquiry)





































// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c