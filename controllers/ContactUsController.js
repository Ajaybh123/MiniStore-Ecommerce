const Contactus = require("../models/ContactUs")
const mailer = require("../mailer/mail")

async function createRecord(req, res) {
    try {
        const data = new Contactus(req.body)
        await data.save()

        mailer.sendMail({
            from: process.env.EMAIL_SENDER,
            to: data.email,
            subject: "Your Query has been recived : Team Ministore",
            text: `
                   Hello ${data.name}
                   Your Query has been recived 
                   Our team connect with you very soon
                   Team : Ministore

                 `
        })

        mailer.sendMail({
            from: process.env.EMAIL_SENDER,
            to: process.env.EMAIL_SENDER,
            subject: "You have recived new Query by customer",
            text: `
                  Name : ${data.name}
                  Email : ${data.email}
                  Phone : ${data.phone}
                  Subject : ${data.subject}
                  Message : ${data.message}
                 `
        })

        res.send({ result: "Done", data: data })
    } catch (error) {
        console.log(error)
        const errorMessage = []
        error.errors?.name ? errorMessage.push({ name: error.errors.name.message }) : ""
        error.errors?.email ? errorMessage.push({ email: error.errors.email.message }) : ""
        error.errors?.phone ? errorMessage.push({ phone: error.errors.phone.message }) : ""
        error.errors?.subject ? errorMessage.push({ subject: error.errors.subject.message }) : ""
        error.errors?.message ? errorMessage.push({ message: error.errors.message.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await Contactus.find().sort({ _id: -1 })
        res.send({ result: "done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await Contactus.findOne({ _id: req.params._id })
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
        const data = await Contactus.findOne({ _id: req.params._id })
        if (data) {
            data.active = req.body.active ?? data.active
            await data.save()

            mailer.sendMail({
                from: process.env.EMAIL_SENDER,
                to: data.email,
                subject: "Your Query has been resolved : Team Ministore",
                text: `
                       Hello ${data.name}
                       Your Query has been resolved 
                       If you have any other query please connect with us!
                       Team : Ministore
    
                     `
            })
            
            res.send({ result: "Done", data:data, message: "Record is updated successfully" })
        }
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {       
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}

async function deleteRecord(req, res) {
    try {
        const data = await Contactus.findOne({ _id: req.params._id })
        if (data.active)
            res.send({ result: "Fail", message: "You Can't delete active message" })
        else{
            await data.deleteOne()
            res.send({ result: "Done", message: "Record is deleted successfully" })
        }
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