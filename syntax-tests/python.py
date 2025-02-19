# Importing necessary libraries
import pandas as pd
import math

# Python Basics
print("Hello, Python!")

# Variables and Data Types
x = 10          # Integer
y = 3.14        # Float
name = "Alice"  # String
is_active = True  # Boolean

# Lists and Loops
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Dictionaries
person = {"name": "John", "age": 30, "city": "New York"}
print(person["name"])

# An incorre

# Functions
def add(a, b):
    return a + b

result = add(5, 7)
print(f"Sum: {result}")

# Classes and Objects
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        return f"{self.name} says woof!"

dog1 = Dog("Buddy", 3)
print(dog1.bark())

# List Comprehensions
squares = [x**2 for x in range(10)]
print(squares)

# File Handling
with open("example.txt", "w") as file:
    file.write("Hello, file handling!")

# Exception Handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Error: Cannot divide by zero!")

# Lambda Functions
multiply = lambda a, b: a * b
print(f"Product: {multiply(4, 5)}")

# Decorators
def decorator_function(original_function):
    def wrapper_function(*args, **kwargs):
        print("Wrapper executed this before {}".format(original_function.__name__))
        return original_function(*args, **kwargs)
    return wrapper_function

@decorator_function
def display():
    print("Display function ran")

display()

# Generators
def countdown(num):
    while num > 0:
        yield num
        num -= 1

for count in countdown(5):
    print(count)

# Working with Modules
print(f"Pi: {math.pi}")

# Pandas: Creating and manipulating DataFrames
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [24, 27, 22, 32],
    'City': ['New York', 'Los Angeles', 'Chicago', 'Houston']
}

df = pd.DataFrame(data)
print("DataFrame:")
print(df)

# Basic DataFrame Operations
print("\nDescriptive Statistics:")
print(df.describe())

# Selecting specific columns
print("\nNames and Ages:")
print(df[['Name', 'Age']])

# Filtering Data
print("\nPeople older than 25:")
print(df[df['Age'] > 25])

# Adding a new column
df['Salary'] = [70000, 80000, 65000, 90000]
print("\nDataFrame with Salary:")
print(df)

# Grouping Data
print("\nAverage Salary by City:")
print(df.groupby('City')['Salary'].mean())
