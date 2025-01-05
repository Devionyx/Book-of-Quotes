let quotes = [];
let currentQuote = null;
let score = 0;
let lives = 3;



const harts = {
    1: '❤️',
    2: '❤️❤️',
    3: '❤️❤️❤️'
}
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
// Kies een willekeurige quote en toon deze
function nextQuote() {
    if (quotes.length === 0) {
        console.error("No quotes to display.");
        typeText("No quotes available.")
        return;
    }

    // Kies een willekeurige quote uit de lijst
    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];

    // Toont de quote op het scherm (maar met typing animatie)
    console.log("Current Quote: ", currentQuote);  // Voeg log toe om de geladen quote te controleren
    typeText(currentQuote.text)

    // Toon de auteursopties
    displayOptions();
}

function typeText(fullText) {
    const quoteContainer = document.getElementById('quote-text');
    quoteContainer.innerText = ''; // Zorg dat de container leeg is bij het starten van de animatie
    let index = 0;

    // Functie om één letter per keer te typen
    function typeCharacter() {
        if (index < fullText.length) {
            quoteContainer.textContent += fullText.charAt(index); // Voeg de volgende letter toe aan de tekst
            index++;  // Verhoog de index voor de volgende letter
            setTimeout(typeCharacter, 20); // Wacht 50ms per letter voordat de volgende wordt toegevoegd
        }
    }

    typeCharacter(); // Start de typing-functie
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
        const optionButton = document.createElement('div');
        optionButton.classList.add('option-card');
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
    document.getElementById('score').innerText = '⭐ Score: ' + score;
    document.getElementById('lives').innerText = harts[lives];

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
    if (message == "Correct!") {
        document.querySelector(".popup").style.border = "3px solid green"
    }
    else {
        document.querySelector(".popup").style.border = "3px solid red"
    }

    // Toon de pop-up met animatie
    popup.classList.add('show');

    // Verberg de pop-up na 2 seconden
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000);
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
    document.getElementById('score').innerText = '⭐ Score: ' + score;
    document.getElementById('lives').innerText = harts[lives];
    nextQuote(); // Start het spel opnieuw met een nieuwe quote
}

// Laad de citaten bij het laden van de pagina
window.onload = loadQuotes;
