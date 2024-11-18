const Router = require("express").Router()

const MaincategoryRouter = require("./MaincategoryRoute")
const SubcategoryRouter = require("./SubcategoryRoute")
const BrandRouter = require("./BrandRoute")
const TestimonialRouter = require("./TestimonialRoute")
const ProductRouter = require("./ProductRoute")
const UserRouter = require("./UserRoute")
const CartRouter = require("./CartRoute")
const WishlistRouter = require("./WishlistRoute")
const CheckoutRouter = require("./CheckoutRoute")
const NewsletterRouter = require("./NewsletterRoute")
const ContactUsRouter = require("./ContactUsRoute")

Router.use("/maincategory",MaincategoryRouter)
Router.use("/subcategory",SubcategoryRouter)
Router.use("/brand",BrandRouter)
Router.use("/testimonial",TestimonialRouter)
Router.use("/product",ProductRouter)
Router.use("/user",UserRouter)
Router.use("/cart",CartRouter)
Router.use("/wishlist",WishlistRouter)
Router.use("/checkout",CheckoutRouter)
Router.use("/newsletter",NewsletterRouter)
Router.use("/contactus",ContactUsRouter)


module.exports = Router