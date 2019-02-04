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
            "Add New Product"
        ],
    message: "Pick an Action to take\n"
}];
// add inventory
var addInventory = [{
    name: "addInventory",
    type: "input",
    message: "Input the ID of the product: "
},
{
    name: "stock",
    type: "input",
    message: "Input the stock quantity: "
}];
// add new product
var addNew = [{
    name: "productName",
    type: "input",
    message: "Input the product_name to add: ",
},
{
    name: "departmentName",
    type: "input",
    message: "Input the department_name: ",
},
{
    name: "pricing",
    type: "input",
    message: "Input the price per unit(numbers only): ",
},
{
    name: "stockQuantity",
    type: "input",
    message: "Input the stock on hand(numbers only): "
}];
var seperator = "\n----------------------------------------------------------\n";
connection.connect();
// Display manager options
function managerUI() {
    inquirer.prompt(questions)
        .then(function (ans) {
            switch (ans.managerOptions) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":

                    viewLowInv();
                    break;
                case "Add to Inventory":
                    addInv();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                default:
                    console.log("You broke it, go back");
                    managerUI();
                    break;

            };
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
        }
    );
    endConnection();
};
// Display products with stock_quantity < 5
function viewLowInv() {
    connection.query(
        'SELECT * FROM products WHERE stock_quantity < 5', function (err, res) {
            if (err) {
                throw err;
            };
            if (res === undefined || res.length < 1) {
                console.log("No Low Inventory Products");
            }
            else {
                for (var i = 0; i < res.length; i++) {
                    console.log("\nItem Id: " + res[i].id + seperator +
                        "Item Name: " + res[i].product_name + seperator +
                        "Department: " + res[i].department_name + seperator +
                        "Price: " + res[i].price + seperator +
                        "Quantity On Hand: " + res[i].stock_quantity + seperator + "\n");
                };
            };
        }
    );
    endConnection();
};
// Increase stock_quantity of a product
function addInv() {
    inquirer.prompt(addInventory)
        .then(function (ans) {
            var id = ans.addInventory;
            var stock = ans.stock;
            connection.query(
                'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
                [stock, id]
            );
            endConnection();

        });
};
// Insert a new table row for a product
function addNewProduct() {
    inquirer.prompt(addNew)
        .then(function (ans) {
            var product = ans.productName;
            var department = ans.departmentName;
            var price = ans.pricing;
            var stock = ans.stockQuantity;
            connection.query(
                'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)',
                [product, department, price, stock]
            );
            endConnection();
        });
};
// end connection
function endConnection() {
    connection.end();
}
// start the whole thing off
managerUI();