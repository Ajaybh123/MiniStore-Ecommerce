const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/mail")

async function createRecord(req, res) {
    try {
        const data = new Newsletter(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.EMAIL_SENDER,
            to: data.email,
            subject: "Thank to Subscribe our newsletter service : Team Ministore",
            text: `
                    Thank to Subscribe our newsletter service
                    Team : Ministore
                `
        })
        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        const errorMessage = []
        error.keyValue ? errorMessage.push({ email: "Your Email Already Connected With Us" }) : ""
        error.errors?.email ? errorMessage.push({ email: error.errors.email.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await Newsletter.find().sort({ _id: -1 })
        res.send({ result: "done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await Newsletter.findOne({ _id: req.params._id })
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
        const data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.email = req.body.email ?? data.email
            data.active = req.body.active ?? data.active
            await data.save()
            res.send({ result: "Done", data: data, message: "Record is updated successfully" })
        }
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}

async function deleteRecord(req, res) {
    try {
        const data = await Newsletter.findOne({ _id: req.params._id })
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