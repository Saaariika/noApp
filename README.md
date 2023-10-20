# noApp
Assignment to upload bulk csv file
Example.csv you can find under src (comma separated csv file format to upload in form data)

http status code mapped  400 (bad request), 500 (internal server error), 401 (unauhorised or unauthenticate),
                         404 (not found), 201 (successfull creation), 200 (success response)

Follow these steps to set up and run the application on your local machine.

### Prerequisites

- Node.js installed
- MongoDB database
- Git (optional, for cloning the repository)
### Installation

1. Clone the Git repository (or download the source code):
   ```bash
   git clone <repository-url>
   cd noapp
   npm install
   cd src
   npx nodemon index.js


steps:   Clone git repo by the provided url
         go to noapp folder run command npm i
         go to src folder
         run command npx nodemon index.js 
         application will listen on port of baseUrl localhost:3000
Method :POST
1. Registration of user API :  userName: { String,Mandatory},emailId: { String,Mandatory,Unique  }, password: {String,Mandatory}, phoneNo: { String,Mandatory,Unique},

Endpoint:      baseUrl/register

Request body :    {
  "userName":"abc",
  "emailId":"abc@gmail.com",
  "password":"Abc@12345678",
  "phoneNo":"9996262235"
}

Response:     {
    "message": "user created successfully",
    "status": true,
    "data": {
        "userName": "abc",
        "emailId": "abc@gmail.com",
        "password": "Abc@12345678",
        "phoneNo": "9996262235",
        "_id": "65320304e4dba6e7afdb89a3",
        "createdAt": "2023-10-20T04:33:08.153Z",
        "updatedAt": "2023-10-20T04:33:08.153Z",
        "__v": 0
    }
}


Method :POST
2. Log In of user API :  emailId: { String,Mandatory,Unique  }, password: {String,Mandatory}

Endpoint:      baseUrl/login

Request body :    {
    "emailId": "abc@gmail.com",
    "password": "Abc@12345678",
}

Response :   {
    "status": true,
    "message": "login successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTMyMDMwNGU0ZGJhNmU3YWZkYjg5YTMiLCJpYXQiOjE2OTc3NzY2ODYsImV4cCI6MTY5Nzg2MzA4Nn0.eydKdpshNNZfmAm1IekE-Z15108XOi4nnLwyXAVjg3g"
}

Method :POST
3 Upload csv data API: serialNo: { Number,Mandatory},authorName: { String, Mandatory },authorId: { String, Mandatory } , bookName: { String, Mandatory Unique }, ISBN: { Number, Mandatory Unique },uploadId:{String,Mandatory,Unique}

Note: authorId must be pass in path parameters, use form data to csv file with key name is csvFile

Endpont : baseUrl/upload/65319cebc09279f963f39760

Response : {
    "status": true,
    "message": "data uploaded successfully",
    "data": [
        {
            "serialNo": 1,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Myth",
            "ISBN": 2234567890123,
            "_id": "6531fb305026b1fde8931638",
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.086Z",
            "updatedAt": "2023-10-20T03:59:44.086Z"
        },
        {
            "serialNo": 2,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "History of one day",
            "ISBN": 2234567890134,
            "_id": "6531fb305026b1fde8931639",
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.087Z",
            "updatedAt": "2023-10-20T03:59:44.087Z"
        },
        {
            "serialNo": 3,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Gemini",
            "ISBN": 2234567890145,
            "_id": "6531fb305026b1fde893163a",
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.088Z",
            "updatedAt": "2023-10-20T03:59:44.088Z"
        },
        {
            "serialNo": 4,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Earth orbit",
            "ISBN": 2234567890159,
            "_id": "6531fb305026b1fde893163b",
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.089Z",
            "updatedAt": "2023-10-20T03:59:44.089Z"
        },
        {
            "serialNo": 5,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "The cloud",
            "ISBN": 2234567890167,
            "_id": "6531fb305026b1fde893163c",
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.089Z",
            "updatedAt": "2023-10-20T03:59:44.089Z"
        }
    ]
}

Method :GET
4. Get upload csv data API by author Id: Retrieval is happen with pagination each page return 5 documents 
                             if you want to go on any random page pass query parametes with key name is page
                             which return to you on that particular page otherwise it will return on first page with 5 documents

Endpoint:  baseUrl/uploaded-data/65319cebc09279f963f39760?page=2

Response:   {
    "status": true,
    "message": "uploaded data retrieved successfully",
    "data": [
        {
            "_id": "6531fb305026b1fde8931638",
            "serialNo": 1,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Myth",
            "ISBN": 2234567890123,
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.086Z",
            "updatedAt": "2023-10-20T03:59:44.086Z"
        },
        {
            "_id": "6531fb305026b1fde8931639",
            "serialNo": 2,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "History of one day",
            "ISBN": 2234567890134,
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.087Z",
            "updatedAt": "2023-10-20T03:59:44.087Z"
        },
        {
            "_id": "6531fb305026b1fde893163a",
            "serialNo": 3,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Gemini",
            "ISBN": 2234567890145,
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.088Z",
            "updatedAt": "2023-10-20T03:59:44.088Z"
        },
        {
            "_id": "6531fb305026b1fde893163b",
            "serialNo": 4,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Earth orbit",
            "ISBN": 2234567890159,
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.089Z",
            "updatedAt": "2023-10-20T03:59:44.089Z"
        },
        {
            "_id": "6531fb305026b1fde893163c",
            "serialNo": 5,
            "authorName": "Rahul Shandilya",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "The cloud",
            "ISBN": 2234567890167,
            "__v": 0,
            "createdAt": "2023-10-20T03:59:44.089Z",
            "updatedAt": "2023-10-20T03:59:44.089Z"
        }
    ],
    "page": 2
}


Method :GET 
5. Get upload csv data API by upload Id:   logic is same as 4th api (whole as same)

Endpoint:  baseUrl/uploaded-data/c51521bc897bddd22d40cd42f805bb5c/65319cebc09279f963f39760?page=2

Response : {
    "status": true,
    "message": "uploaded data retrieved successfully",
    "data": [
        {
            "_id": "65321a10f64df5b2211af6c9",
            "serialNo": 1,
            "authorName": "Rahul Shandilya",
            "uploadId": "1",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Myth",
            "ISBN": 2234567890123,
            "__v": 0,
            "createdAt": "2023-10-20T06:11:28.325Z",
            "updatedAt": "2023-10-20T06:11:28.325Z"
        },
        {
            "_id": "65321a10f64df5b2211af6cb",
            "serialNo": 3,
            "authorName": "Rahul Shandilya",
            "uploadId": "1",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Gemini",
            "ISBN": 2234567890145,
            "__v": 0,
            "createdAt": "2023-10-20T06:11:28.326Z",
            "updatedAt": "2023-10-20T06:11:28.326Z"
        },
        {
            "_id": "65321a10f64df5b2211af6ca",
            "serialNo": 2,
            "authorName": "Rahul Shandilya",
            "uploadId": "1",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "History of one day",
            "ISBN": 2234567890134,
            "__v": 0,
            "createdAt": "2023-10-20T06:11:28.326Z",
            "updatedAt": "2023-10-20T06:11:28.326Z"
        },
        {
            "_id": "65321a10f64df5b2211af6cd",
            "serialNo": 5,
            "authorName": "Rahul Shandilya",
            "uploadId": "1",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "The cloud",
            "ISBN": 2234567890167,
            "__v": 0,
            "createdAt": "2023-10-20T06:11:28.327Z",
            "updatedAt": "2023-10-20T06:11:28.327Z"
        },
        {
            "_id": "65321a10f64df5b2211af6cc",
            "serialNo": 4,
            "authorName": "Rahul Shandilya",
            "uploadId": "1",
            "authorId": "65319cebc09279f963f39760",
            "bookName": "Earth orbit",
            "ISBN": 2234567890159,
            "__v": 0,
            "createdAt": "2023-10-20T06:11:28.327Z",
            "updatedAt": "2023-10-20T06:11:28.327Z"
        }
    ],
    "page": 2
}