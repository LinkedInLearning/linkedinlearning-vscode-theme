package main

import (
    "errors"
    "fmt"
    "sync"
)

// Person struct to demonstrate structs
type Person struct {
    FirstName string
    LastName  string
    Age       int
}

// Greeter interface to demonstrate interfaces
type Greeter interface {
    Greet() string
}

// Greet method to demonstrate method on struct
func (p Person) Greet() string {
    return fmt.Sprintf("Hello, my name is %s %s and I am %d years old.", p.FirstName, p.LastName, p.Age)
}

// Sum function to demonstrate basic function and error handling
func Sum(a, b int) (int, error) {
    if a < 0 || b < 0 {
        return 0, errors.New("negative numbers are not allowed")
    }
    return a + b, nil
}

// Worker function to demonstrate goroutines and channels
func Worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, j)
        results <- j * 2
    }
}

func main() {
    // Variables and constants
    var message string = "Welcome to Go!"
    const pi = 3.14
    fmt.Println(message, pi)

    // Control structures: if-else, for loop
    for i := 1; i <= 3; i++ {
        if i%2 == 0 {
            fmt.Printf("%d is even\n", i)
        } else {
            fmt.Printf("%d is odd\n", i)
        }
    }

    // Using struct and interface
    p := Person{"John", "Doe", 30}
    fmt.Println(p.Greet())

    // Error handling
    sum, err := Sum(5, -3)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Sum:", sum)
    }

    // Concurrency: goroutines, channels, and wait group
    jobs := make(chan int, 5)
    results := make(chan int, 5)
    var wg sync.WaitGroup

    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go Worker(w, jobs, results, &wg)
    }

    for j := 1; j <= 5; j++ {
        jobs <- j
    }
    close(jobs)

    wg.Wait()
    close(results)

    for result := range results {
        fmt.Println("Result:", result)
    }
}
