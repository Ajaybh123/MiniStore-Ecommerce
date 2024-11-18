const WishlistRouter = require("express").Router()
const { verifyBoth } = require("../middleware/tokenVerification")


const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/WishlistController")

WishlistRouter.post("/", verifyBoth, createRecord)
WishlistRouter.get("/:userid", verifyBoth, getAllRecords)
WishlistRouter.get("/single/:_id", verifyBoth, getSingleRecords)
WishlistRouter.delete("/:_id", verifyBoth, deleteRecord)

module.exports = WishlistRouter