-- Creating a table for customers
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    CreatedAt DATE DEFAULT CURRENT_DATE
);

-- Creating a table for orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY,
    CustomerID INT,
    OrderDate DATE,
    Amount DECIMAL(10, 2),
    FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID)
);

-- Inserting data into Customers table
INSERT INTO Customers (CustomerID, FirstName, LastName, Email) VALUES
(1, 'John', 'Doe', 'john.doe@example.com'),
(2, 'Jane', 'Smith', 'jane.smith@example.com'),
(3, 'Alice', 'Johnson', 'alice.johnson@example.com');

-- Inserting data into Orders table
INSERT INTO Orders (OrderID, CustomerID, OrderDate, Amount) VALUES
(101, 1, '2024-06-01', 150.75),
(102, 1, '2024-06-10', 200.50),
(103, 2, '2024-06-15', 300.00),
(104, 3, '2024-06-17', 450.25);

-- Query to select all customers
SELECT * FROM Customers;

-- Query to select all orders with customer details
SELECT o.OrderID, c.FirstName, c.LastName, o.OrderDate, o.Amount
FROM Orders o
JOIN Customers c ON o.CustomerID = c.CustomerID;

-- Aggregate query to find total amount spent by each customer
SELECT c.FirstName, c.LastName, SUM(o.Amount) AS TotalSpent
FROM Customers c
JOIN Orders o ON c.CustomerID = o.CustomerID
GROUP BY c.FirstName, c.LastName;

-- Subquery to find customers who have spent more than $300
SELECT FirstName, LastName
FROM Customers
WHERE CustomerID IN (
    SELECT CustomerID
    FROM Orders
    GROUP BY CustomerID
    HAVING SUM(Amount) > 300
);

-- Update query to change an email address
UPDATE Customers
SET Email = 'john.newemail@example.com'
WHERE CustomerID = 1;

-- Delete query to remove an order
DELETE FROM Orders
WHERE OrderID = 104;
