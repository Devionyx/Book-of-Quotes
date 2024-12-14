let quotes = [];
let filteredQuotes = []; // Deze array houdt de gefilterde citaten bij
let currentPage = 1;
let quotesPerPage = 10;

// Functie om citaten te laden
function loadQuotes() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            filteredQuotes = quotes; // Initialiseer de gefilterde quotes als alle citaten
            const category = getCategoryFromUrl();
            if (category) {
                // Als er een categorie in de URL staat, filter de citaten op die categorie
                filteredQuotes = quotes.filter(quote => quote.category === category);
                document.getElementById('category-filter').value = category; // Zet de categorie in de dropdown
            }
            displayQuotes();
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
        });
}

// Functie om de citaten weer te geven
function displayQuotes() {
    const quotesContainer = document.getElementById('quotes-list');
    quotesContainer.innerHTML = ''; // Maak de lijst leeg

    // Bepaal het bereik van citaten voor de huidige pagina
    const start = (currentPage - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    const quotesToDisplay = filteredQuotes.slice(start, end);

    // Voeg citaten toe aan de pagina
    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');
        quoteDiv.innerHTML = `<p class="quote-text">"${quote.text}" – ${quote.author}</p><p class="quote-category">Category: ${quote.category}</p>`;
        quotesContainer.appendChild(quoteDiv);
    });

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
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayQuotes();
    }
}

// Functie om de pagineringsknoppen in te schakelen of uit te schakelen
function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
    document.getElementById('prev-btn').disabled = currentPage === 1;
    document.getElementById('next-btn').disabled = currentPage === totalPages;
}

// Functie om citaten op basis van categorie te filteren
function filterByCategory() {
    const category = document.getElementById('category-filter').value;
    let newFilteredQuotes = quotes;

    if (category) {
        newFilteredQuotes = quotes.filter(quote => quote.category === category);
    }

    filteredQuotes = newFilteredQuotes; // Update gefilterde citaten
    searchQuotes(); // Zorg ervoor dat de zoekfunctie opnieuw wordt toegepast op de gefilterde citaten
}

// Functie om citaten op basis van de zoekterm te filteren
function searchQuotes() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchOption = document.getElementById('search-option').value; // Haal op wat de gebruiker heeft geselecteerd (tekst of auteur)

    let newFilteredQuotes = quotes;

    // Als er een categorie is geselecteerd, pas deze filter toe
    if (document.getElementById('category-filter').value) {
        newFilteredQuotes = newFilteredQuotes.filter(quote =>
            quote.category === document.getElementById('category-filter').value
        );
    }

    // Als er een zoekterm is, filter dan de citaten op basis van de geselecteerde optie (tekst of auteur)
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

    filteredQuotes = newFilteredQuotes; // Update de gefilterde citaten
    currentPage = 1; // Reset naar de eerste pagina bij elke zoekopdracht
    displayQuotes(); // Weergave van de gefilterde citaten
}

// Haal de categorie op uit de URL-queryparameter
function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category');
}


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

// Laad de citaten bij het laden van de pagina
window.onload = loadQuotes;





// Laad de juiste content afhankelijk van de pagina
if (document.getElementById('quotes')) {
    window.onload = loadQuotes;  // Voor de quotes pagina
} else if (document.getElementById('quote-container')) {
    window.onload = loadQuoteOfTheDay;  // Voor de quote of the day pagina
}
