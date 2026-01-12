export default function initTimer() {
    let timerInterval;
    let totalSeconds = 0;
    let isRunning = false;

    const displayElement = document.getElementById('timer-display');
    const minInput = document.getElementById('timer-minutes');
    const secInput = document.getElementById('timer-seconds');
    const startBtn = document.getElementById('start-timer');
    const resetBtn = document.getElementById('reset-timer');

    function updateDisplay(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        displayElement.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        // Dynamic color change when time is low (less than 1 minute)
        if (seconds < 60 && seconds > 0) {
            displayElement.style.color = '#E07A5F'; // Warm Alert Color
        } else {
            displayElement.style.color = ''; // Inherit from CSS (Dark)
        }
    }

    startBtn.addEventListener('click', () => {
        if (isRunning) return;

        const mins = parseInt(minInput.value) || 0;
        const secs = parseInt(secInput.value) || 0;

        if (totalSeconds === 0) {
            totalSeconds = mins * 60 + secs;
        }

        if (totalSeconds <= 0) {
            alert("시간을 설정해주세요!");
            return;
        }

        isRunning = true;
        startBtn.textContent = '일시정지';
        startBtn.style.opacity = '0.7';

        updateDisplay(totalSeconds);

        timerInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                displayElement.textContent = "Time's Up!";
                isRunning = false;
                startBtn.textContent = '시작';
                startBtn.style.opacity = '1';
                // Play a generic beep or visual flash here ideally
                return;
            }
            totalSeconds--;
            updateDisplay(totalSeconds);
        }, 1000);
    });

    const reset = () => {
        clearInterval(timerInterval);
        isRunning = false;
        totalSeconds = 0;
        minInput.value = '';
        secInput.value = '';
        updateDisplay(0);
        startBtn.textContent = '시작';
        startBtn.style.opacity = '1';
        displayElement.textContent = "00:00";
        displayElement.style.color = "";
    };

    resetBtn.addEventListener('click', reset);

    return { reset };
}
