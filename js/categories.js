// Select DOM elements for category cards, quote display, and the container for quotes
const cards = document.querySelectorAll('.category-card');
const description = document.getElementById('category-description');
const quote1 = document.getElementById('quote-1');
const quote2 = document.getElementById('quote-2');
const quoteContainer = document.querySelector('.categories-quote-container');

// Array to store all the quotes
let allQuotes = [];

// Fetch the quotes from the JSON file
fetch('data/quotes.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load quotes');
        }
        return response.json();
    })
    .then(data => {
        allQuotes = data; // Load all quotes
    })
    .catch(error => console.error('Error loading quotes:', error));

// Add event listeners to each category card
cards.forEach(card => {
    // Show description on mouse enter and hide it on mouse leave
    card.addEventListener('mouseenter', () => {
        description.textContent = card.getAttribute('data-description');
        description.style.display = 'block'; // Show description
    });
    card.addEventListener('mouseleave', () => {
        description.textContent = ''; // Clear description
        description.style.display = 'none'; // Hide description
    });

    // Show quotes when mouse enters the category card
    card.addEventListener('mouseenter', () => {
        const category = card.querySelector('h3').textContent; // Get the category name
        const quotes = getRandomQuotes(category); // Get random quotes for the category

        if (quotes.length > 0) {
            // Display the quotes
            quote1.textContent = `"${quotes[0].text}" – ${quotes[0].author}`;
            if (quotes[1]) {
                quote2.textContent = `"${quotes[1].text}" – ${quotes[1].author}`;
            } else {
                quote2.textContent = ''; // If there's no second quote, clear the second quote
            }
            quoteContainer.style.display = 'flex'; // Show the quote container
        }
    });

    // Hide quotes when mouse leaves the category card
    card.addEventListener('mouseleave', () => {
        quote1.textContent = ''; // Clear quote 1
        quote2.textContent = ''; // Clear quote 2
        quoteContainer.style.display = 'none'; // Hide the quote container
    });
});

// Function to get two random quotes for a specific category
function getRandomQuotes(category) {
    // Filter quotes by category
    const categoryQuotes = allQuotes.filter(quote => quote.category === category);

    // If there are at least two quotes for this category, shuffle and return two
    if (categoryQuotes.length >= 2) {
        const shuffled = categoryQuotes.sort(() => 0.5 - Math.random()); // Shuffle the quotes
        return shuffled.slice(0, 2); // Return the first two quotes
    } else if (categoryQuotes.length === 1) {
        return [categoryQuotes[0]]; // If only one quote is available, return it
    }
    return []; // Return an empty array if no quotes for this category
}
