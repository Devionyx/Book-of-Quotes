// Declare global variables
let quotes = [];
let filteredQuotes = [];
let currentPage = 1;
let quotesPerPage = 10;

// Function to get liked quotes from localStorage
function getLikedQuotes() {
    return JSON.parse(localStorage.getItem('favoriteQuotes')) || [];
}

// Update the function that loads quotes to also handle "liked" filter
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

            // Display quotes based on the selected filters (including "liked" filter)
            displayQuotes();
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

    // Get the list of liked quotes from localStorage
    const likedQuotes = getLikedQuotes();

    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');

        const quoteLink = document.createElement('div');

        // Check if the quote has an image for the author
        const authorImageHTML = quote.authorImage ? `<img src="${quote.authorImage}" alt="Image of ${quote.author}" class="author-image">` : '';

        const quoteText = encodeURIComponent(`"${quote.text}"`);
        const authorName = encodeURIComponent(`-${quote.author}`);
        const quoteUrl = encodeURIComponent(window.location.href); // Dit is de URL van de huidige pagina (of maak een unieke URL voor de quote)

        quoteLink.style.display = "flex";
        quoteLink.innerHTML = `
            <div class="quote-container-a">
                <div class="quote-category">
                    <p>${quote.author}</p>
                    <svg id="heart-icon" class="heart-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
                <p class="quote-text">"${quote.text}" – ${quote.author}</p>
                <div class="quote-details hidden">
                    <p class="quote-category">Author: ${quote.author}</p>
                    <p class="quote-category">Category: ${quote.category}</p>
                    <p class="quote-category">Description: ${quote.description || "No description available."}</p>
                    <div class="share-buttons">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${quoteUrl}" target="_blank" class="share-btn facebook-btn">
                            <!-- Facebook SVG Icon -->
                            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>
                        </a>
                        
                        <a href="https://x.com/intent/tweet?text=${quoteText}%20${authorName}%0A%0A&url=${quoteUrl}" target="_blank" class="share-btn twitter-btn">
                            <!-- Twitter SVG Icon -->
                            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                        </a>
                        
                        <a href="https://wa.me/?text=${quoteText}%20${authorName}%20${quoteUrl}" target="_blank" class="share-btn whatsapp-btn">
                            <!-- WhatsApp SVG Icon -->
                            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                        </a>
                        
                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=${quoteUrl}&title=${quoteText}" target="_blank" class="share-btn linkedin-btn">
                            <!-- LinkedIn SVG Icon -->
                            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>
                        </a>
                        <a href="https://t.me/share/url?url=${quoteUrl}&text=${quoteText}" target="_blank" class="share-btn telegram-btn">
                            <!-- Telegram SVG Icon -->
                            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"/></svg>
                        </a>
                        <a href="https://www.reddit.com/submit?url=${quoteUrl}&title=${quoteText}" target="_blank" class="share-btn reddit-btn">
                            <!-- Reddit SVG Icon -->
                            <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 256C0 114.6 114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256L37.1 512c-13.7 0-20.5-16.5-10.9-26.2L75 437C28.7 390.7 0 326.7 0 256zM349.6 153.6c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7c-20.6 0-37.8 14.6-41.8 34c-34.5 3.7-61.4 33-61.4 68.4l0 .2c-37.5 1.6-71.8 12.3-99 29.1c-10.1-7.8-22.8-12.5-36.5-12.5c-33 0-59.8 26.8-59.8 59.8c0 24 14.1 44.6 34.4 54.1c2 69.4 77.6 125.2 170.6 125.2s168.7-55.9 170.6-125.3c20.2-9.6 34.1-30.2 34.1-54c0-33-26.8-59.8-59.8-59.8c-13.7 0-26.3 4.6-36.4 12.4c-27.4-17-62.1-27.7-100-29.1l0-.2c0-25.4 18.9-46.5 43.4-49.9l0 0c4.4 18.8 21.3 32.8 41.5 32.8zM177.1 246.9c16.7 0 29.5 17.6 28.5 39.3s-13.5 29.6-30.3 29.6s-31.4-8.8-30.4-30.5s15.4-38.3 32.1-38.3zm190.1 38.3c1 21.7-13.7 30.5-30.4 30.5s-29.3-7.9-30.3-29.6c-1-21.7 11.8-39.3 28.5-39.3s31.2 16.6 32.1 38.3zm-48.1 56.7c-10.3 24.6-34.6 41.9-63 41.9s-52.7-17.3-63-41.9c-1.2-2.9 .8-6.2 3.9-6.5c18.4-1.9 38.3-2.9 59.1-2.9s40.7 1 59.1 2.9c3.1 .3 5.1 3.6 3.9 6.5z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="quote-details hidden">
                ${authorImageHTML}
            </div>
        `;

        // Check if this quote is liked and set the heart icon color accordingly
        const heartIcon = quoteLink.querySelector('#heart-icon');
        if (likedQuotes.some(likedQuote => likedQuote.text === quote.text && likedQuote.author === quote.author)) {
            heartIcon.style.fill = 'red'; // Set heart to red if already liked
        }

        // Add click event listener to the heart icon
        heartIcon.addEventListener('click', function () {
            toggleHeartColor(quote, heartIcon);
        });

        // Append quote to container
        quoteDiv.appendChild(quoteLink);
        quotesContainer.appendChild(quoteDiv);
    });

    setupQuoteClickEvents(); // Setup click events for quote elements
    updatePaginationButtons(); // Update pagination buttons state
}


