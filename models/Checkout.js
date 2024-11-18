const mongoose = require("mongoose")

const CheckoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is Mendatory"]
    },
    orderStatus: {
        type:String,
        default:"Order Comfirmed"
    },
    paymentMode: {
        type:String,
        default:"Case on Delivery"
    },
    paymentStatus: {
        type:String,
        default:"Pending"
    },
    subtotal: {
        type:Number,
        required:[true, "Subtotal is mendatory"]
    },
    shipping: {
        type:Number,
        required:[true, "Shipping is mendatory"]
    },
    total: {
        type:Number,
        required:[true, "Total is mendatory"]
    },
    date:{
        type:String
    },
    rppid: {
        type:String,
        default:""
    },
    products:[
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product is Mendatory"]
            },
            qty: {
                type: Number,
                required: [true, "Qty is Mendatory"]
            },
            total: {
                type: Number,
                required: [true, "Color is Mendatory"],
            }
        }
    ]
    

})
const Checkout = new mongoose.model('Checkout', CheckoutSchema)
module.exports = Checkout