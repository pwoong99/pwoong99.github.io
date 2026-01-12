export default function initGuestbook() {
    const input = document.getElementById('guest-msg');
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
        if (!text) return alert('내용을 입력해주세요!');

        const note = {
            id: Date.now(),
            text: text,
            color: selectedColor,
            left: Math.random() * 80 + 10, // Not used in flex layout but good for absolute
            rotate: Math.random() * 10 - 5 // -5deg to +5deg
        };

        saveNote(note);
        appendNote(note);
        input.value = '';
    });

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
        div.innerHTML = `
            <p>${note.text}</p>
            <button class="delete-note" title="삭제">&times;</button>
        `;

        // Delete Functionality
        div.querySelector('.delete-note').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag or other events if added later
            if (confirm('이 메모를 떼어낼까요?')) {
                deleteNote(note.id);
                div.remove();
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
