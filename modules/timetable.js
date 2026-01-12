export default function initTimetable() {
    const tbody = document.getElementById('timetable-body');
    const periods = 7; // 7 periods per day

    // Check local storage
    const savedData = JSON.parse(localStorage.getItem('timetable_data')) || {};

    // Render Grid
    for (let i = 1; i <= periods; i++) {
        const tr = document.createElement('tr');

        // Period Number
        const th = document.createElement('th');
        th.textContent = `${i}교시`;
        tr.appendChild(th);

        // Days (Mon-Fri)
        for (let j = 0; j < 5; j++) {
            const td = document.createElement('td');
            td.contentEditable = true;
            td.dataset.row = i;
            td.dataset.col = j;

            // Restore saved value
            const key = `${i}-${j}`;
            if (savedData[key]) {
                td.textContent = savedData[key];
            }

            // Save on blur
            td.addEventListener('blur', () => {
                const val = td.textContent.trim();
                savedData[`${i}-${j}`] = val;
                localStorage.setItem('timetable_data', JSON.stringify(savedData));
            });

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    // Add Save Button explicitly (optional since we save on blur, but good for UX)
    const container = document.querySelector('.timetable-editor');
    const controls = document.createElement('div');
    controls.style.marginTop = '20px';
    controls.innerHTML = `
        <button id="clear-timetable" class="secondary-btn">초기화</button>
        <span style="margin-left:10px; font-size:0.9rem; color:#ccc;">* 내용은 자동으로 저장됩니다.</span>
    `;
    container.appendChild(controls);

    document.getElementById('clear-timetable').addEventListener('click', () => {
        if (confirm('정말 시간표를 모두 지우시겠습니까?')) {
            localStorage.removeItem('timetable_data');
            // Clear cells
            tbody.querySelectorAll('td').forEach(td => td.textContent = '');
        }
    });
}
