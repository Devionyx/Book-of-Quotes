const cards = document.querySelectorAll('.category-card');
const description = document.getElementById('category-description');
const quote1 = document.getElementById('quote-1');
const quote2 = document.getElementById('quote-2');
const quoteContainer = document.querySelector('.categories-quote-container');
let allQuotes = [];


cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        description.textContent = card.getAttribute('data-description');
        description.style.display = 'block';

    });
    card.addEventListener('mouseleave', () => {
        description.textContent = '';
        description.style.display = 'none';
    });
});


fetch('data/quotes.json')
    .then(response => response.json())
    .then(data => {
        allQuotes = data; // Laad alle citaten
    })
    .catch(error => console.error('Error loading quotes:', error));

function getRandomQuotes(category) {
    // Filter citaten op categorie
    const categoryQuotes = allQuotes.filter(quote => quote.category === category);

    // Kies twee willekeurige citaten
    if (categoryQuotes.length >= 2) {
        const shuffled = categoryQuotes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2); // Neem de eerste 2 van de gesorteerde array
    } else if (categoryQuotes.length === 1) {
        return [categoryQuotes[0]]; // Als er maar 1 quote is
    }
    return [];
}

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const category = card.querySelector('h3').textContent;
        const quotes = getRandomQuotes(category);

        if (quotes.length > 0) {
            quote1.textContent = `"${quotes[0].text}" – ${quotes[0].author}`;
            if (quotes[1]) {
                quote2.textContent = `"${quotes[1].text}" – ${quotes[1].author}`;
            } else {
                quote2.textContent = ''; // Als er geen tweede quote is
            }
            quoteContainer.style.display = 'flex';
        }
    });

    card.addEventListener('mouseleave', () => {
        quote1.textContent = '';
        quote2.textContent = '';
        quoteContainer.style.display = 'none'; // Verberg de container
    });
});