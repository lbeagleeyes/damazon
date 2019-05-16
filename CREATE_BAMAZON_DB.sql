-- ****************** SqlDBM: Microsoft SQL Server ******************
-- ******************************************************************

DROP DATABASE IF EXISTS damazon_db;

CREATE DATABASE damazon_db;
-- ************************************** Department
use damazon_db;

CREATE TABLE Departments
(
 DepartmentId   int NOT NULL AUTO_INCREMENT ,
 DepartmentName  varchar(40) NOT NULL ,
 TotalSales     float NULL ,
 OverHeadCosts  float NOT NULL ,
 primary key(DepartmentId)
);
-- ************************************** Order

CREATE TABLE Users
(
 UserId   int auto_increment NOT NULL ,
 UserName  varchar(40) NOT NULL ,
 Phone     varchar(20) NULL ,
 IsManager bit NOT NULL ,

 CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED (UserId ASC)
);

CREATE TABLE Orders (
 OrderId     int auto_increment NOT NULL ,
 UserId     int NOT NULL ,
 OrderDate   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
 TotalAmount decimal(12,2) NOT NULL ,

primary key(OrderId), 
foreign key(UserId) references Users(UserId)
 
);

CREATE TABLE Products
(
 ProductId      int auto_increment NOT NULL ,
 ProductName    varchar(50) NOT NULL ,
 DepartmentId   int NOT NULL ,
 UnitPrice      decimal(12,2) NULL ,
 StockQuatity   bigint NOT NULL default(0) ,
 StockThreshold int NOT NULL ,

 CONSTRAINT PK_Product PRIMARY KEY CLUSTERED (ProductId ASC),
 CONSTRAINT FK_Product_DepartmentId_Departments FOREIGN KEY (DepartmentId)  REFERENCES Departments(DepartmentId)
);

-- ************************************** OrderItem

CREATE TABLE OrderItems
(
 OrderId   int NOT NULL ,
 ProductId int NOT NULL ,
 UnitPrice decimal(12,2) NOT NULL ,
 Quantity  int NOT NULL ,

 CONSTRAINT PK_OrderItem PRIMARY KEY CLUSTERED (OrderId ASC, ProductId ASC),
 CONSTRAINT FK_OrderItem_OrderId_Order FOREIGN KEY (OrderId)  REFERENCES Orders(OrderId),
 CONSTRAINT FK_OrderItem_ProductId_Product FOREIGN KEY (ProductId)  REFERENCES Products(ProductId)
);


use damazon_db;

drop procedure if exists insert_order;

delimiter #

create procedure insert_order
(
in p_userid INT,
in p_total decimal(12,2)
)
begin

 insert into orders (UserId, TotalAmount) values (p_userid, p_total);

 select last_insert_id() as OrderId;

end#

delimiter ;




