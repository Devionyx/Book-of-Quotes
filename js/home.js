function updateScrollPercentage() {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = Math.round((scrollPosition / documentHeight) * 100);

    if (scrollPercentage >= 10) {
        document.querySelector('.slide-left-up').classList.add('visible');
        document.querySelector('.slide-right-up').classList.add('visible');
        document.querySelector('.slide-left-down').classList.add('visible');
        document.querySelector('.slide-right-down').classList.add('visible');
        document.querySelector('.slide-up-title').classList.add('visible');
        document.querySelector('.slide-up-nav').classList.add('visible');
        document.querySelector('.slide-up-quotes-section1').classList.add('visible');

    }
    else {
        document.querySelector('.slide-left-up').classList.remove('visible');
        document.querySelector('.slide-right-up').classList.remove('visible');
        document.querySelector('.slide-left-down').classList.remove('visible');
        document.querySelector('.slide-right-down').classList.remove('visible');
        document.querySelector('.slide-up-title').classList.remove('visible');
        document.querySelector('.slide-up-nav').classList.remove('visible');
        document.querySelector('.slide-up-quotes-section1').classList.remove('visible');

    }
    if (scrollPercentage >= 20) {
        document.querySelector('.slide-up-quotes-section1').classList.add('moreup');
        document.querySelector('.slide-up-quotes-section2').classList.add('visible');
    }
    else {
        document.querySelector('.slide-up-quotes-section1').classList.remove('moreup');
        document.querySelector('.slide-up-quotes-section2').classList.remove('visible');
    }

    if (scrollPercentage >= 30) {
        document.querySelector('.slide-up-quotes-section2').classList.add('moreup');
        document.querySelector('.slide-up-quotes-section3').classList.add('visible');
    }
    else {
        document.querySelector('.slide-up-quotes-section2').classList.remove('moreup');
        document.querySelector('.slide-up-quotes-section3').classList.remove('visible');
    }

    if (scrollPercentage >= 70) {
        document.querySelector('.categories-section1').style.display = 'block';
        document.querySelector('.slide-up-quotes-section1').style.display = 'none';
        document.querySelector('.slide-up-quotes-section2').style.display = 'none';
        document.querySelector('.slide-up-quotes-section3').style.display = 'none';

    }
    else {
        document.querySelector('.categories-section1').style.display = 'none';
        document.querySelector('.slide-up-quotes-section1').style.display = 'flex';
        document.querySelector('.slide-up-quotes-section2').style.display = 'flex';
        document.querySelector('.slide-up-quotes-section3').style.display = 'flex';
    }

    if (scrollPercentage >= 80) {
        document.querySelector('.categories-section1').classList.add('visible');
    }
    else {
        document.querySelector('.categories-section1').classList.remove('visible');
    }
}
window.addEventListener('scroll', updateScrollPercentage);