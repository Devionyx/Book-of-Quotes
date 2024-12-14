// Functie om citaten te laden via een fetch-aanroep
function loadQuotes() {
    fetch('data/quotes.json')  // Laad het JSON-bestand met citaten
        .then(response => response.json())
        .then(quotes => {
            const quotesContainer = document.getElementById('quotes');
            quotesContainer.innerHTML = ''; // Maak de quotes-sectie leeg

            // Voeg de citaten toe aan de pagina
            quotes.forEach(quote => {
                const quoteDiv = document.createElement('div');
                quoteDiv.classList.add('quote');
                quoteDiv.innerHTML = `<p class="quote-text">"${quote.text}" – ${quote.author}</p>`;
                quotesContainer.appendChild(quoteDiv);
            });
        })
        .catch(error => {
            console.error('Fout bij het laden van citaten:', error);
        });
}

// Laad de citaten zodra de pagina geladen is
window.onload = loadQuotes;
