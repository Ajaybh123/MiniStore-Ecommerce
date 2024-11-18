const BrandRouter = require("express").Router()
const{ verifyAdmin }= require("../middleware/tokenVerification")

const { brandUploader } = require("../middleware/fileUploader")
const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/BrandController")

BrandRouter.post("/", verifyAdmin, brandUploader.single("pic"), createRecord)
BrandRouter.get("/", getAllRecords)
BrandRouter.get("/:_id", getSingleRecords)
BrandRouter.put("/:_id", verifyAdmin, brandUploader.single("pic"), updateRecord)
BrandRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = BrandRouter