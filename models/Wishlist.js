const mongoose = require("mongoose")

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is Mendatory"]
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product is Mendatory"]
    }

})
const Wishlist = new mongoose.model('Wishlist', WishlistSchema)
module.exports = Wishlist