const UserRouter = require("express").Router()
const { verifyBoth, verifyAdmin } = require("../middleware/tokenVerification")


const { userUploader } = require("../middleware/fileUploader")
const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord, login, otpSender, matchOtp, resetPassword } = require("../controllers/UserController")

UserRouter.post("/", createRecord)
UserRouter.get("/", verifyAdmin, getAllRecords)
UserRouter.get("/:_id", verifyBoth, getSingleRecords)
UserRouter.put("/:_id", verifyBoth, userUploader.single("pic"), updateRecord)
UserRouter.delete("/:_id", verifyAdmin, deleteRecord)
UserRouter.post("/login", login)
UserRouter.post("/otp-sender", otpSender)
UserRouter.post("/match-otp", matchOtp)
UserRouter.post("/reset-password", resetPassword)

module.exports = UserRouter