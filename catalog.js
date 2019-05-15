

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

  showLowInventory(){
    return this.queryExec.performQuery("SELECT * FROM products WHERE StockQuatity < StockThreshold ");
  }

  addProduct(product) { };

  getProduct(id) { 
    return this.queryExec.performQuery("SELECT * FROM products WHERE ?", {ProductId : id});
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
    this.orderItems.push({product, quantity});
    this.total += product.price * quantity;
   };

   save(){
    //decrement inventory
    //save oder items and order
   }
}



module.exports = {
  Product,
  Catalog,
  Order
};