// Function to toggle heart color and store the quote in localStorage
function toggleHeartColor(quote, heartIcon) {
    let storedQuotes = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];

    // Check if the quote is already in localStorage
    const quoteIndex = storedQuotes.findIndex(storedQuote => storedQuote.text === quote.text && storedQuote.author === quote.author);

    if (quoteIndex === -1) {
        // If the quote is not in localStorage, add it
        storedQuotes.push(quote);
        localStorage.setItem('favoriteQuotes', JSON.stringify(storedQuotes));

        // Change heart color to red
        heartIcon.style.fill = 'red';
    } else {
        // If the quote is already in localStorage, remove it
        storedQuotes.splice(quoteIndex, 1);
        localStorage.setItem('favoriteQuotes', JSON.stringify(storedQuotes));

        // Reset heart color
        heartIcon.style.fill = 'white';
    }

    // Update the filter if "liked" filter is active
    if (document.getElementById('filter-liked').value === "liked") {
        filteredQuotes = getLikedQuotes();
        displayQuotes();
    }
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

// Update de filterByCategory functie om de liked filter samen met de categorie filter te gebruiken
function filterByCategory() {
    const category = document.getElementById('category-filter').value;
    const likedFilter = document.getElementById('filter-liked').value;

    // Eerst filteren op categorie
    if (category) {
        filteredQuotes = quotes.filter(quote => quote.category === category);
    } else {
        filteredQuotes = quotes; // Als er geen categorie is geselecteerd, toon dan alle quotes
    }

    // Als de liked filter "liked" is, filter dan alleen de gelikete quotes
    if (likedFilter === "liked") {
        filteredQuotes = filteredQuotes.filter(quote => {
            const likedQuotes = getLikedQuotes();
            return likedQuotes.some(likedQuote => likedQuote.text === quote.text && likedQuote.author === quote.author);
        });
    }

    currentPage = 1; // Reset naar de eerste pagina bij het filteren
    displayQuotes(); // Toon de gefilterde quotes
}


// Function to add event listeners for search input and category filter
function addEventListenersForQuotes() {
    document.getElementById('search-input').addEventListener("input", searchQuotes);
    document.getElementById('search-option').addEventListener("change", searchQuotes);
    document.getElementById('category-filter').addEventListener("change", filterByCategory);
    document.getElementById('filter-liked').addEventListener("change", filterByCategory);
}

// Update de zoekfunctie om rekening te houden met de categorie en liked filter
function searchQuotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchOption = document.getElementById('search-option').value;
    const likedFilter = document.getElementById('filter-liked').value;
    const categoryFilter = document.getElementById('category-filter').value;

    let newFilteredQuotes = quotes;

    // Als de liked filter "liked" is, filter dan alleen de gelikete quotes
    if (likedFilter === "liked") {
        newFilteredQuotes = getLikedQuotes();

        // Als er een categorie is geselecteerd, filter dan op die categorie binnen de gelikete quotes
        if (categoryFilter) {
            newFilteredQuotes = newFilteredQuotes.filter(quote => quote.category === categoryFilter);
        }
    } else {
        // Als de liked filter niet is geselecteerd, filter eerst op categorie
        if (categoryFilter) {
            newFilteredQuotes = newFilteredQuotes.filter(quote => quote.category === categoryFilter);
        }
    }

    // Zoeken op tekst of auteur in de gefilterde lijst van quotes
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

    filteredQuotes = newFilteredQuotes; // Update de gefilterde quotes
    currentPage = 1; // Reset naar de eerste pagina bij zoeken
    displayQuotes(); // Toon de gefilterde en doorzoekte quotes
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
