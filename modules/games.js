export default function initGames() {
    const gamesMenu = document.getElementById('games-menu');
    const gameStage = document.getElementById('game-stage');
    const backBtn = document.getElementById('back-to-games');
    const container = document.getElementById('game-container');

    // Game List
    const games = [
        { id: 'memory', name: '🧠 카드 짝맞추기', desc: '같은 그림을 찾아보세요!' },
        { id: 'tictactoe', name: '❌⭕ 틱택토', desc: '친구와 함께하는 틱택토!' },
        { id: 'baseball', name: '⚾ 숫자야구', desc: '숨겨진 3자리 숫자를 맞춰보세요!' },
        { id: 'updown', name: '⬆️⬇️ 업앤다운', desc: '숫자가 위일까요 아래일까요?' }
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
        if (gameId === 'baseball') startNumberBaseball(container);
        if (gameId === 'updown') startUpDown(container);
    }

    // --- Memory Game Logic ---
    function startMemoryGame(target) {
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

        target.innerHTML = `
            <div class="memory-grid" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:10px; max-width:400px; margin:0 auto;">
                ${deck.map((emoji, index) => `
                    <div class="memory-card" data-val="${emoji}" id="card-${index}"
                         style="background:#f0f0f0; border: 1px solid #ddd; height:80px; display:flex;
                                align-items:center; justify-content:center; font-size:2rem;
                                cursor:pointer; border-radius:10px; color:#333;">
                        <span class="content" style="opacity:0; transition:opacity 0.2s;">?</span>
                    </div>
                `).join('')}
            </div>
            <p id="msg" style="text-align:center; margin-top:20px; color:var(--text-primary); font-weight:bold;"></p>
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
                this.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';

                flipped.push(this);

                if (flipped.length === 2) {
                    const [c1, c2] = flipped;
                    if (c1.dataset.val === c2.dataset.val) {
                        c1.classList.add('matched');
                        c2.classList.add('matched');
                        c1.style.background = '#d4edda'; // Light green
                        c2.style.background = '#d4edda';
                        c1.style.borderColor = '#c3e6cb';
                        c2.style.borderColor = '#c3e6cb';
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
                            c1.style.background = '#f0f0f0';
                            c2.style.background = '#f0f0f0';
                            c1.style.boxShadow = 'none';
                            c2.style.boxShadow = 'none';
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
                         style="background:#f0f0f0; border: 1px solid #ddd; height:100px; display:flex;
                                align-items:center; justify-content:center; font-size:3rem;
                                cursor:pointer; border-radius:10px; color:#333;">
                    </div>
                `).join('')}
            </div>
            <p id="ttt-msg" style="text-align:center; margin-top:20px; font-size:1.5rem; color:var(--text-primary);">${turn} 차례입니다</p>
            <button id="ttt-reset" class="secondary-btn" style="display:block; margin:20px auto;">다시하기</button>
        `;

        const updateMsg = (msg) => document.getElementById('ttt-msg').textContent = msg;

        target.querySelectorAll('.ttt-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const idx = cell.dataset.idx;
                if (!active || board[idx]) return;

                board[idx] = turn;
                cell.textContent = turn;
                cell.style.color = turn === 'O' ? '#00b894' : '#ff7675'; // Green / Red (Soft)

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

    // --- Number Baseball Logic ---
    function startNumberBaseball(target) {
        // Generate random 3 digits (unique)
        let numbers = [];
        while (numbers.length < 3) {
            let n = Math.floor(Math.random() * 9) + 1; // 1-9 for first digit
            // actually standard baseball usually allows 0, but simplicity 1-9 is fine or 0-9
            if (numbers.length === 0) n = Math.floor(Math.random() * 9) + 1; // 1-9 first
            else n = Math.floor(Math.random() * 10); // 0-9 others

            if (!numbers.includes(n)) numbers.push(n);
        }

        const answer = numbers.join('');
        let attempts = 0;

        target.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="margin-bottom:15px; font-size:1.1rem; color:var(--text-primary);">3자리 숫자를 맞춰보세요! (서로 다른 숫자)</p>
                <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
                    <input type="text" id="bb-input" maxlength="3" 
                           style="background:white; border:1px solid #ddd; 
                                  color:#333; font-size:1.5rem; width:100px; text-align:center; padding:10px; border-radius:10px;"
                           placeholder="123">
                    <button id="bb-submit" class="primary-btn">확인</button>
                </div>
                <div id="bb-logs" style="max-height:200px; overflow-y:auto; 
                                         background:#f9f9f9; padding:10px; border-radius:10px; text-align:left; border:1px solid #eee;">
                    <div style="color:#aaa; text-align:center;">기록이 여기에 표시됩니다.</div>
                </div>
                <button id="bb-reset" class="secondary-btn" style="margin-top:20px;">새 게임</button>
            </div>
        `;

        const input = document.getElementById('bb-input');
        const logs = document.getElementById('bb-logs');

        // Clear logs helper
        const addLog = (guess, s, b) => {
            if (attempts === 1) logs.innerHTML = '';
            const p = document.createElement('p');
            p.style.margin = '5px 0';
            p.style.borderBottom = '1px solid #eee';
            p.style.paddingBottom = '5px';
            p.innerHTML = `<span style="color:#E07A5F; font-weight:bold;">${guess}</span> : ${s}S ${b}B`;
            logs.prepend(p);
        }

        document.getElementById('bb-submit').addEventListener('click', check);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });

        document.getElementById('bb-reset').addEventListener('click', () => startNumberBaseball(target));

        function check() {
            const val = input.value;
            if (val.length !== 3 || isNaN(val) || new Set(val).size !== 3) {
                alert('서로 다른 3자리 숫자를 입력해주세요!');
                return;
            }

            attempts++;
            let s = 0, b = 0;
            const targetArr = answer.split('');
            const guessArr = val.split('');

            for (let i = 0; i < 3; i++) {
                if (guessArr[i] === targetArr[i]) s++;
                else if (targetArr.includes(guessArr[i])) b++;
            }

            addLog(val, s, b);
            input.value = '';
            input.focus();

            if (s === 3) {
                logs.innerHTML = `<p style="color:#00b894; text-align:center; padding:20px; font-size:1.2rem;">🎉 정답입니다! (${attempts}번 시도)</p>` + logs.innerHTML;
                document.getElementById('bb-submit').disabled = true;
            }
        }
    }

    // --- Up & Down Logic ---
    function startUpDown(target) {
        const secret = Math.floor(Math.random() * 100) + 1;
        let attempts = 0;

        target.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="margin-bottom:15px; font-size:1.1rem; color:var(--text-primary);">1부터 100 사이의 숫자를 맞춰보세요!</p>
                <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
                    <input type="number" id="ud-input" min="1" max="100"
                           style="background:white; border:1px solid #ddd; 
                                  color:#333; font-size:1.5rem; width:100px; text-align:center; padding:10px; border-radius:10px;"
                           placeholder="50">
                    <button id="ud-submit" class="primary-btn">확인</button>
                </div>
                <p id="ud-result" style="font-size:2rem; font-weight:bold; height:50px;"></p>
                <button id="ud-reset" class="secondary-btn" style="margin-top:20px;">새 게임</button>
            </div>
        `;

        const input = document.getElementById('ud-input');
        const result = document.getElementById('ud-result');

        document.getElementById('ud-submit').addEventListener('click', check);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') check(); });
        document.getElementById('ud-reset').addEventListener('click', () => startUpDown(target));

        function check() {
            const val = parseInt(input.value);
            if (!val) return;

            attempts++;

            if (val === secret) {
                result.textContent = "🎉 정답!!";
                result.style.color = "#00b894";
            } else if (val < secret) {
                result.textContent = "👆 UP!";
                result.style.color = "#E07A5F";
            } else {
                result.textContent = "👇 DOWN!";
                result.style.color = "#0984e3";
            }

            input.value = '';
            input.focus();
        }
    }
}
