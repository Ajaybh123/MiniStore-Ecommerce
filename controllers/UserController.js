const User = require("../models/User")
const bcrypt = require("bcrypt")
const mailer = require("../mailer/mail")
const jwt = require("jsonwebtoken")

var passwordValidator = require('password-validator');

var schema = new passwordValidator();

schema
    .is().min(8)                                    
    .is().max(100)                                  
    .has().uppercase(1)                             
    .has().lowercase(1)                            
    .has().digits(1)                                
    .has().not().spaces()                           
    .is().not().oneOf(['Passw0rd', 'Password123']); 


function createRecord(req, res) {
    if (schema.validate(req.body.password)) {
        const data = new User(req.body)
        bcrypt.hash(req.body.password, 12, async (error, hash) => {
            if (error) {
                res.status(500).send({ result: "Fail", reason: {password : "Internal Server Error | hash password"} })
            }
            else {
                try {
                    data.role = "Buyer"
                    data.password = hash
                    jwt.sign({ data },  process.env.JWT_SECRET_KEY_BUYER, (error, token) => {
                        if (error)
                           return res.send({ result: "Fail", reason: "Something went wrong token has not created" })
                        else
                          return  res.send({ result: "Done", data:data, token:token, message: "Record Created Successfully" })
                    })

                    await data.save()

                    mailer.sendMail({
                        from: process.env.EMAIL_SENDER,
                        to: data.email,
                        subject: "Account has been created : Team Ministore",
                        text: `
                               Hello ${data.name}
                               Your Account has been Created
                               Thank You Connecting with us
                               Team : Ministore
        
                             `
                    })

                    
                } catch (error) {
                    const errorMessage = {}
                    error.keyValue?.username ? errorMessage.username = "Username Already Exist": ""
                    error.keyValue?.email ? errorMessage.email = "Email Already Exist": ""
                    error.errors?.name ? errorMessage.name = error.errors.name.message : ""
                    error.errors?.username ? errorMessage.username = error.errors.username.message: ""
                    error.errors?.email ? errorMessage.email = error.errors.email.message: ""
                    error.errors?.phone ? errorMessage.phone = error.errors.phone.message: ""
                    error.errors?.password ? errorMessage.password = error.errors.password.message: ""
                    Object.values(errorMessage).filter((x)=> x !== "") === 0 ?
                        res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
                        res.status(500).send({ result: "Fail", reason: errorMessage })
                }
            }
        })

    }
    else {
        res.send({ result: "Done", reason: "Invalid password " })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await User.find().sort({ _id: -1 })
        res.send({ result: "Done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data)
            res.send({ result: "Done", data: data })
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function updateRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name ?? data.name
            data.phone = req.body.phone ?? data.phone
            data.address = req.body.address ?? data.address
            data.city = req.body.city ?? data.city
            data.pin = req.body.pin ?? data.pin
            data.state = req.body.state ?? data.state
            data.active = req.body.active ?? data.active
            if (req.file) {
                try {
                    const fs = require("fs")
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
            res.send({ result: "Done", data: data, message: "Record is updated successfully" })
        }
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        const errorMessage = {}
        error.keyValue ? errorMessage.name = "User Already Exist" : ""
        error.errors?.name ? errorMessage.name = error.errors.name.message: ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }

}

async function deleteRecord(req, res) {
    try {
        const data = await User.findOne({ _id: req.params._id })
        if (data) {
            try {
                const fs = require("fs")
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
            res.send({ result: "Done", message: "Record is deleted successfully" })
        }
        else
            res.send({ result: "Fail", reason: "Internal Server Error" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { email: req.body.username },
                { username: req.body.username }
            ]
        })
        if (data && await bcrypt.compare(req.body.password, data.password)) {
            let privatekey = data.role === "Buyer" ? process.env.JWT_SECRET_KEY_BUYER : process.env.JWT_SECRET_KEY_ADMIN
            jwt.sign({ data }, privatekey, (error, token) => {
                if (error)
                    res.send({ result: "Fail", reason: "Something went wrong token has not created" })
                else
                    res.send({ result: "Done", data:data, token:token, message: "Token has been Created" })
            })
        }
        else
            res.status(401).send({ result: "Fail", reason: "Invalid username and password" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}


async function otpSender(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        
        if (data) {
            let otp = parseInt(Math.floor(Math.random() * 1000000).toString().padEnd(6, "1"))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.EMAIL_SENDER,
                to: data.email,
                subject: "OTP for Password Reset : Team Ministore",
                text: `
                       Hello ${data.name}
                       We Recieved an Record for Password Reset from your Side
                       OTP for Password Reset is ${otp}
                       Never Share OTP with anyone
                       Team : Ministore

                     `
            })

            res.send({ result: "Done", message: "OTP has been sended your registered email!!" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid Credentails!! User Not Found" })
    } catch (error) {
        console.log(error);
        
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}


async function matchOtp(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        
        if (data) {
            if (data.otp == req.body.otp)
                res.send({ result: "Done" })
            else
                res.send({ result: "Fail", reason: "Invalid OTP" })
        }
        else
            res.send({ result: "Fail", reason: "Invalid Credentails!! User Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}


async function resetPassword(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error)
                    res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
                else
                    data.password = hash
                await data.save()
                res.send({ result: "Done", message: "Your password has been Reset" })
            })
        }
        else
            res.send({ result: "Fail", reason: "Invalid Credentails!! User Not Found" })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })
    }

}

module.exports = {
    createRecord,
    getAllRecords,
    getSingleRecords,
    updateRecord,
    deleteRecord,
    login,
    otpSender,
    matchOtp,
    resetPassword
}