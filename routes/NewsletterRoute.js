const NewsletterRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/tokenVerification")


const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/NewsletterController")

NewsletterRouter.post("/", createRecord)
NewsletterRouter.get("/",verifyAdmin, getAllRecords)
NewsletterRouter.get("/:_id",verifyAdmin, getSingleRecords)
NewsletterRouter.put("/:_id",verifyAdmin, updateRecord)
NewsletterRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = NewsletterRouter