const mongoose = require("mongoose")

const ContactusSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Name is Mendatory"],
    },
    phone:{
        type:String,
        required: [true, "Phone is Mendatory"],
    },
    subject:{
        type:String,
        required: [true, "Subject is Mendatory"],
    },
    message:{
        type:String,
        required: [true, "Message is Mendatory"],
    },
    active:{
        type:Boolean,
        default:true
    }
})
const Contactus = new mongoose.model('Contactus',ContactusSchema)
module.exports = Contactus