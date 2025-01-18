// Declare global variables
let quotes = [];
let filteredQuotes = [];
let currentPage = 1;
let quotesPerPage = 10;

// Function to load quotes from a JSON file and apply category filtering from URL
function loadQuotes() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            filteredQuotes = quotes;
            const category = getCategoryFromUrl(); // Check for category in the URL
            if (category) {
                filteredQuotes = quotes.filter(quote => quote.category === category); // Filter by category
                document.getElementById('category-filter').value = category;
            }
            displayQuotes(); // Display the filtered quotes
        })
        .catch(error => console.error('Error loading quotes:', error));
}

// Function to display quotes in the container
function displayQuotes() {
    const quotesContainer = document.getElementById('quotes-list');
    quotesContainer.innerHTML = ''; // Clear the container

    const start = (currentPage - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    const quotesToDisplay = filteredQuotes.slice(start, end); // Get the quotes for the current page

    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');

        const quoteLink = document.createElement('div');

        // Check if the quote has an image for the author
        const authorImageHTML = quote.authorImage ? `<img src="${quote.authorImage}" alt="Image of ${quote.author}" class="author-image">` : '';

        quoteLink.style.display = "flex";
        quoteLink.innerHTML = `
            <div>
                <p class="quote-category">${quote.author}</p>
                <p class="quote-text">"${quote.text}" – ${quote.author}</p>
                <div class="quote-details hidden">
                    <p class="quote-category">Author: ${quote.author}</p>
                    <p class="quote-category">Category: ${quote.category}</p>
                    <p class="quote-category">Description: ${quote.description || "No description available."}</p>
                </div>
            </div>
            <div class="quote-details hidden">
                ${authorImageHTML}
            </div>
        `;

        quoteDiv.appendChild(quoteLink);
        quotesContainer.appendChild(quoteDiv);
    });

    setupQuoteClickEvents(); // Setup click events for quote elements
    updatePaginationButtons(); // Update pagination buttons state
}

// Function to go to the previous page of quotes
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayQuotes(); // Display quotes for the new page
    }
}

// Function to go to the next page of quotes
function nextPage() {
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayQuotes(); // Display quotes for the new page
    }
}

// Function to update pagination buttons' state (enabled/disabled)
function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;

    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.style.display = filteredQuotes.length <= quotesPerPage ? 'none' : 'flex'; // Show pagination if there are more than quotesPerPage
}

// Function to filter quotes by category from the select dropdown
function filterByCategory() {
    const category = document.getElementById('category-filter').value;
    filteredQuotes = category ? quotes.filter(quote => quote.category === category) : quotes;
    currentPage = 1; // Reset to the first page when filtering
    displayQuotes();
}

// Function to add event listeners for search input and category filter
function addEventListenersForQuotes() {
    document.getElementById('search-input').addEventListener("input", searchQuotes);
    document.getElementById('search-option').addEventListener("change", searchQuotes);
    document.getElementById('category-filter').addEventListener("change", filterByCategory);
}

// Function to search quotes based on search input and category filter
function searchQuotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchOption = document.getElementById('search-option').value;

    let newFilteredQuotes = quotes;

    if (document.getElementById('category-filter').value) {
        newFilteredQuotes = newFilteredQuotes.filter(quote => quote.category === document.getElementById('category-filter').value);
    }

    if (searchTerm) {
        newFilteredQuotes = newFilteredQuotes.filter(quote => {
            if (searchOption === "text") {
                return quote.text.toLowerCase().includes(searchTerm);
            } else if (searchOption === "author") {
                return quote.author.toLowerCase().includes(searchTerm);
            }
            return false;
        });
    }

    filteredQuotes = newFilteredQuotes;
    currentPage = 1; // Reset to the first page after searching
    displayQuotes();
}

// Function to get the category from the URL parameters (if any)
function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

// Function to load the quote of the day
function loadQuoteOfTheDay() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const today = new Date();
            const dayOfYear = today.getFullYear() * 1000 + today.getMonth() * 30 + today.getDate();

            const quoteIndex = dayOfYear % quotes.length; // Get the quote of the day

            const quoteOfTheDay = quotes[quoteIndex];

            typeText(`"${quoteOfTheDay.text}" – ${quoteOfTheDay.author}`);
        })
        .catch(error => {
            console.error('Error loading quote of the day:', error);
        });
}

// Function to type out the quote of the day character by character
function typeText(fullText) {
    const quoteContainer = document.getElementById('quote-container');
    quoteContainer.innerHTML = '';
    let index = 0;

    function typeCharacter() {
        if (index < fullText.length) {
            quoteContainer.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeCharacter, 40); // Add delay between each character
        }
    }

    typeCharacter();
}

// Function to setup click events for quotes (expand on click)
function setupQuoteClickEvents() {
    const quotes = document.querySelectorAll('.quote');

    quotes.forEach(quote => {
        quote.addEventListener('click', () => {
            // Close all other quotes when one is clicked (toggle "open" class)
            document.querySelectorAll('.quote').forEach(q => q.classList.remove('open'));

            // Toggle 'open' class for the clicked quote
            quote.classList.toggle('open');
        });
    });
}

// Initialize the quote display and add event listeners on page load
if (document.getElementById('quotes-list')) {
    window.onload = function () {
        loadQuotes(); // Load the quotes
        setupQuoteClickEvents(); // Set up click events for quote items
        addEventListenersForQuotes(); // Add event listeners for search and category filter
    };
} else if (document.getElementById('quote-container')) {
    window.onload = loadQuoteOfTheDay; // Load the quote of the day if on the appropriate page
}
