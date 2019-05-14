var inquirer = require("inquirer");
require("dotenv").config();
var keys = require("./keys.js");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: keys.dbInfo.psswd,
  database: keys.dbInfo.dbName,
  typeCast: function castField(field, useDefaultTypeCasting) {
    // We only want to cast bit fields that have a single-bit in them. If the field
    // has more than one bit, then we cannot assume it is supposed to be a Boolean.
    if ((field.type === "BIT") && (field.length === 1)) {

      var bytes = field.buffer();
      // A Buffer in Node represents a collection of 8-bit unsigned integers.
      // Therefore, our single "bit field" comes back as the bits '0000 0001',
      // which is equivalent to the number 1.
      return (bytes[0] === 1);
    }
    return (useDefaultTypeCasting());
  }
});


function mainFlow() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Username:",
        name: "user"
      }])
    .then(function (res) {
      if (res.user != "") {
        getUserType(res.user, displayOptions);
      } else {
        mainFlow();
      }
    });
}

function getUserType(userName, callback) {
  connection.connect(function (err) {
    if (err) throw err;
    connection.query("SELECT IsManager FROM users WHERE ?", { UserName: userName }, function (err, res) {
      if (err) throw err;
      callback(res[0].IsManager);
    });
  });
}

function displayOptions(isAdmin) {
  if (isAdmin) {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Select what you would like to do",
          choices: [{ name: 'Buy' }, { name: 'Inventory' }
            // , { name: 'Add to inventory' }, { name: 'Add new Products' }
          ],
          name: "option"
        }])
      .then(function (res) {
        if (res.option != "") {
          console.log(res.option);
          performAdminAction(res.option);
        } else {
          displayOptions(isAdmin);
        }
      });
    //not an admin
  } else {
    showAllProducts(getBuy);
  }
}


function performAdminAction(option) {
  console.log(option);
  switch (option) {
    case "Buy":
      showAllProducts(getBuy);
      break;

    case "Inventory":
      showLowInventory();
      break;

    default:
      console.log('Option not supported: ' + action);
      displayOptions(true);
      break;
  }
}



function showAllProducts(callback) {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    //console.log(res);

    for(var i = 0; i < res.length; i++){
      console.log(`Id:${res[i].ProductId}\tName:${res[i].ProductName}\tPrice:${res[i].UnitPrice}`);
    }
    console.log("\n");
    callback();
  });
}

function showLowInventory() {
  connection.query("SELECT * FROM products WHERE StockQuatity < StockThreshold ", function (err, res) {
    if (err) throw err;

    // console.log(JSON.stringify(res) + "\n");
    for(var i = 0; i < res.length; i++){
      console.log(`Id:${res[i].ProductId}\tName:${res[i].ProductName}\tQuantity:${res[i].StockQuatity}\tThreshold:${res[i].StockThreshold}`);
    }
    console.log("\n");
    displayOptions(true);
  });
}


function getBuy() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the id of the product you would like to buy, 0 to exit:",
        name: "product"
      }, 
      {
        when: function (response) {
          return response.product == "0"? false:true;
        },
        type: "input",
        message: "Quantity:",
        name: "quantity"
      }
    ])
    .then(function (res) {
      if (res.product != "0") {
        console.log(res.product);
        buy(res,getBuy);
      } else {
        //not functional yet
        //displayOrder();
      }
    });
}

function buy(res, callback){

 console.log(res.product, res.quantity);

 //not functional
// catalog.Order.addProduct(Catalog.getProduct(res.productId), res.quantity);

 callback();
}

mainFlow();