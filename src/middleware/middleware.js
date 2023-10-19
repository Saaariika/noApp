const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userSchema.js')

const authentication = async function (req, res, next) {
    try {
        // pass x-api-key in header
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ message: "token must be passed", status: false })
        }
        // decode token which comes from header
        const decodedToken = jwt.verify(token, "noApp",
            { ignoreExpiration: true }
        );
        console.log(decodedToken)
        if (!decodedToken) {
            return res.status(401).send({ message: "invalid jwt token", status: false })
        }
        // assign user id to request body
        let userExist = await userModel.findOne({ _id: decodedToken.userId })
        if (!userExist) {
            return res.status(401).send({ message: "authentication fail", status: false })
        }
        req.userId = decodedToken.userId;
        console.log(req.userId)
        next()

    }
    catch (err) { return res.status(500).send({ Error: "internal server error", message: err.message, status: false }) }
}

module.exports = { authentication }