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
// open connection to database
connection.connect();
function interaction(res) {
    // ask the questions, and then check quantities of product selected
    inquirer.prompt(questions)
        .then(function (ans) {
            if (res[ans.ProductPick - 1].stock_quantity - ans.Quantity < 0) {
                console.log("\nInsufficient quantities! Please pick another product.\n");
                interaction(res);
            }
            else {
                var newQuantity = res[ans.ProductPick - 1].stock_quantity - ans.Quantity;
                connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE id = ?", 
                    [newQuantity, ans.ProductPick]
                )
                connection.end();
            }
        });
};
// Display database products and ask what one customer wants
function customerUI() {
    connection.query(
        'SELECT * FROM products', function (err, res) {
            if (err) {
                throw err;
            };
            for (var i = 0; i < res.length; i++) {
                console.log("\nItem Id: " + res[i].id +
                    "\nItem Name: " + res[i].product_name +
                    "\nDepartment: " + res[i].department_name +
                    "\nPrice: " + res[i].price +
                    "\nQuantity On Hand: " + res[i].stock_quantity + "\n\n");
            };
            interaction(res);
        }
    );
};

customerUI();