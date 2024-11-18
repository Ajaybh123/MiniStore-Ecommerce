const SubcategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/tokenVerification")

const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/SubcategoryController")

SubcategoryRouter.post("/", verifyAdmin, createRecord)
SubcategoryRouter.get("/", getAllRecords)
SubcategoryRouter.get("/:_id", getSingleRecords)
SubcategoryRouter.put("/:_id", verifyAdmin, updateRecord)
SubcategoryRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = SubcategoryRouter