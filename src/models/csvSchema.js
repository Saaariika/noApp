const mongoose = require('mongoose')

const csvSchema = new mongoose.Schema(
    {
        serialNo: {
            type: Number,
            required: true,
            trim: true

        },
        authorName: {
            type: String,
            required: true,
            trim: true

        },
        authorId: {
            type: String,
            required: true,
            trim: true

        }
        ,
        bookName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        ISBN: {
            type: Number,
            required: true,
            unique: true,
            trim: true
        }

    },
    { timestamps: true }




)
module.exports = mongoose.model("csv", csvSchema)