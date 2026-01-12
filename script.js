import initLinks from './modules/links.js';
import initGames from './modules/games.js';
import initTimer from './modules/timer.js';
import initSeating from './modules/seating.js';
import initTimetable from './modules/timetable.js';
import { initWeather, initQuotes, initVisitorCount } from './modules/widgets.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("App initialized");

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

    // Navigation Logic
    const navCards = document.querySelectorAll('.nav-card');
    const homeBtn = document.getElementById('global-home-btn');
    const homeSection = document.getElementById('home');
    const sections = document.querySelectorAll('main section');

    // Go to Feature
    navCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            console.log("Navigating to:", targetId);

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
        console.log("Returning to Home");
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
        const dateEl = document.getElementById('current-date');
        if (dateEl) dateEl.textContent = now.toLocaleDateString('ko-KR', options);
    };
    updateDate();

    // Initialize Modules
    try { initLinks(); } catch (e) { console.error("Links Init Failed", e); }
    try { initGames(); } catch (e) { console.error("Games Init Failed", e); }
    try { initTimer(); } catch (e) { console.error("Timer Init Failed", e); }
    try { initSeating(); } catch (e) { console.error("Seating Init Failed", e); }

    try { initTimetable(); } catch (e) { console.error("Timetable Init Failed", e); }

    window.appInitialized = true;
});
