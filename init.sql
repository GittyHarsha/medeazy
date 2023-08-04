CREATE DATABASE IF NOT EXISTS medstore;
use medstore;

CREATE TABLE IF NOT EXISTS Retailers (
	Retailer_id varchar(10) PRIMARY KEY,
	Retailer_name varchar(30),
	Retailer_contact varchar(10),
	Retailer_email varchar(50),
	Retailer_address varchar(80)
);
CREATE TABLE IF NOT EXISTS Suppliers (
	Supplier_id varchar(10) PRIMARY KEY,
	Supplier_name varchar(30),
	Supplier_contact varchar(10),
	Supplier_email varchar(50),
	Supplier_address varchar(80)
);

CREATE TABLE IF NOT EXISTS FRIENDS (
 Supplier_id varchar(10),
 Retailer_id varchar(10),
 FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,

FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS User_Accounts (
	User_id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
	Password_hash binary(60),
	Hint_question varchar(50),
	Answer varchar(30),
	Retailer_id varchar(10),
	Supplier_id varchar(10),
	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	
	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Inventory (
	Retailer_id varchar(10),
	Medicine_name varchar(50),
	MRP int,
	Stock int,
	batch_no int,
	expiry_date date,
	PRIMARY KEY (Retailer_id, Medicine_name),
	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS Supplier_inventory (
	Supplier_id varchar(10),
	Medicine_name varchar(50),
	price int,
	Stock int,
	batch_no int,
	expiry_date date,
	PRIMARY KEY (Supplier_id, Medicine_name),
	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS Transactions (
	transaction_no int PRIMARY KEY,
	Retailer_id varchar(10),
	Supplier_id varchar(10),
	start_date date,
	end_date date,
	Order_status enum("COMPLETED","PENDING","CANCELLED"),
	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Transaction_items (
	transaction_no int,
	Medicine_name varchar(50),
	Quantity int,
	price int,
	FOREIGN KEY (transaction_no)
	REFERENCES Transactions(transaction_no)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS Orders (
	Retailer_id varchar(10),
	Order_id int,
	Medicine_name varchar(50),
	Quantity int,
	MRP int,
	Order_date date,
	Supplier_id varchar(10),
	Order_status enum("COMPLETED","PENDING","CANCELLED"),
	FOREIGN KEY (Order_id)
	REFERENCES Transactions(transaction_no),

	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,

	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Staffs (
	Retailer_id varchar(10),
	Staff_id int,
	Staff_name varchar(30),
	Staff_contact varchar(10),
	Staff_email varchar(50),
	Staff_address varchar(80),
	Job_role varchar(25),
	Salary int,
	PRIMARY KEY (Retailer_id, Staff_id),
	FOREIGN KEY (Retailer_id)
	REFERENCES Retailers(Retailer_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Supplier_Staffs (
	Supplier_id varchar(10),
	Staff_id int,
	Staff_name varchar(30),
	Staff_contact varchar(10),
	Staff_email varchar(50),
	Staff_address varchar(80),
	Job_role varchar(25),
	Salary int,
	PRIMARY KEY (Supplier_id, Staff_id),
	FOREIGN KEY (Supplier_id)
	REFERENCES Suppliers(Supplier_id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
);

-- CREATE USER 'project'@'localhost' IDENTIFIED BY 'har123Kir456@';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON medstore.* TO 'project'@'localhost';
