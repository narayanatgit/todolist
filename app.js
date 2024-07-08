const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname + "/date.js");
const app = express();
const mongoose = require("mongoose");
const _ = require('lodash');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var workList = [];
mongoose.connect("mongodb://0.0.0.0/todolist",	{useNewUrlParser: true});
const toDoListSchema = {
	name: String,
};
const Item = mongoose.model("item", toDoListSchema);
const item1 = new Item({
	name: "BuyFood",
});
const item2 = new Item({
	name: "play",
});
const item3 = new Item({
	name: "eatFood",
});
const defaultItems = [item1, item2, item3];
const ListSchema = {
	name: String,
	items: [toDoListSchema],
};
const List = mongoose.model("list", ListSchema);
app.get("/", (req, res) => {
	var da = day();
	Item.find({}, function (err, ele) {
		if (ele.length === 0) {
			Item.insertMany(defaultItems, function (err) {
				if (err) console.log(err);
				else console.log("inserted");
			});
			res.redirect("/");
		} else {
			res.render("list", { kindOfDay: "Today", newItem: ele });
		}
	});
});
app.post("/", (req, res) => {
	const i = req.body.addItem;
	const listName = req.body.list;
	const item = new Item({
		name: i,
	});
	if (listName == "Today") {
		item.save();

		res.redirect("/");
	} else {
		List.findOne({ name: listName }, function (err, found)
		{
			found.items.push(item);
			found.save();
			res.redirect('/'+listName)
		})
	}
});
app.get("/:customerList", (req, res) => {
	const customList = _.capitalize(req.params.customerList);
	List.findOne({ name: customList }, function (err, found) {
		if (!err) {
			if (!found) {
				const list = new List({
					name: customList,
					items: defaultItems,
				});
				list.save();
				res.redirect("/" + customList);
			} else
				res.render("list", { kindOfDay: found.name, newItem: found.items });
		}
	});
});
app.get("/about", (req, res) => {
	res.render("about");
});
app.post("/delete", (req, res) => {
	const checked = req.body.checkbox;
	const listName = req.body.listName;
	if (listName == "Today")
	{Item.findByIdAndRemove(checked, function (err) {
		if (err) console.log(err);
		else console.log("deleted");
		res.redirect("/");
	});
		
	}
	else {
		List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checked } } }, function (err, found)
		{
			if (!err)
			{
				res.redirect("/" + listName);
				}
		})
	}
	
});
let port = process.env.PORT;
if (port == null || port == "") {
	port = 5000;
}
app.listen(port, function ()
{
	console.log("server started");
});