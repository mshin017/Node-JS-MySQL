DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;
USE bamazonDB;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product VARCHAR(30) NOT NULL,
    department VARCHAR(30),
    price DECIMAL (10,2), 
    stock_quantity INT(10),
    new_sq INT(10) default 0
);

INSERT INTO products (product, department, price, stock_quanitity)
VALUES ("MacBook Pro 13in", "Computers", 1299.99, 2939), 
("The Notebook", "Movies", 4.99, 124), 
("Apple Watch 42MM Series 3", "Electronics", 309.00, 5), 
("Hydroflask 532ml","Sports & Outdoors",39.95,2), 
("The Alchemist", "Books", 9.99, 24)