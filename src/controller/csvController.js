//authorisation is pending
const csvModel = require('../models/csvSchema.js');
const fastcsv = require('fast-csv');
const fs = require('fs');


const uploadCsvFile = async (req, res) => {
  try {
    // validate incoming request
    if (!req.file) {
      return res.status(400).json({ status: false, errorType: "no file uploaded" });
    }

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
        if (!row.authorName || !row.authorName.trim()) {
          validationErrors.push(`row ${rowIndex}: author name is required.`);
        }
        if (!row.bookName.trim()) {
          validationErrors.push(`row ${rowIndex}: book name is required.`);
        }
        // can use regex also to validate ISBN
        if (!row.ISBN.trim() || !/^(?:\d{10}|\d{13})$/.test(row.ISBN.trim())) {
          validationErrors.push(`row ${rowIndex}: ISBN is required and must be either 10 or 13 digits.`);
        }
        
        // more validation checks for each row of csv file
        if (validationErrors.length === 0) {
          csvData.push(row);
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
                  _id: { bookName: "$bookName", ISBN: "$ISBN" },
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
          //  console.log("result",result)
            if (result.length > 0) {
              return res.status(400).json({ status: false, message: "Duplicate entries", duplicateEntries: result });
            } else {
              // store data in database
              let csvCreatedData=await csvModel.insertMany(csvData);
              // Remove the temporary uploaded file
              fs.unlinkSync(csvFilePath);
              // Send a success response
              return res.status(201).json({ status: true, message: "Data uploaded successfully",data:csvCreatedData });
            }
          } catch (err) {
            console.error(err);
            return res.status(500).send({ status: false, error: "internal server error", errorType: 'database error',message: err.message, });
          }
        }
      });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: false, error: "internal server error",message: err.message, });
  }
};

module.exports = { uploadCsvFile };
