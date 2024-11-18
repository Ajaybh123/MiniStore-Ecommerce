const ContactUsRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/tokenVerification")


const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/ContactUsController")

ContactUsRouter.post("/", createRecord)
ContactUsRouter.get("/", verifyAdmin, getAllRecords)
ContactUsRouter.get("/:_id", verifyAdmin, getSingleRecords)
ContactUsRouter.put("/:_id", verifyAdmin, updateRecord)
ContactUsRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = ContactUsRouter