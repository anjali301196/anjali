const mongoose = require("mongoose")
const enqueriesSchema = mongoose.Schema({
    
    enqueries_id:String,
   is_communicated :String,
    summary:String,
    next_followup_enquire:String,
    next_followup_enqueries_date_time:String
})
module.exports=mongoose.model("Enqueries",enqueriesSchema)