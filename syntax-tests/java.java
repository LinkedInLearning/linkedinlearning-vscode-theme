// Import necessary packages
import java.util.*;

// Define an interface
interface Animal {
    void sound();
}

// Create an abstract class
abstract class Creature {
    String name;
    
    Creature(String name) {
        this.name = name;
    }
    
    abstract void eat();
}

// Implement the interface and extend the abstract class
class Dog extends Creature implements Animal {
    Dog(String name) {
        super(name);
    }
    
    @Override
    void eat() {
        System.out.println(name + " is eating.");
    }
    
    @Override
    public void sound() {
        System.out.println(name + " says Woof!");
    }
}

// Define a generic class
class Box<T> {
    private T item;
    
    void add(T item) {
        this.item = item;
    }
    
    T get() {
        return item;
    }
}

// Main class to demonstrate various features
public class JavaFeatures {
    public static void main(String[] args) {
        // Exception handling
        try {
            Dog dog = new Dog("Buddy");
            dog.eat();
            dog.sound();
            
            // Working with a generic class
            Box<Dog> dogBox = new Box<>();
            dogBox.add(dog);
            Dog retrievedDog = dogBox.get();
            System.out.println("Retrieved dog: " + retrievedDog.name);
            
            // Collections and loops
            List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
            for (String name : names) {
                System.out.println(name);
            }
            
        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
        }
        
        // Lambda expressions
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        numbers.forEach(n -> System.out.println(n * n));
    }
}
