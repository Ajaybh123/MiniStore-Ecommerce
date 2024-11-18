const Wishlist = require("../models/Wishlist")
const { options } = require("../routes/WishlistRoute")

async function createRecord(req, res) {
    try {
        const data = new Wishlist(req.body)
        await data.save()
        let finalData = await Wishlist.findOne({ _id: data._id }).populate([
            {
                path: "user",
                select: "name"
            },
            {
                path: "product",
                select: "name subcategory maincategory color size brand basePrice discount finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "subcategory",
                        select: "name"
                    },
                    {
                        path: "maincategory",
                        select: "name"
                    },
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: { slice: { pic: 1 } },
            }
        ])
        res.send({ result: "Done", data: finalData })
    } catch (error) {
        console.log(error)
        const errorMessage = []
        error.errors?.user ? errorMessage.push({ user: error.errors.user.message }) : ""
        error.errors?.product ? errorMessage.push({ product: error.errors.product.message }) : ""
        errorMessage.length === 0 ?
            res.status(500).send({ result: "Fail", reason: "Internal Server Error" }) :
            res.status(500).send({ result: "Fail", reason: errorMessage })
    }
}

async function getAllRecords(req, res) {
    try {
        const data = await Wishlist.find().sort({ _id: -1 }).populate([
            {
                path: "user",
                select: "name"
            },
            {
                path: "product",
                select: "name subcategory maincategory color size brand basePrice discount finalPrice stockQuantity pic",
                populate: [
                    {
                        path: "subcategory",
                        select: "name"
                    },
                    {
                        path: "maincategory",
                        select: "name"
                    },
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: { slice: { pic: 1 } },
            }
        ])
        res.send({ result: "done", count: data.length, data: data })
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" })

    }

}

async function getSingleRecords(req, res) {
    try {
        const data = await Wishlist.findOne({ _id: req.params._id }).populate([
            {
                path: "user",
                select: "name"
            },
            {
                path: "product",
                select: "name subcategory maincategory color size brand basePrice discount finalPrice quantity pic",
                populate: [
                    {
                        path: "subcategory",
                        select: "name"
                    },
                    {
                        path: "maincategory",
                        select: "name"
                    },
                    {
                        path: "brand",
                        select: "name"
                    }
                ],
                options: { slice: { pic: 1 } },
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


async function deleteRecord(req, res) {
    try {
        const data = await Wishlist.findOne({ _id: req.params._id })
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

module.exports = {
    createRecord,
    getAllRecords,
    getSingleRecords,
    deleteRecord
}