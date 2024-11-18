const Testimonial = require("../models/Testimonial")

async function createRecord(req, res) {
    try {
        const data = new Testimonial(req.body)
        if(req.file){
            data.pic = req.file.path
        }
        await data.save()
        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        const errorMessage = []
        error.keyValue ? errorMessage.push({ name: "Testimonial Already Exist" }) : ""
        error.errors?.name ? errorMessage.push({ name: error.errors.name.message }) : ""
        error.errors?.pic ? errorMessage.push({ pic: error.errors.pic.message }) : ""
        error.errors?.message ? errorMessage.push({ message: error.errors.message.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await Testimonial.find().sort({ _id: -1 })
        res.send({ result: "done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await Testimonial.findOne({ _id: req.params._id })
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
        const data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.active = req.body.active ?? data.active
            if(req.file){
                try {
                    const fs = require("fs")
                    fs.unlinkSync(data.pic)
                } catch (error) {}
                data.pic = req.file.path
            }
            await data.save()
            res.send({ result: "Done", data:data, message: "Record is updated successfully" })
        }
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        const errorMessage = []
        error.keyValue ? errorMessage.push({ name: "Testimonial Already Exist" }) : ""
        error.errors?.name ? errorMessage.push({ name: error.errors.name.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }

}

async function deleteRecord(req, res) {
    try {
        const data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            try {
                const fs = require("fs")
                fs.unlinkSync(data.pic)
            } catch (error) {}
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