let quotes = [];
let filteredQuotes = [];
let currentPage = 1;
let quotesPerPage = 10;

function loadQuotes() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            filteredQuotes = quotes; // Initialiseer de gefilterde quotes als alle citaten
            const category = getCategoryFromUrl();
            if (category) {
                filteredQuotes = quotes.filter(quote => quote.category === category);
                document.getElementById('category-filter').value = category;
            }
            displayQuotes();
        })
        .catch(error => console.error('Error loading quotes:', error));
}

function displayQuotes() {
    const quotesContainer = document.getElementById('quotes-list');
    quotesContainer.innerHTML = ''; // Maak de container leeg

    const start = (currentPage - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    const quotesToDisplay = filteredQuotes.slice(start, end);

    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');

        // Voeg een link toe naar de quote detailpagina met het id van de quote als URL parameter
        const quoteLink = document.createElement('a');
        quoteLink.href = `quote-detail.html?id=${quote.id}`;
        quoteLink.classList.add('quote-link');

        quoteLink.innerHTML = `
            <p class="quote-text">"${quote.text}" – ${quote.author}</p>
            <p class="quote-category">Category: ${quote.category}</p>
        `;

        quoteDiv.appendChild(quoteLink); // Voeg de link toe aan de quote div
        quotesContainer.appendChild(quoteDiv);
    });

    updatePaginationButtons();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayQuotes();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayQuotes();
    }
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);

    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;

    // Verberg de paginatie als er minder dan 10 citaten zijn
    const paginationContainer = document.getElementById('pagination-container');
    if (filteredQuotes.length <= quotesPerPage) {
        paginationContainer.style.display = 'none';
    } else {
        paginationContainer.style.display = 'flex';
    }
}

function filterByCategory() {
    const category = document.getElementById('category-filter').value;
    if (category) {
        filteredQuotes = quotes.filter(quote => quote.category === category);
    } else {
        filteredQuotes = quotes;
    }
    currentPage = 1;
    displayQuotes();
}

function searchQuotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchOption = document.getElementById('search-option').value;

    let newFilteredQuotes = quotes;

    if (document.getElementById('category-filter').value) {
        newFilteredQuotes = newFilteredQuotes.filter(quote =>
            quote.category === document.getElementById('category-filter').value
        );
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
    currentPage = 1;
    displayQuotes();
}

function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}

window.onload = loadQuotes;



// Functie om de Quote of the Day te tonen, op basis van de datum
function loadQuoteOfTheDay() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            // Haal de huidige datum op (jaar, maand, dag)
            const today = new Date();
            const dayOfYear = today.getFullYear() * 1000 + today.getMonth() * 30 + today.getDate(); // Combineer jaar, maand en dag

            // Bereken de index van de quote op basis van de dag van het jaar
            const quoteIndex = dayOfYear % quotes.length; // Dit zorgt ervoor dat de quote per dag hetzelfde is

            // Kies de quote van de dag
            const quoteOfTheDay = quotes[quoteIndex];

            // Start het type-effect
            typeText(`"${quoteOfTheDay.text}" – ${quoteOfTheDay.author}`);
        })
        .catch(error => {
            console.error('Fout bij het laden van de quote of the day:', error);
        });
}

function typeText(fullText) {
    const quoteContainer = document.getElementById('quote-container');
    quoteContainer.innerHTML = ''; // Zorg dat de container leeg is
    let index = 0;

    function typeCharacter() {
        if (index < fullText.length) {
            quoteContainer.textContent += fullText.charAt(index); // Voeg de volgende letter toe
            index++;
            setTimeout(typeCharacter, 50); // Typ snelheid (50ms per letter)
        }
    }

    typeCharacter(); // Start de typing-functie
}



// Laad de citaten bij het laden van de pagina






// Laad de juiste content afhankelijk van de pagina
if (document.getElementById('quotes')) {
    window.onload = loadQuotes;  // Voor de quotes pagina
} else if (document.getElementById('quote-container')) {
    window.onload = loadQuoteOfTheDay;  // Voor de quote of the day pagina
}
