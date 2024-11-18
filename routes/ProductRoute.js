const ProductRouter = require("express").Router()
const { verifyAdmin, verifyBoth } = require("../middleware/tokenVerification")


const { productUploader } = require("../middleware/fileUploader")
const { createRecord, getAllRecords, getSingleRecords, updateRecord, deleteRecord, updateRecordQuantity } = require("../controllers/ProductController")

ProductRouter.post("/",verifyAdmin, productUploader.array("pic"), createRecord)
ProductRouter.get("/", getAllRecords)
ProductRouter.get("/:_id", getSingleRecords)
ProductRouter.put("/:_id",verifyAdmin, productUploader.array("pic"), updateRecord)
ProductRouter.put("/quantity/:_id", verifyBoth, updateRecordQuantity)
ProductRouter.delete("/:_id",verifyAdmin, deleteRecord)

module.exports = ProductRouter