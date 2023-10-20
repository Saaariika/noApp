const csvModel = require('../models/csvSchema.js');
const userModel = require('../models/userSchema.js');
const fastcsv = require('fast-csv');
const fs = require('fs');

const uploadCsvFile = async (req, res) => {
  try {
    // validate incoming request
    let authorId = req.params.authorId;
    if (!authorId) {
      return res.status(400).send({ status: false, message: "invalid/missing parameters author id" });
    }

    // check for authorisation
    if (req.userId !== authorId) {
      return res.status(401).send({ status: false, message: "unauthorised" });
    }
    if (!req.file) {
      return res.status(400).json({ status: false, message: "no file uploaded" });
    }
    if (!req.body.uploadId) {
      return res.status(400).send({ status: false, message: "upload id required" })
    }
    // find author name from user collection
    let authorData = await userModel.findOne({ _id: authorId });
    if (!authorData) {
      return res.status(404).send({ status: false, message: "no such author found" });
    }
    const authorName = authorData.userName;

    const csvFilePath = req.file.path;
    const csvData = [];
    const validationErrors = [];
    let rowIndex = 0; // initialize the row index to know which row of csv file have in-appropriate data

    fs.createReadStream(csvFilePath)
      .pipe(fastcsv.parse({ headers: true }))
      .on('data', (row) => {
        rowIndex++; // increment the row index for each row to get csv file have in-appropriate data in particular row
        // csv data validation logic 
        if (isNaN(row.serialNo) || row.serialNo <= 0) {
          validationErrors.push(`row ${rowIndex}: serial number is required and must be a valid positive number.`);
        }

        if (!row.bookName || !row.bookName.trim() || typeof (row.bookName) !== "string") {
          validationErrors.push(`row ${rowIndex}: book name is required.`);
        }
        // can use regex also to validate ISBN
        if (!row.ISBN || !row.ISBN.trim() || !/^(?:\d{10}|\d{13})$/.test(row.ISBN.trim())) {
          validationErrors.push(`row ${rowIndex}: ISBN is required and must be either 10 or 13 digits number.`);
        }
        // assign author id to each row of csv file
        row.authorId = authorId.trim();
        // assign author name to each row of csv file
        row.authorName = authorName.trim();
        // more validation checks for each row of csv file
        if (validationErrors.length === 0) {
          csvData.push({
            serialNo: row.serialNo,
            ISBN: row.ISBN,
            bookName: row.bookName,
            authorId: row.authorId,
            authorName: row.authorName,
            uploadId: req.body.uploadId.trim()
          });
        }
      })
      .on('end', async () => {
        if (validationErrors.length > 0) {
          // if validation errors then return 
          return res.status(400).send({ status: false, errors: validationErrors });
        } else {
          // check for duplicates of data if exist
          try {
            const result = await csvModel.aggregate([
              {
                $group: {
                  _id: { ISBN: "$ISBN" },
                  count: { $sum: 1 },
                  duplicates: { $push: "$ISBN" }
                }
              },
              {
                $match: {
                  count: { $gt: 1 }
                }
              }
            ]);

            if (result.length > 0) {
              return res.status(400).json({ status: false, message: "duplicate entries", duplicateEntries: result });
            } else {
              // store data in database
              let csvCreatedData = await csvModel.insertMany(csvData);
              // Remove the temporary uploaded file
              fs.unlinkSync(csvFilePath);
              // Send a success response
              return res.status(201).json({ status: true, message: "data uploaded successfully", data: csvCreatedData });
            }
          } catch (err) {
            console.error(err);
            return res.status(500).send({ status: false, error: "internal server error", errorType: 'database error', message: err.message, });
          }
        }
      });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, error: "internal server error", message: err.message, });
  }
};
// get data by author id
const getUploadedData = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    if (!authorId) {
      return res.status(400).send({ status: false, message: "invalid/missing parameters author id" });
    }

    // check for authorization
    if (req.userId !== authorId) {
      return res.status(401).send({ status: false, message: "unauthorized" });
    }

    // get the page number from the query parameters, or default to page 1
    const page = parseInt(req.query.page) || 1;
    const perPage = 5; // number of documents to retrieve per page

    // calculate the number of documents to skip
    const skip = (page - 1) * perPage;

    // query the mongoDB database to retrieve the data based on authorId with pagination
    const uploadedData = await csvModel
      .find({ authorId })
      .skip(skip)
      .limit(perPage);

    if (uploadedData.length === 0) {
      return res.status(404).send({ status: false, message: "no uploaded data found for the specified authorId" });
    }

    // respond with the retrieved data
    return res.status(200).json({
      status: true,
      message: "uploaded data retrieved successfully",
      data: uploadedData,
      page,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, error: "internal server error", message: err.message });
  }
};

// get previous uploded data by upload id
const getUploadedDataByUploadId = async (req, res) => {
  try {
    const uploadId = req.params.uploadId;
    const authorId = req.params.authorId;
    if (req.userId !== authorId) {
      return res.status(401).send({ status: false, message: "unauthorised" });
    }

    if (!uploadId) {
      return res.status(400).send({ status: false, message: "invalid/missing parameter upload id" });
    }

    // get the page number from the query parameters, or default to page 1
    const page = parseInt(req.query.page) || 1;
    const perPage = 5; // number of documents to retrieve per page

    // calculate the number of documents to skip
    const skip = (page - 1) * perPage;

    // query the mongoDB database to retrieve the data based on uploadId with pagination
    const uploadedData = await csvModel
      .find({ uploadId }) // Assuming you have a field for uploadId in your data model
      .skip(skip)
      .limit(perPage);

    if (uploadedData.length === 0) {
      return res.status(404).send({ status: false, message: "no uploaded data found for the specified uploadId" });
    }

    // respond with the retrieved data
    return res.status(200).json({
      status: true,
      message: "uploaded data retrieved successfully",
      data: uploadedData,
      page,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, error: "internal server error", message: err.message });
  }
};








module.exports = { uploadCsvFile, getUploadedData, getUploadedDataByUploadId };
