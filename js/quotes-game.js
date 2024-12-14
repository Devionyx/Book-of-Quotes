let quotes = [];
let currentQuote = null;
let score = 0;
let lives = 3;

// Laad de citaten uit het JSON-bestand
function loadQuotes() {
    console.log("Loading quotes...");
    fetch('data/quotes.json')
        .then(response => {
            // Check of de response ok is
            if (!response.ok) {
                throw new Error('Failed to load quotes');
            }
            return response.json();
        })
        .then(data => {
            console.log("Quotes loaded successfully:", data);
            if (data.length > 0) {
                quotes = data;
                nextQuote(); // Start de game met de eerste quote
            } else {
                document.getElementById('quote-text').innerText = "No quotes available.";
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            document.getElementById('quote-text').innerText = "Failed to load quotes.";
        });
}

// Kies een willekeurige quote en toon deze
function nextQuote() {
    if (quotes.length === 0) {
        console.error("No quotes to display.");
        document.getElementById('quote-text').innerText = "No quotes available.";
        return;
    }

    // Kies een willekeurige quote uit de lijst
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];

    // Toont de quote op het scherm
    console.log("Current Quote: ", currentQuote);  // Voeg log toe om de geladen quote te controleren
    document.getElementById('quote-text').innerText = `"${currentQuote.text}"`;

    // Toon de auteursopties
    displayOptions();
}

// Toon de auteursopties (de juiste auteur en twee willekeurige auteurs)
function displayOptions() {
    const authors = [currentQuote.author];

    // Voeg twee willekeurige auteurs toe
    while (authors.length < 3) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        if (!authors.includes(randomQuote.author)) {
            authors.push(randomQuote.author);
        }
    }

    // Schud de auteursopties
    shuffle(authors);

    // Voeg de auteursopties toe aan de HTML
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Maak de vorige opties leeg

    authors.forEach(author => {
        const optionButton = document.createElement('button');
        optionButton.innerText = author;
        optionButton.onclick = () => checkAnswer(author);
        optionsContainer.appendChild(optionButton);
    });
}

// Controleer of het gekozen antwoord correct is
function checkAnswer(selectedAuthor) {
    if (selectedAuthor === currentQuote.author) {
        score++; // Verhoog de score als het antwoord juist is
        showPopup('Correct!');
    } else {
        lives--; // Verlies 1 leven als het antwoord fout is
        showPopup('Incorrect!');
    }

    // Update de score en levens op het scherm
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('lives').innerText = 'Lives: ' + lives;

    // Als er geen levens meer zijn, reset het spel
    if (lives === 0) {
        showPopup('Game Over!');
        resetGame(); // Start het spel opnieuw
    } else {
        // Toon de volgende quote
        nextQuote();
    }
}

// Toon de pop-up melding
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerText = message;

    // Toon de pop-up met animatie
    popup.classList.add('show');

    // Verberg de pop-up na 2 seconden
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

// Schud de auteursopties (randomize)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Wissel de elementen
    }
}

// Reset het spel wanneer de levens op zijn
function resetGame() {
    score = 0;
    lives = 3;
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('lives').innerText = 'Lives: ' + lives;
    nextQuote(); // Start het spel opnieuw met een nieuwe quote
}

// Laad de citaten bij het laden van de pagina
window.onload = loadQuotes;
