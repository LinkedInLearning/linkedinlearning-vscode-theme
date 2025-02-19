// Basic syntax and variables
const greeting = "Hello, World!";
let count = 0;
const increment = () => count++;

// Function with default parameters
function greet(name = "Stranger") {
  return `${greeting}, ${name}!`;
}

// Object with methods
const person = {
  name: "Alice",
  age: 30,
  hobbies: ["reading", "hiking", "coding"],
  introduce() {
    return `Hi, I'm ${this.name} and I'm ${this.age} years old.`;
  },
  listHobbies() {
    return this.hobbies.map((hobby) => `I enjoy ${hobby}.`);
  },
};

// Array manipulation
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((n) => n * 2);
const evenNumbers = numbers.filter((n) => n % 2 === 0);

// Destructuring and spread operator
const [first, ...rest] = numbers;
const merged = [...numbers, ...doubled];

// Promises and async/await
const fetchData = async () => {
  try {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    console.log("Fetched data:", data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

// Using classes
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }

  speak() {
    return `${this.name} makes a noise.`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Dog");
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks.`;
  }
}

const myDog = new Dog("Rex", "Golden Retriever");

// Template literals
const summary = `
  ${greet(person.name)}
  ${person.introduce()}
  ${person.listHobbies().join(" ")}
  Numbers: ${numbers.join(", ")}
  Doubled: ${doubled.join(", ")}
  Even: ${evenNumbers.join(", ")}
  First number: ${first}
  Rest: ${rest.join(", ")}
  Merged: ${merged.join(", ")}
  Dog: ${myDog.speak()}
`;

// Output the summary to the console
console.log(summary);

// Trigger the async function
fetchData();
