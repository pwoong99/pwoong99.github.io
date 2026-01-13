import initLinks from './modules/links.js';
import initGames from './modules/games.js';
import initTimer from './modules/timer.js';
import initSeating from './modules/seating.js';
import initTimetable from './modules/timetable.js';
import initGuestbook from './modules/guestbook.js';
import initRandomDraw from './modules/randomDraw.js';
import { initWeather, initQuotes, initVisitorCount } from './modules/widgets.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("App initialized");

    // --- DOM Elements ---
    const navCards = document.querySelectorAll('.nav-card');
    const homeBtn = document.getElementById('global-home-btn');

    // --- Module Initialization ---
    // Capture return values for modules that expose methods (like reset)
    const timerModule = initTimer ? initTimer() : null;
    const seatingModule = initSeating ? initSeating() : null;
    const randomDrawModule = initRandomDraw ? initRandomDraw() : null;

    // Initialize other modules
    if (initLinks) initLinks();
    if (initGames) initGames();
    if (initTimetable) initTimetable();
    if (initGuestbook) initGuestbook();

    // Initialize Widgets with Error Handling
    try {
        initWeather();
    } catch (e) { console.error("Weather Init Failed", e); }

    try {
        initQuotes();
    } catch (e) { console.error("Quotes Init Failed", e); }

    try {
        initVisitorCount();
    } catch (e) { console.error("Visitor Init Failed", e); }

    // Date Display
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateEl = document.getElementById('current-date');
        if (dateEl) dateEl.textContent = now.toLocaleDateString('ko-KR', options);
    };
    updateDate();

    // --- Transition Logic ---
    function switchSection(targetId) {
        const currentActive = document.querySelector('section.active-section');
        const targetSection = document.getElementById(targetId);

        // If clicking the same link, do nothing
        if (currentActive === targetSection) return;

        // 1. Activate New Section (Instant)
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }

        // 2. Deactivate Old Section (Instant)
        if (currentActive) {
            currentActive.classList.remove('active-section');
            currentActive.classList.add('hidden-section');
        }
    }

    // Go to Feature
    navCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            console.log("Navigating to:", targetId);

            switchSection(targetId);

            // Show Home Button
            if (homeBtn) homeBtn.classList.remove('hidden');
        });
    });

    // Back to Home
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            console.log("Returning to Home");

            switchSection('home');

            // Hide Home Button
            homeBtn.classList.add('hidden');

            // Reset Modules
            if (timerModule && timerModule.reset) timerModule.reset();
            if (seatingModule && seatingModule.reset) seatingModule.reset();
            if (randomDrawModule && randomDrawModule.reset) randomDrawModule.reset();
        });
    }
});
