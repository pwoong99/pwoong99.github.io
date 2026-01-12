export default function initTimetable() {
    const tbody = document.getElementById('timetable-body');
    const palette = document.getElementById('subject-palette');
    const periods = 6; // Changed from 7 to 6
    const subjects = ['국어', '사회', '도덕', '수학', '과학', '영어', '체육', '음악', '미술', '실과', '보건', '영양', '창체'];

    // --- Render Palette ---
    subjects.forEach(sub => {
        const el = document.createElement('div');
        el.className = 'subject-item';
        el.draggable = true;
        el.textContent = sub;

        // Drag Event
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', sub);
            e.dataTransfer.effectAllowed = 'copy';
        });

        palette.appendChild(el);
    });

    // --- Render Grid ---
    // Check local storage
    const savedData = JSON.parse(localStorage.getItem('timetable_data')) || {};

    tbody.innerHTML = ''; // Clear existing
    for (let i = 1; i <= periods; i++) {
        const tr = document.createElement('tr');

        // Period Number
        const th = document.createElement('th');
        th.textContent = `${i}교시`;
        tr.appendChild(th);

        // Days (Mon-Fri)
        for (let j = 0; j < 5; j++) {
            const td = document.createElement('td');
            td.dataset.row = i;
            td.dataset.col = j;

            // Drop Handlers
            td.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allow dropping
                td.classList.add('drag-over');
            });

            td.addEventListener('dragleave', () => {
                td.classList.remove('drag-over');
            });

            td.addEventListener('drop', (e) => {
                e.preventDefault();
                td.classList.remove('drag-over');
                const subject = e.dataTransfer.getData('text/plain');
                if (subject) {
                    setCellContent(td, subject);
                    saveData();
                }
            });

            // Double click to delete
            td.addEventListener('dblclick', () => {
                td.innerHTML = '';
                saveData();
            });

            // Restore saved value
            const key = `${i}-${j}`;
            if (savedData[key]) {
                setCellContent(td, savedData[key]);
            }

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    function setCellContent(cell, text) {
        cell.innerHTML = `<div class="placed-subject">${text}</div>`;
    }

    function saveData() {
        const data = {};
        tbody.querySelectorAll('td').forEach(td => {
            const row = td.dataset.row;
            const col = td.dataset.col;
            // .placed-subject contains the text
            if (td.textContent) {
                data[`${row}-${col}`] = td.textContent;
            }
        });
        localStorage.setItem('timetable_data', JSON.stringify(data));
    }

    // Add Clear Button Logic
    const container = document.querySelector('.timetable-editor');
    // Check if controls already exist to avoid dupes (if init called multiple times)
    if (!document.getElementById('timetable-controls')) {
        const controls = document.createElement('div');
        controls.id = 'timetable-controls';
        controls.style.marginTop = '20px';
        controls.innerHTML = `
            <button id="clear-timetable" class="secondary-btn">초기화</button>
            <span style="margin-left:10px; font-size:0.9rem; color:#ccc;">* 과목을 드래그해서 넣으세요. (삭제: 더블클릭)</span>
        `;
        container.appendChild(controls);

        document.getElementById('clear-timetable').addEventListener('click', () => {
            if (confirm('정말 시간표를 모두 지우시겠습니까?')) {
                localStorage.removeItem('timetable_data');
                // Clear cells
                tbody.querySelectorAll('td').forEach(td => td.innerHTML = '');
            }
        });
    }
}
