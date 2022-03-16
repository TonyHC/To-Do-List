const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js"); // Export a local module from date.js

const app = express();

let items = ["Study"];
let workItems = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    let day = date.getCurrentDate();

    res.render("list", {
        listTitle: day,
        newListItems: items
    });
});

app.post("/", function(req, res) {
    let item = req.body.taskItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});