import initLinks from './modules/links.js';
import initGames from './modules/games.js';
import initTimer from './modules/timer.js';
import initSeating from './modules/seating.js';
import initTimetable from './modules/timetable.js';

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('main section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // UI Updates
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(section => {
                if(section.id === targetId) {
                    section.classList.remove('hidden-section');
                    section.classList.add('active-section');
                    
                    // Reset animation helper
                    section.style.animation = 'none';
                    section.offsetHeight; /* trigger reflow */
                    section.style.animation = 'fadeIn 0.5s ease';
                } else {
                    section.classList.add('hidden-section');
                    section.classList.remove('active-section');
                }
            });
        });
    });

    // Date Display
    const updateDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').textContent = now.toLocaleDateString('ko-KR', options);
    };
    updateDate();
    
    // Initialize Modules
    initLinks();
    initGames();
    initTimer();
    initSeating();
    initTimetable();
});
