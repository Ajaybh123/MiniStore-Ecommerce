const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product Name is Mendatory"],
    },
    maincategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Maincategory",
        required: [true, "Maincategory is Mendatory"]
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
        required: [true, "Subcategory is Mendatory"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "Brand is Mendatory"]
    },
    color: {
        type: String,
        required: [true, "Color is Mendatory"],
    },
    size: {
        type: String,
        required: [true, "Size is Mendatory"],
    },
    basePrice: {
        type: Number,
        required: [true, "BasePrice is Mendatory"],
    },

    discount: {
        type: Number,
        required: [true, "Discount is Mendatory"],
    },
    finalPrice: {
        type: Number,
        required: [true, "Price is Mendatory"],
    },
    stock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, "Stock Quantity is Mendatory"],
    },
    discription: {
        type: String,
        required: [true, "Discription is Mendatory"],
    },
    pic:[],
    active: {
        type: Boolean,
        default: true
    }
})
const Product = new mongoose.model('Product', ProductSchema)
module.exports = Product