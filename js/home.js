// Function to update scroll-based visual changes
function updateScrollPercentage() {
    // Get the current scroll position and document height
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Calculate the scroll percentage
    const scrollPercentage = Math.round((scrollPosition / documentHeight) * 100);

    // Show or hide elements based on scroll percentage
    // If scroll position is greater than or equal to 10%
    if (scrollPercentage >= 10) {
        showInitialElements(); // Show elements when scroll percentage reaches 10%
    } else {
        hideInitialElements(); // Hide elements when scroll percentage is less than 10%
    }

    // Show additional elements when scroll percentage reaches 20%
    if (scrollPercentage >= 20) {
        showSecondStageElements();
    } else {
        hideSecondStageElements();
    }

    // Show more elements when scroll percentage reaches 30%
    if (scrollPercentage >= 30) {
        showThirdStageElements();
    } else {
        hideThirdStageElements();
    }

    // Show categories section when scroll percentage reaches 70%
    if (scrollPercentage >= 70) {
        showCategoriesSection();
    } else {
        hideCategoriesSection();
    }

    // Show categories section as visible when scroll percentage reaches 80%
    if (scrollPercentage >= 80) {
        document.querySelector('.categories-section1').classList.add('visible');
    } else {
        document.querySelector('.categories-section1').classList.remove('visible');
    }
}

// Function to show initial set of elements
function showInitialElements() {
    document.querySelector('.slide-left-up').classList.add('visible');
    document.querySelector('.slide-right-up').classList.add('visible');
    document.querySelector('.slide-left-down').classList.add('visible');
    document.querySelector('.slide-right-down').classList.add('visible');
    document.querySelector('.slide-up-title').classList.add('visible');
    document.querySelector('.slide-up-nav').classList.add('visible');
    document.querySelector('.slide-up-quotes-section1').classList.add('visible');
}

// Function to hide initial set of elements
function hideInitialElements() {
    document.querySelector('.slide-left-up').classList.remove('visible');
    document.querySelector('.slide-right-up').classList.remove('visible');
    document.querySelector('.slide-left-down').classList.remove('visible');
    document.querySelector('.slide-right-down').classList.remove('visible');
    document.querySelector('.slide-up-title').classList.remove('visible');
    document.querySelector('.slide-up-nav').classList.remove('visible');
    document.querySelector('.slide-up-quotes-section1').classList.remove('visible');
}

// Function to show the second set of elements
function showSecondStageElements() {
    document.querySelector('.slide-up-quotes-section1').classList.add('moreup');
    document.querySelector('.slide-up-quotes-section2').classList.add('visible');
}

// Function to hide the second set of elements
function hideSecondStageElements() {
    document.querySelector('.slide-up-quotes-section1').classList.remove('moreup');
    document.querySelector('.slide-up-quotes-section2').classList.remove('visible');
}

// Function to show the third set of elements
function showThirdStageElements() {
    document.querySelector('.slide-up-quotes-section2').classList.add('moreup');
    document.querySelector('.slide-up-quotes-section3').classList.add('visible');
}

// Function to hide the third set of elements
function hideThirdStageElements() {
    document.querySelector('.slide-up-quotes-section2').classList.remove('moreup');
    document.querySelector('.slide-up-quotes-section3').classList.remove('visible');
}

// Function to show categories section when scrolling past 70%
function showCategoriesSection() {
    document.querySelector('.categories-section1').style.display = 'block';
    document.querySelector('.slide-up-quotes-section1').style.display = 'none';
    document.querySelector('.slide-up-quotes-section2').style.display = 'none';
    document.querySelector('.slide-up-quotes-section3').style.display = 'none';
}

// Function to hide categories section before reaching 70% scroll
function hideCategoriesSection() {
    document.querySelector('.categories-section1').style.display = 'none';
    document.querySelector('.slide-up-quotes-section1').style.display = 'flex';
    document.querySelector('.slide-up-quotes-section2').style.display = 'flex';
    document.querySelector('.slide-up-quotes-section3').style.display = 'flex';
}

// Attach the scroll event listener to trigger the updateScrollPercentage function
window.addEventListener('scroll', updateScrollPercentage);
