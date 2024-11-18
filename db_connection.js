const mongoose = require("mongoose")

mongoose.connect(process.env.DATABASE_KEY)
.then(()=>{
    console.log("Database is connected")
})
.catch((error)=>{
    console.log(error)
})