const express = require("express");
const app = express();
const multer = require("multer");
const AWS = require("aws-sdk");
const upload = multer();
const dotenv = require("dotenv");
const { on } = require("nodemon");

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
});


app.post("/", upload.fields([]), (req, res) => {
    const { ma_sv, tuoi, lop, khoa } = req.body;
    const params = {
        TableName: tbl_Name,
        Item: {
            "ma_sv": ma_sv,
            "lop": lop,
            "khoa": khoa,
            "tuoi": tuoi,
        }
    }
    docClient.put(params, (err, data) => {
        if (err) return res.send(err)
        else return res.redirect("/")
    })
})

app.get("/add", (req, res) => {
    res.render("add")
})

app.post("/delete", upload.fields([]), (req, res) => {
    const listItems = Object.keys(req.body)
    if (listItems.length === 0) {
        return res.redirect("/")
    }
    onDelete = (index) => {
        const params = {
            TableName: tbl_Name,
            Key: {
                "ma_sv": listItems[index],
            }
        }
        docClient.delete(params, (err) => {
            if (err) return res.send(err)
            else {
                if (index > 0) onDelete(index - 1);
                else
                    return res.redirect("/");
            }
        })
    }
    onDelete(listItems.length - 1);
})

app.listen(process.env.PORT, () => {
    console.log("Server listening on port:", process.env.PORT);
});