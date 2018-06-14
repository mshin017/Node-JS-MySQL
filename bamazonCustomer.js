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
            buyProducts();
        }
        else{
            console.log("That's too bad...Goodbye")
            return process.exit(22);
        }
    })
    
};


function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        divider;
        console.log("\nThe items we currently have for sale are: ")
        for (var i = 0; i < res.length; i++){
            console.log("\n Item ID: " +res[i].item_id + "\n Item: " + res[i].product + "\n Price: $" +res[i].price);
        }

    })
};


function buyProducts() {
    viewProducts();
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "chosenId",
                message: "Which item would you like to buy?",
                choices: function(){   
                    var idArray = [];         
                    for (var i = 0; i < res.length; i++){
                        idArray.push(JSON.stringify(res[i].item_id));
                    }
                   return idArray;
                }
            },
            {
                type: "input",
                name: "quantity",
                message:"How many units of the product would you like? ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
                
            }
        ]).then(function(answer){
            var chosenItem ;
            for(var i=0; i<res.length; i ++) {
                if(JSON.parse(res[i].item_id) === parseInt(answer.chosenId)) {
                     chosenItem = res[i];
                }
            }
            if (answer.quantity <= chosenItem.stock_quantity) {
                var newStockQuantity = chosenItem.stock_quantity-answer.quantity;
                var totalCost = chosenItem.price*answer.quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                    {
                        stock_quantity: newStockQuantity
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                    ],
                    function(err) {
                    if (err) throw err;
                    console.log("Your total payment is: $" + totalCost)
                    checkout();
                    }
                );
            }
            else {
                console.log("Sorry it seems like you want more than we actually have... please try again")
                buyProducts();
            }

        })
    })
}

function checkout() {
    inquirer.prompt([
        {
            type: "list",
            message:"How would you like to pay?",
            name: "payment",
            choices: ["Credit", "Debit"]
        }
    ]).then(function(answer){
        console.log("You have sucessfully bought your item!")
        inquirer.prompt([
            {
                type: "list",
                message: "Would you like to continue to shop?",
                choices: ["YES","NO"],
                name:"shopMore"
            }
        ]).then(function(answer){
            if (answer.shopMore === "YES") {
                buyProducts();
            }
            else{
                console.log("Thank you for shopping with us!");
                return process.exit(22);
            }
        })
    })
    
}