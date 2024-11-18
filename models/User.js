const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Name is Mendatory"],
    },
    email:{
        type:String,
        required: [true, "Email is Mendatory"],
        unique: true
    },
    username:{
        type:String,
        required: [true, "Username is Mendatory"],
        unique: true
    },
    phone:{
        type:String,
        required: [true, "Phone is Mendatory"],
    },
    password:{
        type:String,
        required: [true, "Password is Mendatory"],
    },
    address:{
        type:String,
        default:""
    },
    pin:{
        type:Number,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    role:{
        type:String,
        default:"Buyer"
    },
    otp:{
        type:Number,
        default:-2141235235
    },
    pic:{
        type:String,
        default:""
    },
    active:{
        type:Boolean,
        default:true
    }
})
const User = new mongoose.model('User',UserSchema)
module.exports = User