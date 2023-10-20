
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
const route = require('./route/router.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// establish connection to mongoDB
mongoose.connect("mongodb+srv://saaariik-sarul:Rahul1991*@cluster0.adxgdju.mongodb.net/noAppCsv", {
    useNewUrlParser: true // 
})
    .then(() => {
        console.log("mongodb is connected")
    })
    .catch((err) => {
        console.log(err)
    })
app.use('/', route)
// establish connection to server
app.listen(3000, (() => {
    console.log("server run on port 3000");
}))