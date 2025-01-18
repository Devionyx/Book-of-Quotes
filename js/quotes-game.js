// Global variables to store quotes, the current quote, score, and lives
let quotes = [];
let currentQuote = null;
let score = 0;
let lives = 3;
let isTyping = false; // Flag to track if the text is still being typed

// Heart icons for displaying lives
const hearts = {
    1: '❤️',
    2: '❤️❤️',
    3: '❤️❤️❤️'
};

// Load quotes from the JSON file
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
                nextQuote(); // Display the next quote if available
            } else {
                document.getElementById('quote-text').innerText = "No quotes available."; // If no quotes, show message
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            document.getElementById('quote-text').innerText = "Failed to load quotes."; // Show error message if loading fails
        });
}

// Display the next quote
function nextQuote() {
    if (quotes.length === 0) {
        console.error("No quotes to display.");
        typeText("No quotes available."); // Display message if there are no quotes
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length); // Pick a random quote
    currentQuote = quotes[randomIndex];

    console.log("Current Quote: ", currentQuote);
    typeText(currentQuote.text); // Type out the quote

    displayOptions(); // Display options for authors
}

// Type the quote text character by character with a delay
function typeText(fullText) {
    const quoteContainer = document.getElementById('quote-text');
    quoteContainer.innerText = ''; // Clear previous text
    let index = 0;

    // Set typing flag to true
    isTyping = true;

    // Function to type each character
    function typeCharacter() {
        if (index < fullText.length) {
            quoteContainer.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeCharacter, 20); // Add a delay between characters
        } else {
            isTyping = false; // Set typing flag to false when done
            enableOptions(); // Enable the options after typing is finished
        }
    }

    typeCharacter();
}

// Display the options for the authors (including the correct one and two random others)
function displayOptions() {
    const authors = [currentQuote.author]; // Start with the correct author

    // Add two more random authors
    while (authors.length < 3) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        if (!authors.includes(randomQuote.author)) {
            authors.push(randomQuote.author);
        }
    }

    shuffle(authors); // Shuffle the options to randomize the order

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = ''; // Clear previous options

    // Create option buttons for each author
    authors.forEach(author => {
        const optionButton = document.createElement('div');
        optionButton.classList.add('option-card');
        optionButton.innerText = author;
        optionButton.onclick = () => checkAnswer(author); // Check the answer when clicked
        optionButton.disabled = true; // Disable the button until typing is finished
        optionsContainer.appendChild(optionButton);
    });
}

// Enable options buttons after typing is done
function enableOptions() {
    const optionButtons = document.querySelectorAll('.option-card');
    optionButtons.forEach(button => {
        button.disabled = false; // Enable the buttons for selection
    });
}

// Check if the selected author is correct and update the score and lives accordingly
function checkAnswer(selectedAuthor) {
    if (isTyping) {
        return; // Prevent selecting an answer while the quote is still being typed
    }

    if (selectedAuthor === currentQuote.author) {
        score++; // Correct answer, increase score
        showPopup('Correct!');
    } else {
        lives--; // Incorrect answer, decrease lives
        showPopup('Incorrect!');
    }

    // Update score and lives on the screen
    document.getElementById('score').innerText = '⭐ Score: ' + score;
    document.getElementById('lives').innerText = hearts[lives];

    // Check if the game is over (no lives left)
    if (lives === 0) {
        showPopup('Game Over!');
        resetGame(); // Reset the game if the player loses all lives
    } else {
        nextQuote(); // Display the next quote if there are remaining lives
    }
}

// Show a popup message (Correct/Incorrect/Game Over)
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    popupMessage.innerText = message;

    // Set popup border color based on correctness
    if (message === "Correct!") {
        document.querySelector(".popup").style.border = "3px solid green";
    } else {
        document.querySelector(".popup").style.border = "3px solid red";
    }

    popup.classList.add('show'); // Show the popup

    // Hide the popup after a short delay
    setTimeout(() => {
        popup.classList.remove('show');
    }, 1000);
}

// Shuffle an array (for randomizing options)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Reset the game (score, lives, and display the next quote)
function resetGame() {
    score = 0;
    lives = 3;
    document.getElementById('score').innerText = '⭐ Score: ' + score;
    document.getElementById('lives').innerText = hearts[lives];
    nextQuote(); // Start a new round
}

// Initialize the game by loading quotes when the window loads
window.onload = loadQuotes;

