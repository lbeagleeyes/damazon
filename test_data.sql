use damazon_db;

insert into Users(UserName, isManager)
values('danielm', false);

insert into Users(UserName, isManager)
values('laurab', true);

use damazon_db;

insert into departments(DepartmentName, OverHeadCosts)
values('Electronics', 2000);

insert into departments(DepartmentName, OverHeadCosts)
values('Personal Care', 1000);

insert into departments(DepartmentName, OverHeadCosts)
values('Apparel', 500);

select * from departments;

use damazon_db;

insert into products(ProductName, DepartmentId, UnitPrice, StockQuatity, StockThreshold)
values('iPad', 1, 350, 15, 5)
	  , ('headphone', 1, 50, 25, 5)
      , ('laptop', 1, 1500, 5, 2)
      , ('keyboard', 1, 300, 30, 5)
      , ('kindle', 1, 80, 8, 3)
      ;

insert into products(ProductName, DepartmentId, UnitPrice, StockQuatity, StockThreshold)
values('shampoo', 2, 50, 15, 10)
	  , ('conditioner', 2, 50, 25, 8)
      , ('soap', 2, 500, 5, 20)
      , ('hair gel', 2, 300, 30, 10)
      , ('deodorant', 2, 800, 8, 30)
      ;
      
insert into products(ProductName, DepartmentId, UnitPrice, StockQuatity, StockThreshold)
values('t-shirt', 3, 15, 150, 10)
	  , ('shorts', 3, 10, 50, 8)
      , ('pants', 3, 20, 50, 20)
      , ('socks', 3, 8, 150, 10)
      , ('jacket', 3, 80, 25, 5)
      ;

