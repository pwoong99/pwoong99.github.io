import initLinks from './modules/links.js';
import initGames from './modules/games.js';
import initTimer from './modules/timer.js';
import initSeating from './modules/seating.js';
import initTimetable from './modules/timetable.js';
import { initWeather, initQuotes, initVisitorCount } from './modules/widgets.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Widgets (Weather, Quotes, Visitor)
    initWeather();
    initQuotes();
    initVisitorCount();

    // Navigation Logic
    const navCards = document.querySelectorAll('.nav-card');
    const homeBtn = document.getElementById('global-home-btn');
    const homeSection = document.getElementById('home');
    const sections = document.querySelectorAll('main section');

    // Go to Feature
    navCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');

            // Hide Home
            homeSection.classList.add('hidden-section');
            homeSection.classList.remove('active-section');

            // Show Target
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.remove('hidden-section');
                    sec.classList.add('active-section');
                } else {
                    sec.classList.add('hidden-section');
                    sec.classList.remove('active-section');
                }
            });

            // Show Home Button
            homeBtn.classList.remove('hidden');
        });
    });

    // Back to Home
    homeBtn.addEventListener('click', () => {
        // Hide all frames
        sections.forEach(sec => {
            sec.classList.remove('active-section');
            sec.classList.add('hidden-section');
        });

        // Show Home
        homeSection.classList.remove('hidden-section');
        homeSection.classList.add('active-section');

        // Hide Home Button
        homeBtn.classList.add('hidden');
    });

    // Date Display
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        // We might have multiple date displays now or just one
        const dateEl = document.getElementById('current-date');
        if (dateEl) dateEl.textContent = now.toLocaleDateString('ko-KR', options);
    };
    updateDate();

    // Initialize Modules
    initLinks();
    initGames();
    initTimer();
    initSeating();
    initTimetable();
});
