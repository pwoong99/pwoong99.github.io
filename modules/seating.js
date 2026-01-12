export default function initSeating() {
    const totalInput = document.getElementById('total-students');
    const colsInput = document.getElementById('columns-count');
    const generateBtn = document.getElementById('generate-seats');
    const grid = document.getElementById('seating-grid');

    // Exception Inputs
    const fixStudentInput = document.getElementById('fix-student');
    const fixSeatInput = document.getElementById('fix-seat');
    const addRuleBtn = document.getElementById('add-fix-rule');
    const rulesList = document.getElementById('fixed-rules-list');

    let fixedRules = []; // Array of { student: 5, seat: 3 }

    // --- Exceptions Logic ---
    addRuleBtn.addEventListener('click', () => {
        const student = parseInt(fixStudentInput.value);
        const seat = parseInt(fixSeatInput.value);

        if (!student || !seat) return alert('학생 번호와 자리 번호를 모두 입력해주세요.');

        // Validation
        if (fixedRules.some(r => r.student === student)) return alert('이미 규칙이 지정된 학생입니다.');
        if (fixedRules.some(r => r.seat === seat)) return alert('이미 고정된 자리입니다.');

        // Add
        fixedRules.push({ student, seat });
        renderRules();
        fixStudentInput.value = '';
        fixSeatInput.value = '';
        fixStudentInput.focus();
    });

    function renderRules() {
        rulesList.innerHTML = '';
        fixedRules.forEach((rule, idx) => {
            const tag = document.createElement('div');
            tag.className = 'rule-tag';
            tag.innerHTML = `
                <span>${rule.student}번 → ${rule.seat}번</span>
                <button data-idx="${idx}">×</button>
            `;
            // Remove
            tag.querySelector('button').addEventListener('click', () => {
                fixedRules.splice(idx, 1);
                renderRules();
            });
            rulesList.appendChild(tag);
        });
    }

    // --- Generation Logic ---
    generateBtn.addEventListener('click', () => {
        const total = parseInt(totalInput.value);
        const cols = parseInt(colsInput.value) || 5;

        if (!total || total < 1) {
            alert('학생 수를 입력해주세요!');
            return;
        }

        // Validate Inputs
        for (let r of fixedRules) {
            if (r.student > total || r.seat > total) {
                alert(`고정 규칙 오류: 학생 번호나 자리가 전체 인원(${total}명)을 초과합니다.`);
                return;
            }
        }

        // 1. Prepare Pools
        let availableStudents = [];
        let availableSeats = []; // 1-based indices (but stored as number)

        for (let i = 1; i <= total; i++) {
            // If student i is NOT in fixed rules, add to available
            if (!fixedRules.some(r => r.student === i)) {
                availableStudents.push(i);
            }
            // If seat i is NOT in fixed rules, add to available
            if (!fixedRules.some(r => r.seat === i)) {
                availableSeats.push(i);
            }
        }

        // Check Logic Integrity (Should actulaly be impossible to fail if inputs are valid, but good to be safe)
        if (availableStudents.length !== availableSeats.length) {
            console.error("Mismatch in sorting logic", availableStudents, availableSeats);
            return;
        }

        // 2. Shuffle Available Students
        availableStudents.sort(() => Math.random() - 0.5);

        // 3. Create Final Map: Seat Number -> Student Number
        const finalMap = new Array(total + 1).fill(0); // Index 0 unused

        // Place Fixed rules
        fixedRules.forEach(r => {
            finalMap[r.seat] = r.student;
        });

        // Place Randoms (Fill remaining seats sequentially with shuffled students)
        availableSeats.forEach((seatNum, idx) => {
            finalMap[seatNum] = availableStudents[idx];
        });

        // 4. Render
        grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        grid.innerHTML = '';

        for (let i = 1; i <= total; i++) {
            const studentNum = finalMap[i];
            const isFixed = fixedRules.some(r => r.seat === i);

            const seat = document.createElement('div');
            seat.className = `seat ${isFixed ? 'fixed-seat' : ''}`;

            // Seat Label
            const seatLabel = document.createElement('div');
            seatLabel.style.fontSize = '0.9rem';
            seatLabel.style.color = '#888';
            seatLabel.style.marginBottom = '5px';
            seatLabel.textContent = `자리 ${i}`;

            // Student Label (Reveal Effect)
            const studentLabel = document.createElement('div');
            studentLabel.style.fontSize = '2rem';
            studentLabel.style.fontWeight = 'bold';
            studentLabel.style.color = isFixed ? '#E07A5F' : '#333';
            studentLabel.textContent = `${studentNum}`;

            // Animation staggering
            seat.style.animationDelay = `${(i - 1) * 0.05}s`;

            seat.appendChild(seatLabel);
            seat.appendChild(studentLabel);
            grid.appendChild(seat);
        }
    });
}
