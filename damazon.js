
var inquirer = require("inquirer");
require("dotenv").config();
var keys = require("./keys.js");
var CatalogLib = require("./catalog.js");
var DBConnection = require("./dbConnection.js");

var dbConnection = new DBConnection("localhost", 3306, "root", keys.dbInfo.psswd, keys.dbInfo.dbName);

var catalog = new CatalogLib.Catalog(dbConnection);

var currentUser = "";
var currentOrder;
var isAdmin = false;

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
        currentUser = res.user;
        getUserType(currentUser);
      } else {
        mainFlow();
      }
    });
}

function getUserType(userName) {
  dbConnection.performQuery("SELECT IsManager FROM users WHERE ?", { UserName: userName }).then((res) => {
    isAdmin = res[0].IsManager;
    displayOptions();
  });
}

function displayOptions() {
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
  catalog.listAllProducts().then((res) => {
    for (var i = 0; i < res.length; i++) {
      console.log(`Id:${res[i].ProductId}\tName:${res[i].ProductName}\tPrice:${res[i].UnitPrice}`);
    }
    console.log("\n");
    callback();
  });
}

function showLowInventory() {
  catalog.showLowInventory().then((res) => {
    for (var i = 0; i < res.length; i++) {
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
        message: "Enter the id of the product you would like to buy, 0 to checkout and exit:",
        name: "product"
      },
      {
        when: function (response) {
          return response.product == "0" ? false : true;
        },
        type: "input",
        message: "Quantity:",
        name: "quantity"
      }
    ])
    .then(function (res) {
      if (res.product != "0") {
        console.log(res.product);
        buy(res, getBuy);
      } else {
        displayOrder();
      }
    });
}

function buy(orderItem, callback) {

  if (typeof (currentOrder) == "undefined") {
    currentOrder = new CatalogLib.Order(dbConnection, currentUser);
  }
  
  catalog.getProduct(orderItem.product).then((result) => {
    var product = new CatalogLib.Product(orderItem.product, result[0].ProductName, result[0].StockQuatity, result[0].StockThreshold, result[0].DepartmentId, result[0].UnitPrice);
    
    if (+orderItem.quantity < +product.stockQuantity) {
      currentOrder.addProduct(product, orderItem.quantity);
      console.log(`${product.productName} added to cart.`);
      
    } else {
      console.log(`Not enough quantity in stock. ${product.productName} current stock = ${product.stockQuantity}\nPlease select an available quantity.`);
    }

    callback();
  });
}

function displayOrder() {
  //currentOrder.save();
  var orderItems = currentOrder.orderItems;
  console.log("Id\tItem\tPrice\tQuantity\tTotal");

  for (var i = 0; i < orderItems.length; i++) {
    var prod = orderItems[i].product;
    var subTotal = prod.price * orderItems[i].quantity;
    console.log(`${prod.productId}\t${prod.productName}\t${prod.price}\t${orderItems[i].quantity}\t${subTotal}`);
  }

  console.log("\nTotal: $" + currentOrder.total);

  dbConnection.endConnection();

}

mainFlow();