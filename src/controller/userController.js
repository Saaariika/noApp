const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userSchema.js')

const createUser = async (req, res) => {
    try {
        // validate incoming request body 
        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ message: "invalid/missing parameters", status: false });
        }
        if (!req.body.userName) {
            return res.status(400).send({ message: "invalid/missing parameter user name", status: false });
        }
        if (!req.body.emailId) {
            return res.status(400).send({ message: "invalid/missing parameter emailId", status: false });
        }
        if (!req.body.password) {
            return res.status(400).send({ message: "invalid/missing parameter password", status: false });
        }
        if (!req.body.phoneNo) {
            return res.status(400).send({ message: "invalid/missing parameter phone no", status: false });
        }
        // validate email and phone number
        let emailId = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(req.body.emailId);
        let password =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(
                req.body.password
            );
        if (!emailId) {
            return res
                .status(400)
                .send({ status: false, message: "please provide a valid emailId " });
        }
        if (!password) {
            return res.status(400).send({
                status: false,
                message:
                    "please provide a valid password - password should include atleast one special character, one uppercase, one lowercase, one number and should be mimimum 8 character long",
            });
        }
        let phone = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(req.body.phoneNo)
        if (!phone) {
            return res.status(400).send({ message: " phone no is not valid", status: false });
        }

        // check for dulicacy of phone
        const checkPhone = await userModel.findOne({ phoneNo: req.body.phoneNo.trim() });
        if (checkPhone) {
            return res.status(400).send({ message: " phone no already exists", status: false });
        }
        // check for duplicacy of email
        const checkEmail = await userModel.findOne({ emailId: req.body.emailId.trim() });
        if (checkEmail) {
            return res.status(400).send({ message: "email id already exists", status: false });
        }
        const userDetails = {
            userName: req.body.userName.trim(),
            emailId: req.body.emailId.trim(),
            password: req.body.password.trim(),
            phoneNo: req.body.phoneNo.trim()
        }
        //    save user data
        let userData = await userModel.create(userDetails);
        if (userData) {
            return res.status(201).send({ message: "user created successfully", status: true, data: userData });
        }

    }
    catch (err) {
        return res.status(500).send({ Error: "internal server error", message: err.message, status: false });
    }

}

const loginUser = async (req, res) => {
    try {
        // validate incoming request
        if (!req.body.emailId) {
            return res.status(400).send({ message: "invalid/missing parameter emailId", status: false });
        }

        if (!req.body.password) {
            return res.status(400).send({ message: "invalid/missing parameter password", status: false });
        }

        // if user not exist with right credential then not allow to login 
        const userData = await userModel.findOne({ emailId: req.body.emailId.trim(), password: req.body.password.trim() });
        if (!userData) {
            return res.status(400).send({ message: "either email or password is incorrect", status: false });
        }

        // allow to log in and generate token for them
        const token = jwt.sign({
            userId: userData._id.toString(),
        },
            "noApp",
            { expiresIn: "24h" }
        );

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "login successfully", token: token });
    }
    catch (err) {
        return res.status(500).send({ Error: "internal server error", message: err.message, status: false });
    }
}

module.exports = { createUser, loginUser }