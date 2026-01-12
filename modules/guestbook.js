export default function initGuestbook() {
    const input = document.getElementById('guest-msg');
    const nameInput = document.getElementById('guest-name');
    const pwInput = document.getElementById('guest-pw');
    const postBtn = document.getElementById('post-note-btn');
    const wall = document.getElementById('guestbook-wall');
    const colorBtns = document.querySelectorAll('.color-btn');

    let selectedColor = '#fffcd0'; // Default yellow

    // Color Selection
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedColor = btn.dataset.color;
            input.style.backgroundColor = selectedColor; // Visual Cue
            input.focus();
        });
    });

    // Load Notes
    loadNotes();

    // Post Note
    postBtn.addEventListener('click', () => {
        const text = input.value.trim();
        const author = nameInput.value.trim() || '익명';
        const password = pwInput.value.trim();

        if (!text) return alert('내용을 입력해주세요!');
        if (!password) return alert('삭제할 때 사용할 비밀번호를 입력해주세요!');

        const now = new Date();
        const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const note = {
            id: Date.now(),
            text: text,
            author: author,
            password: password,
            color: selectedColor,
            date: dateStr,
            rotate: Math.random() * 10 - 5 // -5deg to +5deg
        };

        saveNote(note);
        appendNote(note);
        input.value = '';
        nameInput.value = '';
        pwInput.value = '';
    });

    // Clear All Logic
    const resetBtn = document.getElementById('reset-guestbook-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('정말로 방명록을 초기화하시겠습니까? 모든 메모가 삭제됩니다.')) {
                localStorage.removeItem('class_guestbook');
                loadNotes();
                alert('방명록이 초기화되었습니다.');
            }
        });
    }

    function saveNote(note) {
        let notes = JSON.parse(localStorage.getItem('class_guestbook')) || [];
        notes.push(note);
        localStorage.setItem('class_guestbook', JSON.stringify(notes));
    }

    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('class_guestbook')) || [];
        wall.innerHTML = '';
        notes.forEach(n => appendNote(n));
    }

    function appendNote(note) {
        const div = document.createElement('div');
        div.className = 'sticky-note';
        div.style.backgroundColor = note.color;
        div.style.transform = `rotate(${note.rotate}deg)`;

        // Handle legacy notes without date
        const dateDisplay = note.date ? `<div class="note-date">${note.date}</div>` : '';

        div.innerHTML = `
            <div class="note-content">${note.text}</div>
            <div class="note-meta">
                <div class="note-author">From ${note.author}</div>
                ${dateDisplay}
            </div>
            <button class="delete-note" title="삭제">&times;</button>
        `;

        // Delete Functionality
        div.querySelector('.delete-note').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag or other events if added later

            const inputPw = prompt('글을 삭제하려면 비밀번호를 입력하세요:');
            if (inputPw === null) return; // Cancelled

            // Check password (simple comparison)
            if (inputPw === note.password) {
                deleteNote(note.id);
                div.remove();
                alert('삭제되었습니다.');
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        });

        wall.prepend(div); // Newest first
    }

    function deleteNote(id) {
        let notes = JSON.parse(localStorage.getItem('class_guestbook')) || [];
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem('class_guestbook', JSON.stringify(notes));
    }
}
