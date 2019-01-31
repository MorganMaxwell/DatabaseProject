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
// questions for customer on command line
var questions = [{
    name: "ProductPick",
    type: "input",
    message: "Please input the ID of the product you want to buy"
},
{
    name: "Quantity",
    type: "input",
    message: "How many would you like to buy?"
}];
var confirmation = [{
    name: "confirm",
    type: "confirm",
    message: "Would you like to make another purchase?"
}];
var seperator = "\n----------------------------------------------------------\n";
connection.connect();
// Display database products and ask what one customer wants
function customerUI() {
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
};
function interaction(res) {
    // ask the questions, and then check quantities of product selected
    inquirer.prompt(questions)
        .then(function (ans) {
            // if there isn't enough stock, display an error, then 
            // loop the function with recursion
            if (res[ans.ProductPick - 1].stock_quantity - ans.Quantity < 0) {
                console.log(seperator + "Insufficient quantities! Please pick another product." + seperator);
                interaction(res);
            }
            else {
                // else, update the quantity in the database
                var newQuantity = res[ans.ProductPick - 1].stock_quantity - ans.Quantity;
                console.log(seperator + "Purchase Successful!" + seperator)
                connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE id = ?",
                    [newQuantity, ans.ProductPick]
                );
                // this is asking if the customer would like to make another purchase
                inquirer.prompt(confirmation)
                    .then(function (ans) {
                        if (ans.confirm) {
                            interaction(res);
                        }
                        else {
                            connection.end();
                        };
                    });
            };
        });
};
customerUI();