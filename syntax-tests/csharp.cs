using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSharpShowcase
{
    // Interface definition
    interface IAnimal
    {
        string Name { get; }
        void Speak();
    }

    // Base class
    abstract class Animal : IAnimal
    {
        public string Name { get; private set; }

        public Animal(string name)
        {
            Name = name;
        }

        public abstract void Speak();
    }

    // Derived class
    class Dog : Animal
    {
        public Dog(string name) : base(name) { }

        public override void Speak()
        {
            Console.WriteLine($"{Name} says: Woof!");
        }
    }

    // Generic class
    class Box<T>
    {
        public T Content { get; set; }

        public Box(T content)
        {
            Content = content;
        }

        public void DisplayContent()
        {
            Console.WriteLine($"The box contains: {Content}");
        }
    }

    class Program
    {
        static async Task Main(string[] args)
        {
            // List of animals
            List<IAnimal> animals = new List<IAnimal>
            {
                new Dog("Buddy"),
                new Dog("Charlie")
            };

            // LINQ query
            var dogNames = animals.Select(a => a.Name).ToList();
            Console.WriteLine("Dog names: " + string.Join(", ", dogNames));

            // Generics
            var intBox = new Box<int>(123);
            var stringBox = new Box<string>("Hello, World!");

            intBox.DisplayContent();
            stringBox.DisplayContent();

            // Exception handling
            try
            {
                var result = await PerformCalculationAsync(5, 0);
                Console.WriteLine($"Result: {result}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }

        // Async method
        static async Task<int> PerformCalculationAsync(int a, int b)
        {
            await Task.Delay(500); // Simulate async work
            if (b == 0)
                throw new DivideByZeroException("Cannot divide by zero!");

            return a / b;
        }
    }
}
