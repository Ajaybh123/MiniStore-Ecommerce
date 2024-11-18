const TestimonialRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/tokenVerification")


const { testimonialUploader } = require("../middleware/fileUploader")
const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/TestimonialController")

TestimonialRouter.post("/", verifyAdmin, testimonialUploader.single("pic"), createRecord)
TestimonialRouter.get("/", getAllRecords)
TestimonialRouter.get("/:_id", getSingleRecords)
TestimonialRouter.put("/:_id", verifyAdmin, testimonialUploader.single("pic"), updateRecord)
TestimonialRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = TestimonialRouter