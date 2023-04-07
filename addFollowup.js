const mongoose = require("mongoose")
const addFollowup = mongoose.Schema({
    
    enqueries_id:"string",
   is_communicated :"string",
    summary:"string",
    next_followup_enquire:"string",
    next_followup_enqueries_date_time:"string",
})
module.exports=mongoose.model("followUp",addFollowup)