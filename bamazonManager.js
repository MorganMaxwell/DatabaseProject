// package requirements
require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");
// connect to Database
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: process.env.pass,
    database: 'Bamazon_db'
});
// questions for the manager
var questions = [{
    name: "managerOptions",
    type: "list",
    choices:
        ["View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Log Off"],
    message: "Pick an Action to take\n"
}];
var confirmation = [{
    name: "confirm",
    type: "confirm",
    message: "Are you sure you want to Log Off?"
}];
var seperator = "\n----------------------------------------------------------\n";
connection.connect();
// Display manager options
function managerUI() {
    inquirer.prompt(questions)
        .then(function (ans) {
            if (ans.managerOptions[0]) {
                viewProducts();
            }
            else if (ans.managerOptions[1]) {
                viewLowInv();
            }
            else if (ans.managerOptions[2]) {
                addInv();
            }
            else if (ans.managerOptions[3]) {
                addNewProduct();
            }
            else if (ans.managerOptions[4]) {
                logOff();
            }
            else {
                console.log("You broke it, go back");
                managerUI();
            }
        });
};
// Display database products
function viewProducts() {
    connection.query(
        'SELECT * FROM products', function (err, res) {
            if (err) {
                throw err;
            };
            for (var i = 0; i < res.length; i++) {
                console.log("\nItem Id: " + res[i].id + seperator +
                    "Item Name: " + res[i].product_name + seperator +
                    "Department: " + res[i].department_name + seperator +
                    "Price: " + res[i].price + seperator +
                    "Quantity On Hand: " + res[i].stock_quantity + seperator + "\n");
            };
            interaction(res);
        }
    );
    managerUI();
};
// Display products with stock_quantity < 5
function viewLowInv() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
            if (err) {
                throw err;
            };
            for (var i = 0; i < res.length; i++) {
                console.log("\nItem Id: " + res[i].id + seperator + 
                    "Item Name: " + res[i].product_name + seperator +
                    "Department: " + res[i].department_name + seperator + 
                    "Price: " + res[i].price + seperator +
                    "Quantity On Hand: " + res[i].stock_quantity + seperator + "\n");
            };
            interaction(res);
        }
    );
    managerUI();
};
// Increase stock_quantity of a product
function addInv() {

    managerUI();
};
// Insert a new table row for a product
function addNewProduct() {

    managerUI();
};
// confirm manager wants to close UI
function logOff() {
    inquirer.prompt(confirmation)
        .then(function (ans) {
            if (ans.confirm) {
                connection.end();
            }
            else {
                managerUI();
            };
        });
};
managerUI();