let quotes = [];
let currentPage = 1;
let quotesPerPage = 10; // Aantal citaten per pagina

// Functie om citaten te laden
function loadQuotes() {
    fetch('data/quotes.json')  // Laad de JSON met citaten
        .then(response => response.json())
        .then(data => {
            quotes = data;  // Sla de citaten op in de globale variabele
            displayQuotes();  // Toon de citaten
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
        });
}

// Functie om citaten weer te geven (met paginering)
function displayQuotes() {
    const quotesContainer = document.getElementById('quotes-list');
    quotesContainer.innerHTML = '';  // Maak de lijst leeg

    // Bepaal het bereik van citaten voor de huidige pagina
    const start = (currentPage - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    const quotesToDisplay = quotes.slice(start, end);

    // Voeg citaten toe aan de pagina
    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');
        quoteDiv.innerHTML = `<p class="quote-text">"${quote.text}" – ${quote.author}</p>`;
        quotesContainer.appendChild(quoteDiv);
    });

    // Controleer of de pagineringsknoppen zichtbaar moeten zijn
    if (quotes.length > quotesPerPage) {
        document.querySelector('.pagination').style.display = 'block';
    } else {
        document.querySelector('.pagination').style.display = 'none';
    }

    // Update de navigatieknoppen
    updatePaginationButtons();
}

// Functie om de vorige pagina te tonen
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayQuotes();
    }
}

// Functie om de volgende pagina te tonen
function nextPage() {
    const totalPages = Math.ceil(quotes.length / quotesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayQuotes();
    }
}

// Functie om de pagineringsknoppen in te schakelen of uit te schakelen
function updatePaginationButtons() {
    const totalPages = Math.ceil(quotes.length / quotesPerPage);
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Functie voor zoeken
function filterQuotes() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();

    const filteredQuotes = quotes.filter(quote => {
        return quote.text.toLowerCase().includes(searchTerm) || quote.author.toLowerCase().includes(searchTerm);
    });

    displayQuotesForFilteredQuotes(filteredQuotes);
}

// Functie om gefilterde citaten weer te geven
function displayQuotesForFilteredQuotes(filteredQuotes) {
    const quotesContainer = document.getElementById('quotes-list');
    quotesContainer.innerHTML = '';  // Maak de lijst leeg

    // Voeg gefilterde citaten toe
    filteredQuotes.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');
        quoteDiv.innerHTML = `<p class="quote-text">"${quote.text}" – ${quote.author}</p>`;
        quotesContainer.appendChild(quoteDiv);
    });

    // Controleer of de pagineringsknoppen zichtbaar moeten zijn
    if (filteredQuotes.length > quotesPerPage) {
        document.querySelector('.pagination').style.display = 'block';
    } else {
        document.querySelector('.pagination').style.display = 'none';
    }

    // Update de pagineringsknoppen
    updatePaginationButtons();
}

// Functie voor sorteren
function sortQuotes() {
    const sortBy = document.getElementById('sort-by').value;

    let sortedQuotes;
    if (sortBy === 'author') {
        sortedQuotes = quotes.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'text') {
        sortedQuotes = quotes.sort((a, b) => a.text.localeCompare(b.text));
    }

    displayQuotesForFilteredQuotes(sortedQuotes);
}

// Laad de citaten bij het laden van de pagina
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

            const quoteContainer = document.getElementById('quote-container');
            quoteContainer.innerHTML = `<p class="quote-text">"${quoteOfTheDay.text}" – ${quoteOfTheDay.author}</p>`;
        })
        .catch(error => {
            console.error('Fout bij het laden van de quote of the day:', error);
        });
}

// Laad de juiste content afhankelijk van de pagina
if (document.getElementById('quotes')) {
    window.onload = loadQuotes;  // Voor de quotes pagina
} else if (document.getElementById('quote-container')) {
    window.onload = loadQuoteOfTheDay;  // Voor de quote of the day pagina
}
