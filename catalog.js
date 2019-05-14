

class Catalog {
  constructor(){};

  listDepartments(){
    var promise = new Promise(function(resolve, reject) {
      
    
      if (/* everything turned out fine */) {
        resolve("Stuff worked!");
      }
      else {
        reject(Error("It broke"));
      }
    });

  };

  listProducts(deparmentNumber);

  listAllProducts();

  addProduct(product);

  getProduct(id);

  //addDepartment(department);
}

class Product{
  constructor(name, quantity, threshold, departmentId){
    this.productName = name;
    this.stockQuantity = quantity;
    this.stockThreshold = threshold;
    this.departmentId = departmentId;
  }

  getQuantity(){
    return this.stockQuantity;
  }
}

class Order{
  constructor();

  addProduct(product, quantity);

  getTotal();
}

module.exports = {
  Product,
  Catalog,
  Order
};