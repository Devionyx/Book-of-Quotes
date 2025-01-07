let quotes = [];
let filteredQuotes = [];
let currentPage = 1;
let quotesPerPage = 10;

function loadQuotes() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(data => {
            quotes = data;
            filteredQuotes = quotes;
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
    quotesContainer.innerHTML = '';

    const start = (currentPage - 1) * quotesPerPage;
    const end = start + quotesPerPage;
    const quotesToDisplay = filteredQuotes.slice(start, end);

    quotesToDisplay.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.classList.add('quote');

        const quoteLink = document.createElement('div');

        const authorImageHTML = quote.authorImage ? `<img src="${quote.authorImage}" alt="Image of ${quote.author}" class="author-image">` : '';

        quoteLink.style.display = "flex";
        quoteLink.innerHTML = `
            <div>
                <p class="quote-category">${quote.author}</p>
                <p class="quote-text">"${quote.text}" – ${quote.author}</p>
                <div class="quote-details hidden">
                    <p class="quote-category">Author: ${quote.author}</p>
                    <p class="quote-category">Category: ${quote.category}</p>
                    <p class="quote-category"> Description: ${quote.description || "No description available."}</p>
                </div>
            </div>
            <div class="quote-details hidden">
                ${authorImageHTML}
            </div>
        `;

        quoteDiv.appendChild(quoteLink);
        quotesContainer.appendChild(quoteDiv);
    });

    setupQuoteClickEvents();
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



function loadQuoteOfTheDay() {
    fetch('data/quotes.json')
        .then(response => response.json())
        .then(quotes => {
            const today = new Date();
            const dayOfYear = today.getFullYear() * 1000 + today.getMonth() * 30 + today.getDate();

            const quoteIndex = dayOfYear % quotes.length;

            const quoteOfTheDay = quotes[quoteIndex];

            typeText(`"${quoteOfTheDay.text}" – ${quoteOfTheDay.author}`);
        })
        .catch(error => {
            console.error('Fout bij het laden van de quote of the day:', error);
        });
}

function typeText(fullText) {
    const quoteContainer = document.getElementById('quote-container');
    quoteContainer.innerHTML = '';
    let index = 0;

    function typeCharacter() {
        if (index < fullText.length) {
            quoteContainer.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeCharacter, 50);
        }
    }

    typeCharacter();
}


function setupQuoteClickEvents() {
    const quotes = document.querySelectorAll('.quote');

    quotes.forEach(quote => {
        quote.addEventListener('click', () => {
            // Verwijder 'open' van andere quotes als je maar één tegelijk wilt openen
            document.querySelectorAll('.quote').forEach(q => q.classList.remove('open'));

            // Voeg 'open' toe aan de geklikte quote
            quote.classList.toggle('open');
        });
    });
}



if (document.getElementById('quotes')) {
    window.onload = function () {
        loadQuotes();
        setupQuoteClickEvents();
    };
} else if (document.getElementById('quote-container')) {
    window.onload = loadQuoteOfTheDay;
}
