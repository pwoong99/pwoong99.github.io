export default function initRandomDraw() {
    const minInput = document.getElementById('draw-min');
    const maxInput = document.getElementById('draw-max');
    const drawBtn = document.getElementById('start-draw-btn');
    const display = document.getElementById('draw-display');
    const resultText = document.getElementById('draw-result');

    let isRolling = false;

    drawBtn.addEventListener('click', () => {
        if (isRolling) return;

        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);

        if (!min || !max || min > max) {
            alert('올바른 번호 범위를 입력해주세요!');
            return;
        }

        startRolling(min, max);
    });

    function startRolling(min, max) {
        isRolling = true;
        drawBtn.disabled = true;
        display.classList.remove('winner');
        display.style.transform = 'scale(1)';
        resultText.textContent = '두구두구...';

        // Rolling Effect
        let speed = 50; // Initial speed (ms)
        let round = 0;
        const maxRounds = 30; // Total number of changes before stopping

        const roll = () => {
            // Generate random number
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            display.textContent = randomNum;

            if (round < maxRounds) {
                // Determine next speed (slow down at the end)
                if (round > maxRounds - 10) speed += 30; // Slow down drastically in last 10 frames
                else if (round > maxRounds - 5) speed += 100;

                round++;
                setTimeout(roll, speed);
            } else {
                // Final Result
                finalize(randomNum);
            }
        };

        roll();
    }

    function finalize(num) {
        isRolling = false;
        drawBtn.disabled = false;

        // Final Win Effect
        display.textContent = num;
        display.classList.add('winner');
        resultText.textContent = '당첨!';

        // Confetti-like pulses or color change done in CSS via 'winner' class
    }
    const reset = () => {
        isRolling = false;
        drawBtn.disabled = false;
        display.classList.remove('winner');
        display.style.transform = 'scale(1)';
        display.textContent = '?';
        resultText.textContent = '두구두구...';
        minInput.value = '1';
        maxInput.value = '25';
    };

    return { reset };
}
