export default function initSeating() {
    const nameInput = document.getElementById('student-names');
    const colsInput = document.getElementById('columns-count');
    const generateBtn = document.getElementById('generate-seats');
    const grid = document.getElementById('seating-grid');

    // Load saved names if any
    const savedNames = localStorage.getItem('class_names');
    if (savedNames) {
        nameInput.value = savedNames;
    }

    generateBtn.addEventListener('click', () => {
        const rawNames = nameInput.value.trim();
        if (!rawNames) {
            alert('학생 이름을 입력해주세요!');
            return;
        }

        // Save for later
        localStorage.setItem('class_names', rawNames);

        // Process names
        let names = rawNames.split('\n').map(n => n.trim()).filter(n => n);

        // Shuffle
        names = names.sort(() => Math.random() - 0.5);

        // Render
        const cols = parseInt(colsInput.value) || 4;
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.innerHTML = '';

        names.forEach((name, i) => {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = name;
            seat.style.animationDelay = `${i * 0.05}s`; // Staggered animation
            grid.appendChild(seat);
        });
    });
}
