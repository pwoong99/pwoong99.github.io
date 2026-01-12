export default function initSeating() {
    const totalInput = document.getElementById('total-students');
    const colsInput = document.getElementById('columns-count');
    const generateBtn = document.getElementById('generate-seats');
    const grid = document.getElementById('seating-grid');

    generateBtn.addEventListener('click', () => {
        const total = parseInt(totalInput.value);
        const cols = parseInt(colsInput.value) || 5;

        if (!total || total < 1) {
            alert('학생 수를 입력해주세요!');
            return;
        }

        // Generate numbers 1 to Total
        let numbers = Array.from({ length: total }, (_, i) => i + 1);

        // Shuffle
        numbers = numbers.sort(() => Math.random() - 0.5);

        // UI Setup
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.innerHTML = '';

        // Render Cards
        // We render "Seat 1", "Seat 2"... and they get assigned a random Student Number
        numbers.forEach((studentNum, i) => {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.style.display = 'flex';
            seat.style.flexDirection = 'column';
            seat.style.justifyContent = 'center';
            seat.style.alignItems = 'center';
            seat.style.height = '100px';
            seat.style.position = 'relative';

            // Initial State: Hidden or Question Mark? 
            // The user said "Student 1 matches random seat... sequence"
            // Let's show the seat number and reveal the student number

            const seatLabel = document.createElement('div');
            seatLabel.style.fontSize = '0.8rem';
            seatLabel.style.opacity = '0.7';
            seatLabel.textContent = `자리 ${i + 1}`; // This is the physical seat 1, 2, 3...

            const studentLabel = document.createElement('div');
            studentLabel.style.fontSize = '2rem';
            studentLabel.style.fontWeight = 'bold';
            studentLabel.style.color = '#E07A5F'; // Warm Accent
            studentLabel.textContent = `${studentNum}번`;

            // Animation: Pop in
            seat.style.animation = `popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${i * 0.1}s both`;

            seat.appendChild(seatLabel);
            seat.appendChild(studentLabel);
            grid.appendChild(seat);
        });
    });
}
