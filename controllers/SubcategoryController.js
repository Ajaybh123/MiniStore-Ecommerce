const Subcategory = require("../models/Subcategory")

async function createRecord(req, res) {
    try {
        const data = new Subcategory(req.body)
        await data.save()
        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        const errorMessage = []
        error.keyValue ? errorMessage.push({ name: "Subcategory Already Exist" }) : ""
        error.errors?.name ? errorMessage.push({ name: error.errors.name.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await Subcategory.find().sort({ _id: -1 })
        res.send({ result: "done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await Subcategory.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "done", data: data })
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function updateRecord(req, res) {
    try {
        const data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.active = req.body.active ?? data.active
            await data.save()
            res.send({ result: "Done", message: "Record is updated successfully" })
        }
        else
            res.send({ result: "Fail", data:data, reason: "Internal Server Error" })
    } catch (error) {
        const errorMessage = []
        error.keyValue ? errorMessage.push({ name: "Subcategory Already Exist" }) : ""
        error.errors?.name ? errorMessage.push({ name: error.errors.name.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }

}

async function deleteRecord(req, res) {
    try {
        const data = await Subcategory.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
            res.send({ result: "Done", message: "Record is deleted successfully" })
        }
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}

module.exports = {
    createRecord,
    getAllRecords,
    getSingleRecords,
    updateRecord,
    deleteRecord
}