const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });
const userController = require('../controller/userController.js')
const csvController = require('../controller/csvController.js')
const middleware = require('../middleware/middleware.js')



// router path to create user
router.post('/register', userController.createUser)
// router path to log in user
router.post('/login', userController.loginUser)
// router path to upload csv file by user using authentication 
router.post('/upload/:authorId', middleware.authentication, upload.single('csvFile'), csvController.uploadCsvFile)
// get previously uploaded data by user using authentication 
router.get('/uploaded-data/:authorId', middleware.authentication, csvController.getUploadedData);
router.get('/uploaded-data/:uploadId/:authorId', middleware.authentication, csvController.getUploadedData);



module.exports = router