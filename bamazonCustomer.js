var mysql = require("mysql");
var inquirer= require("inquirer")

var divider = console.log("=============================\n")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"Godisgood1",
    database: "bamazonDB"
})

connection.connect(function(err){
    if (err) throw err;
    afterConnection();
});


function afterConnection() {
    inquirer.prompt([
        {
            type: "list",
            message: "Welcome to famazon. Explore and buy new interesting items with us! \n Would you like to view what is in store?",
            choices: ["YES", "NO"],
            name: "start"
        }
    ]).then(function(answer){
        if (answer.start === "YES") {
            viewProducts();
            next();
        }
        else{
            console.log("That's too bad...Goodbye")
        }
    })
    
    
};

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        divider;
        console.log("\nThe items we currently have for sale are: ")
        for (var i = 0; i < res.length; i++){
            console.log("\n Item ID: " +res[i].item_id + "\n Item: " + res[i].product + "\n Price: " +res[i].price);
        }
        connection.end();
    })
};

function next() {

}