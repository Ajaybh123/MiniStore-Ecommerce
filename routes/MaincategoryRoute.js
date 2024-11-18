const MaincategoryRouter = require("express").Router()
const { verifyAdmin } = require("../middleware/tokenVerification")


const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord } = require("../controllers/MaincategoryController")

MaincategoryRouter.post("/", verifyAdmin, createRecord)
MaincategoryRouter.get("/", getAllRecords)
MaincategoryRouter.get("/:_id", getSingleRecords)
MaincategoryRouter.put("/:_id", verifyAdmin, updateRecord)
MaincategoryRouter.delete("/:_id", verifyAdmin, deleteRecord)

module.exports = MaincategoryRouter