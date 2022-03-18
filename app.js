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
    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
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

app.get("/:customListName", function (req, res) {
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
            }
        }
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.taskItem;
    const listName = req.body.list;
    const currentDay = date.getCurrentDate();

    const item = new Item({
        name: itemName,
        date: new Date()
    });

    // Main list using Items collection
    if (listName === currentDay) {
        item.save();
        res.redirect("/");
    } else { // Custom list using Lists collection
        List.findOne({
            name: listName
        }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/deleteItem", function (req, res) {
    const checkedItemId = req.body.checkBox;
    const listName = req.body.listName;
    const currentDay = date.getCurrentDate();

    // Delete the item from current default list
    if (listName === currentDay) {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                res.redirect("/");
            }
        });
    } else { // Update the desired custom list by using $pull to remove the clicked item
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
            res.redirect("/" + listName);
        });
    }
});

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});