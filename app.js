const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js"); // Export a local module from date.js

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

// Connect to Local MongoDB
mongoose.connect("mongodb://localhost:27017/toDoListDB");

// Items Schema
const itemsSchema = {
    name: String,
    date: Date
};

// Create the Items Collection
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your toDoList!",
    date: new Date()
});

const item2 = new Item({
    name: "Click on (+) sign to add a new item",
    date: new Date()
});

const item3 = new Item({
    name: "Click on (x) to delete a existing item",
    date: new Date()
});

const defaultItems = [item1, item2, item3];

// Lists Schema
const listSchema = {
    name: String,
    items: [itemsSchema]
};

// Create the Lists Collection
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
    Item.find({}, function(err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully inserted default items.")
                }
            });

            res.redirect("/");
        } else {
            res.render("list", {
                listTitle: date.getCurrentDate(),
                newListItems: foundItems
            });
        }
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