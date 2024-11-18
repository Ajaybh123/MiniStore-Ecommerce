const Product = require("../models/Product")
const Newsletter = require("../models/Newsletter")
const mailer = require("../mailer/mail")

async function createRecord(req, res) {
    try {
        const data = new Product(req.body)
        if (req.files) {
            data.pic = Array.from(req.files).map((x) => x.path)
        }
        await data.save()

        const finalData = await Product.findOne({ _id: data._id })
            .populate([
                {
                    path: "maincategory",
                    select: "name"
                },
                {
                    path: "subcategory",
                    select: "name"
                },
                {
                    path: "brand",
                    select: "name"
                }
            ])

        const newsletter = await Newsletter.find()
        newsletter.forEach((x) => {
            mailer.sendMail({
                from: process.env.EMAIL_SENDER,
                to: x.email,
                subject: "Checkout our latest product : Team Ministore",
                text: `
                      Please Checkout our latest product from Our Side
                      Team : Ministore 
                `
            })
        })
        res.send({ result: "Done", data: finalData, message: "record created succesfully!!" })

    } catch (error) {
        console.log(error)
        const errorMessage = []
        error.keyValue ? errorMessage.push({ name: "Product Already Exist" }) : ""
        error.errors?.name ? errorMessage.push({ name: error.errors.name.message }) : ""
        error.errors?.maincategory ? errorMessage.push({ maincategory: error.errors.maincategory.message }) : ""
        error.errors?.subcategory ? errorMessage.push({ subcategory: error.errors.subcategory.message }) : ""
        error.errors?.brand ? errorMessage.push({ brand: error.errors.brand.message }) : ""
        error.errors?.color ? errorMessage.push({ color: error.errors.color.message }) : ""
        error.errors?.size ? errorMessage.push({ size: error.errors.size.message }) : ""
        error.errors?.basePrice ? errorMessage.push({ basePrice: error.errors.basePrice.message }) : ""
        error.errors?.discount ? errorMessage.push({ discount: error.errors.discount.message }) : ""
        error.errors?.finalPrice ? errorMessage.push({ finalPrice: error.errors.finalPrice.message }) : ""
        error.errors?.stock ? errorMessage.push({ stock: error.errors.stock.message }) : ""
        error.errors?.stockQuantity ? errorMessage.push({ stockQuantity: error.errors.stockQuantity.message }) : ""
        error.errors?.discription ? errorMessage.push({ discription: error.errors.discription.message }) : ""
        error.errors?.pic ? errorMessage.push({ pic: error.errors.pic.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await Product.find().sort({ _id: -1 })
            .populate([
                {
                    path: "maincategory",
                    select: "name"
                },
                {
                    path: "subcategory",
                    select: "name"
                },
                {
                    path: "brand",
                    select: "name"
                }
            ])
        res.send({ result: "done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
            .populate([
                {
                    path: "maincategory",
                    select: "name"
                },
                {
                    path: "subcategory",
                    select: "name"
                },
                {
                    path: "brand",
                    select: "name"
                }
            ])
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
        const data = await Product.findOne({ _id: req.params._id });

        if (data) {
            data.name = req.body.name ?? data.name;
            data.maincategory = req.body.maincategory ?? data.maincategory;
            data.subcategory = req.body.subcategory ?? data.subcategory;
            data.brand = req.body.brand ?? data.brand;
            data.color = req.body.color ?? data.color;
            data.size = req.body.size ?? data.size;
            data.basePrice = req.body.basePrice ?? data.basePrice;
            data.discount = req.body.discount ?? data.discount;
            data.discription = req.body.discription ?? data.discription;
            data.finalPrice = req.body.finalPrice ?? data.finalPrice;
            data.stock = req.body.stock ?? data.stock;
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
            data.active = req.body.active ?? data.active;

            if (req.files) {
                try {
                    data.pic.forEach((x) => {
                        if (!(req.body.oldPics?.split(',').includes(x))) {
                            const fs = require('fs');
                            fs.unlinkSync(x);
                        }
                    });
                } catch (error) {
                    console.error("Error deleting old files:", error);
                }
                if (req.body.oldPics === "")
                    data.pic = req.files.map((x) => x.path)
                else
                    data.pic = req.body.oldPics?.split(",").concat(req.files.map((x) => x.path));
            }

            await data.save();

            let finalData = await Product.findOne({ _id: data._id })
                .populate([
                    { path: "maincategory", select: "name" },
                    { path: "subcategory", select: "name" },
                    { path: "brand", select: "name" }
                ]);

            res.send({ result: "Done", data: finalData, message: "Record is updated successfully" });
        } else {
            res.status(404).send({ result: "Fail", reason: "Product not found" });
        }
    } catch (error) {
        console.error("Error in updateRecord function:", error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function updateRecordQuantity(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id });

        if (data) {
            data.stock = req.body.stock ?? data.stock;
            data.stockQuantity = req.body.stockQuantity ?? data.stockQuantity;
            await data.save();

            let finalData = await Product.findOne({ _id: data._id })
                .populate([
                    { path: "maincategory", select: "name" },
                    { path: "subcategory", select: "name" },
                    { path: "brand", select: "name" }
                ]);

            res.send({ result: "Done", data: finalData, message: "Record is updated successfully" });
        } else {
            res.status(404).send({ result: "Fail", reason: "Product not found" });
        }
    } catch (error) {
        console.error("Error in updateRecord function:", error);
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function deleteRecord(req, res) {
    try {
        const data = await Product.findOne({ _id: req.params._id })
        if (data) {
            try {
                const fs = require("fs")
                data.pic.forEach((x) => fs.unlinkSync(x))
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

module.exports = {
    createRecord,
    getAllRecords,
    getSingleRecords,
    updateRecord,
    deleteRecord,
    updateRecordQuantity
}