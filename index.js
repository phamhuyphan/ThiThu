const express = require("express");
const app = express();
const multer = require("multer");
const AWS = require("aws-sdk");
const upload = multer();
const dotenv = require("dotenv");

dotenv.config();



AWS.config = new AWS.Config({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SCRET_KEY,
    region: process.env.REGION
})

app.use(express.static("views"));
app.set("view engine", "ejs");
app.set("views", "./views");

const docClient = new AWS.DynamoDB.DocumentClient();

// app.get("/", (req, res) => {
//     return res.render("index")
// })
const tbl_Name = "CRM"

app.get("/", (req, res) => {
    const params = {
        TableName: tbl_Name
    }
    docClient.scan(params, (err, data) => {
        if (err)
            res.send(err);
        else {
            console.log(data)
            res.render("index", { crms: data.Items });
        }
    })
})

app.listen(process.env.PORT, () => {
    console.log("Server listening on port:", process.env.PORT);
})