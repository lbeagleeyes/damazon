require("dotenv").config();
var keys = require("./keys.js");
var inquirer = require("inquirer");
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
        console.log(res.user);

        getUserType(res.user, displayOptions);
      } else {
        mainFlow();
      }
    });
}

function getUserType(userName, callback) {
  connection.connect(function (err) {
    if (err) throw err;
    console.log(userName);
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
          choices: [{ name: 'Buy products' }, { name: 'View low inventory' }
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


function performAdminAction(action) {
  switch (action) {
    case "Buy products":
      showAllProducts(getBuy);
      break;

    case "View low inventory":
      showLowInventory(performAdminAction);
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
    // Log all results of the SELECT statement
    console.log(res);
    callback();
  });
}

function showLowInventory(callback) {
  connection.query("SELECT * FROM products WHERE StockQuatity < StockThreshold ", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res + "\n");
    callback();
  });
}


function getBuy() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the ids of the products you would like to buy:",
        name: "products"
      }])
    .then(function (res) {
      if (res.products != "") {
        console.log(res.products);
      } else {
        buy();
      }
    });
}

mainFlow();