const jwt = require("jsonwebtoken")

function verifyAdmin(req, res, next) {
    let token = req.headers.authorization
    let secretKeyAdmin = process.env.JWT_SECRET_KEY_ADMIN
    
    jwt.verify(token, secretKeyAdmin, (err) => {
        if (err) {
           res.status(401).send({result:"Fail", reason:"You are not an authorized user to access this api"});
        }
        else
        next(); 
    })
}

function  verifyBoth(req, res, next) {
    let token = req.headers.authorization
    let secretKeyAdmin = process.env.JWT_SECRET_KEY_ADMIN
    let secretKeyBuyer = process.env.JWT_SECRET_KEY_BUYER
    
    jwt.verify(token, secretKeyAdmin, (err) => {
        if (err) {
            jwt.verify(token, secretKeyBuyer, (err) => {
                if (err) {
                   res.status(401).send({result:"Fail", reason:"You are not an authorized user to access this api"});
                }
                else
                next(); 
            })
        }
        else
        next(); 
    })
}


module.exports = {
    verifyAdmin,
    verifyBoth
}