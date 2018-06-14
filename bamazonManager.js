var mysql = require("mysql");
var inquirer= require("inquirer")
var dotenv = require("dotenv").config();


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PASSWORD,
    database: "bamazonDB"
})

connection.connect(function(err){
    if (err) throw err;
    afterConnection();
});

function afterConnection() {
    console.log("\n==========================")
    inquirer.prompt([
        {
            type:"list",
            message: "Menu",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            name: "menu"
        }
    ]).then(function(answer){
        if (answer.menu === "View Products for Sale") {
            viewProducts();
        }
        else if (answer.menu === "View Low Inventory"){
            lowInvent();
        }
        else if (answer.menu === "Add Inventory"){
            addInvent();
        }
        else if (answer.menu === "Add New Product"){
            newProduct();
        }
        else if (answer.menu === "Exit") {
            return process.exit(22);
        }
    });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        console.log("\n==========================")
        console.log("\nThe items we currently have for sale are: ")
        for (var i = 0; i < res.length; i++){
            console.log("\n Item ID: " +res[i].item_id + "\n Item: " + res[i].product + "\n Price: $" +res[i].price);
        }
        console.log("\n==========================")
        afterConnection();
    })
};
function lowInvent() {
    connection.query("SELECT*FROM products", function(err, res){
        if (err) throw err;
        console.log("\n==========================")
        console.log("These items are low!! Need to re-stock soon!!");
        for(var i=0; i<res.length;i++){
            if(res[i].stock_quantity < 5){
                console.log("\n Item ID: " +res[i].item_id + "\n Item: " + res[i].product + "\n Quantity in Stock: " +res[i].stock_quantity+ "\n\n");
            }
        }
        console.log("\n==========================")
        afterConnection();
    })
};
function addInvent() {
    connection.query("SELECT*FROM products", function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "lowItem",
                message: "Which product would you like to add to re-stock?",
                choices: function(){
                    var lowItemArray = [];
                    for (var i=0; i<res.length; i++){
                        lowItemArray.push(JSON.stringify(res[i].product));
                    }
                    return lowItemArray;
                }
            },
            {
                type: "input",
                name: "addQuantity",
                message:"How many units of the product would you like add?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                    return true;
                    }
                    return false;
                }
                
            }
        ]).then(function(answer){
            var chosenItem;
            for(var i=0; i<res.length; i ++) {
                if(JSON.parse(res[i].product) === parseInt(answer.lowItem)) {
                    chosenItem = res[i];
                }
            }
            var add = chosenItem.stock_quantity + answer.addQuantity;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: add
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function(err) {
                    if (err) throw err;
                    console.log("You added " + answer.addQuantity + " of " + chosenItem.product + " to the inventory." )
                }
            )
            console.log("\n==========================")
            afterConnection();

        })
    })
};

function newProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "What new product would you like to add? ",
            name: "newProduct",
        },
        {
            type: "input",
            message: "Which department is it in?",
            name: "department",
        },
        {
            type: "input",
            message: "How much is it?",
            name: "newPrice",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            message:"How many units did you add? ",
            name: "newStockQuantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        }
    ]).then(function(answer){
        var newProduct = JSON.stringify(answer.newProduct).replace(""," ");
        connection.query("INSERT INTO products SET ?",
        [
            {
                product: JSON.stringify(answer.newProduct),
                department: JSON.stringify(answer.department),
                price: answer.newPrice,
                stock_quantity: answer.newStockQuantity,

            }
        ],
        function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " products updated!\n");
        }
    )
    afterConnection();
    })
    
};