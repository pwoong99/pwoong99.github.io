export default function initGames() {
    const gamesMenu = document.getElementById('games-menu');
    const gameStage = document.getElementById('game-stage');
    const backBtn = document.getElementById('back-to-games');
    const container = document.getElementById('game-container');

    // Game List
    const games = [
        { id: 'memory', name: '🧠 카드 짝맞추기', desc: '같은 그림을 찾아보세요!' },
        { id: 'tictactoe', name: '❌⭕ 틱택토', desc: '친구와 함께하는 틱택토!' }
    ];

    // Render Menu
    games.forEach(game => {
        const div = document.createElement('div');
        div.className = 'card game-card';
        div.style.cursor = 'pointer';
        div.innerHTML = `<h3>${game.name}</h3><p>${game.desc}</p>`;
        div.addEventListener('click', () => loadGame(game.id));
        gamesMenu.appendChild(div);
    });

    backBtn.addEventListener('click', () => {
        gameStage.classList.add('hidden');
        gamesMenu.classList.remove('hidden');
        container.innerHTML = '';
    });

    function loadGame(gameId) {
        gamesMenu.classList.add('hidden');
        gameStage.classList.remove('hidden');

        if (gameId === 'memory') startMemoryGame(container);
        if (gameId === 'tictactoe') startTicTacToe(container);
    }

    // --- Memory Game Logic ---
    function startMemoryGame(target) {
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

        target.innerHTML = `
            <div class="memory-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-width:400px; margin:0 auto;">
                ${deck.map((emoji, index) => `
                    <div class="memory-card" data-val="${emoji}" id="card-${index}" 
                         style="background:rgba(255,255,255,0.2); height:80px; display:flex; 
                                align-items:center; justify-content:center; font-size:2rem; 
                                cursor:pointer; border-radius:10px;">
                        <span class="content" style="opacity:0">?</span>
                    </div>
                `).join('')}
            </div>
            <p id="msg" style="text-align:center; margin-top:20px;"></p>
        `;

        let flipped = [];
        let matched = 0;

        target.querySelectorAll('.memory-card').forEach(card => {
            card.addEventListener('click', function () {
                // Ignore if clicked or already matched
                if (this.classList.contains('flipped') || this.classList.contains('matched') || flipped.length >= 2) return;

                // Reveal
                this.classList.add('flipped');
                this.querySelector('.content').textContent = this.dataset.val;
                this.querySelector('.content').style.opacity = '1';
                this.style.background = '#fff';

                flipped.push(this);

                if (flipped.length === 2) {
                    const [c1, c2] = flipped;
                    if (c1.dataset.val === c2.dataset.val) {
                        c1.classList.add('matched');
                        c2.classList.add('matched');
                        c1.style.background = '#4CAF50';
                        c2.style.background = '#4CAF50';
                        flipped = [];
                        matched++;
                        if (matched === emojis.length) {
                            document.getElementById('msg').textContent = "🎉 성공! 모든 카드를 찾았어요!";
                        }
                    } else {
                        setTimeout(() => {
                            c1.classList.remove('flipped');
                            c2.classList.remove('flipped');
                            c1.querySelector('.content').textContent = '?';
                            c2.querySelector('.content').textContent = '?';
                            c1.querySelector('.content').style.opacity = '0';
                            c1.style.background = 'rgba(255,255,255,0.2)';
                            c2.style.background = 'rgba(255,255,255,0.2)';
                            c1.querySelector('.content').style.opacity = '0';
                            flipped = [];
                        }, 1000);
                    }
                }
            });
        });
    }

    // --- Tic Tac Toe Logic ---
    function startTicTacToe(target) {
        let turn = 'O';
        let board = Array(9).fill(null);
        let active = true;

        target.innerHTML = `
            <div class="ttt-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; max-width:300px; margin:0 auto;">
                ${board.map((_, i) => `
                    <div class="ttt-cell" data-idx="${i}" 
                         style="background:rgba(255,255,255,0.2); height:100px; display:flex; 
                                align-items:center; justify-content:center; font-size:3rem; 
                                cursor:pointer; border-radius:10px;">
                    </div>
                `).join('')}
            </div>
            <p id="ttt-msg" style="text-align:center; margin-top:20px; font-size:1.5rem;">${turn} 차례입니다</p>
            <button id="ttt-reset" class="secondary-btn" style="display:block; margin:20px auto;">다시하기</button>
        `;

        const updateMsg = (msg) => document.getElementById('ttt-msg').textContent = msg;

        target.querySelectorAll('.ttt-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const idx = cell.dataset.idx;
                if (!active || board[idx]) return;

                board[idx] = turn;
                cell.textContent = turn;
                cell.style.color = turn === 'O' ? '#00ffcc' : '#ff0080';

                if (checkWin()) {
                    updateMsg(`🎉 ${turn} 승리!`);
                    active = false;
                    return;
                }

                if (!board.includes(null)) {
                    updateMsg('무승부!');
                    active = false;
                    return;
                }

                turn = turn === 'O' ? 'X' : 'O';
                updateMsg(`${turn} 차례입니다`);
            });
        });

        document.getElementById('ttt-reset').addEventListener('click', () => startTicTacToe(target));

        function checkWin() {
            const wins = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            return wins.some(w => {
                const [a, b, c] = w;
                return board[a] && board[a] === board[b] && board[a] === board[c];
            });
        }
    }
}
