// Haal de quote-id op uit de URL
function getQuoteIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id'); // Verwacht dat de URL een query parameter zoals ?id=1 heeft
}

// Laad de quotes uit de JSON
function loadQuoteDetail() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(data => {
            const quoteId = getQuoteIdFromUrl();
            const quote = data.find(q => q.id == quoteId); // Zoek de quote met de juiste ID

            if (quote) {
                document.getElementById('quote-text').textContent = `"${quote.text}"`;
                document.getElementById('quote-author').textContent = `- ${quote.author}`;
                document.getElementById('quote-category').textContent = `Category: ${quote.category}`;
                document.getElementById('quote-description').textContent = `Description: ${quote.description}`;
            } else {
                console.error('Quote not found.');
            }
        })
        .catch(error => {
            console.error('Error loading quote detail:', error);
        });
}

// Laad de quote details bij het laden van de pagina
window.onload = loadQuoteDetail;
