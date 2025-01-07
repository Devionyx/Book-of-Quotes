let quotes = [];
let currentQuote = null;
let score = 0;
let lives = 3;



const harts = {
    1: '❤️',
    2: '❤️❤️',
    3: '❤️❤️❤️'
}

function loadQuotes() {
    console.log("Loading quotes...");
    fetch('data/quotes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load quotes');
            }
            return response.json();
        })
        .then(data => {
            console.log("Quotes loaded successfully:", data);
            if (data.length > 0) {
                quotes = data;
                nextQuote();
            } else {
                document.getElementById('quote-text').innerText = "No quotes available.";
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            document.getElementById('quote-text').innerText = "Failed to load quotes.";
        });
}

function nextQuote() {
    if (quotes.length === 0) {
        console.error("No quotes to display.");
        typeText("No quotes available.")
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    currentQuote = quotes[randomIndex];

    console.log("Current Quote: ", currentQuote);
    typeText(currentQuote.text)

    displayOptions();
}

function typeText(fullText) {
    const quoteContainer = document.getElementById('quote-text');
    quoteContainer.innerText = '';
    let index = 0;

    function typeCharacter() {
        if (index < fullText.length) {
            quoteContainer.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeCharacter, 20);
        }
    }

    typeCharacter();
}


function displayOptions() {
    const authors = [currentQuote.author];

    while (authors.length < 3) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        if (!authors.includes(randomQuote.author)) {
            authors.push(randomQuote.author);
        }
    }

    shuffle(authors);

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

function checkAnswer(selectedAuthor) {
    if (selectedAuthor === currentQuote.author) {
        score++;
        showPopup('Correct!');
    } else {
        lives--;
        showPopup('Incorrect!');
    }

    document.getElementById('score').innerText = '⭐ Score: ' + score;
    document.getElementById('lives').innerText = harts[lives];

    if (lives === 0) {
        showPopup('Game Over!');
        resetGame();
    } else {
        nextQuote();
    }
}

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

    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Wissel de elementen
    }
}

function resetGame() {
    score = 0;
    lives = 3;
    document.getElementById('score').innerText = '⭐ Score: ' + score;
    document.getElementById('lives').innerText = harts[lives];
    nextQuote();
}

window.onload = loadQuotes;
