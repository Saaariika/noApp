const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true

        }
        ,
        emailId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        phoneNo: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

    },
    { timestamps: true }




)
module.exports = mongoose.model("user", userSchema)