

class Catalog {
  constructor(queryExec) {
    this.queryExec = queryExec;
  };

  listDepartments() {
    return this.queryExec.performQuery("Select * from Departments");
  };

  listProducts(deparmentNumber) {
    if (deparmentNumber > 0) {
      return this.queryExec.performQuery("SELECT * FROM products WHERE ?", { departmentId: deparmentNumber })
    } else {
      return new Promise((resolve, reject) => {
        reject("No department specified");
      })
    }
  };

  listAllProducts() {
    return this.queryExec.performQuery("SELECT * FROM products");
  };

  showLowInventory() {
    return this.queryExec.performQuery("SELECT * FROM products WHERE StockQuatity < StockThreshold ");
  }

  addProduct(product) { };

  getProduct(id) {
    return this.queryExec.performQuery("SELECT * FROM products WHERE ?", { ProductId: id });
  };

  //addDepartment(department);
}

class Product {
  constructor(id, name, quantity, threshold, departmentId, price) {
    this.productId = id;
    this.productName = name;
    this.stockQuantity = quantity;
    this.stockThreshold = threshold;
    this.departmentId = departmentId;
    this.price = price;
  }
}

class Order {
  constructor(dbConn, user) {
    this.dbConn = dbConn;
    this.user = user;
    this.id = 0;
    this.orderItems = [];
    this.total = 0;
  };

  addProduct(product, quantity) {
    this.orderItems.push({ product: product, quantity: quantity });
    this.total += product.price * quantity;
  };

  save() {
    //insert order 
    var self = this;
    return this.dbConn.performQuery("call insert_order(?,?); ", [this.user.userId, this.total]).then((result) => {
      //console.log("Order Id from SP: " + JSON.stringify(result[0][0].OrderId));
      
      self.id = result[0][0].OrderId;
      return self;
    }).then((order) => {
      //console.log(order);

      var values = [];
      for (var i = 0; i < order.orderItems.length; i++) {
        var orderItem = order.orderItems[i];
        //console.log(orderItem);
        values.push([order.id, orderItem.product.productId, orderItem.product.price, orderItem.quantity]);
        self.dbConn.performQuery("UPDATE products SET StockQuatity = ? WHERE ProductId = ?", [(orderItem.product.stockQuantity - orderItem.quantity), orderItem.product.productId]).then((res, reject) => {
          if (reject)
            console.log(reject);
        });
      }

      return order.dbConn.performQuery("INSERT INTO orderitems (OrderId,ProductId,UnitPrice,Quantity) VALUES ?", [values]).then((res, reject) => {
        if (reject)
          console.log(reject);
      });

    });

  }
}



module.exports = {
  Product,
  Catalog,
  Order
};