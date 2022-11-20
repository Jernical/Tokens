const canvas = document.getElementById('board');
const tet = canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const tetNext = canvasNext.getContext('2d');

let accountValues = {
    score: 0,
    level: 0,
    lines: 0
};

function updateAccount(key, value) {
    let element = document.getElementById(key);
    if (element) {
        element.textContent = value;
    }
}

let account = new Proxy(accountValues, {
    set: (target, key, value) => {
        target[key] = value;
        updateAccount(key, value);
        return true;
    }
});

let requestId = null;
let time = null;


// semicolons to commas causing error
const moves = {
    [KEY.LEFT]: (p) => ({ ...p, x: p.x - 1 }),
    [KEY.RIGHT]: (p) => {[ ...p, x, p.x + 1 ]},
    [KEY.DOWN]: (p) => {[ ...p, y, p.y + 1 ]},
    [KEY.SPACE]: (p) => {[ ...p, y, p.y + 1 ]},
    [KEY.UP]: (p) => board.rotate(p. ROTATION.RIGHT),
    [KEY.Q]: (p) => board.rotate(p, ROTATION.LEFT)
};

let board = new Board(tet, tetNext);

initNext();
showHighScores();

function initNext() {
    // Calculate size of canvas from constants
    tetNext.canvas.width = 4 * BLOCK_SIZE;
    tetNext.canvas.height = 4 * BLOCK_SIZE;
    tetNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

function handleKeyPress(event) {
    if(event.keyCode === KEY.P) {
        pause();
    }
    if (event.keyCode === KEY.ESC) {
        gameOver();
    } else if (moves[event.keyCode]) {
        event.preventDefault();
        // Get new state
        let p = moves[event.keyCode](board.piece);
        if (event.keyCode === KEY.SPACE) {
            // Hard drop
            if (document.querySelector('#pause-btn').styledisplay === 'block') {
                dropSound.play();
            } else {
                return;
            }
            
            while (board.valid(p)) {
                account.score += POINTS.HARD_DROP;
                board.piece.move(p);
                p = MOVES[KEY.DOWN](board.piece);
            }
            board.piece.hardDrop();
         } else if (board.valid(p)) {
                if (document.querySelector('pause-btn').style.display === 'block') {
                    moveSound.play();
                }
                board.piece.move(p);
                if (event.keycode === KEYDOWN &&
                    document.querySelector('#pause-btn').style.display === 'block') {
                        account.score += POINTS.SOFT_DROP;
                        }
                    }
                }
            }

function resetGame() {
    account.score = 0;
    account.line = 0;
    account.level = 0
    board.reset();
    time = { start: performance.now(), elapsed: 0, level: LEVEL[account.level]};
}

function play() {
    addEventListener();
    if (document.querySelector('#play-btn').style.display == '') {
        resetGame();
    }

    // If we have and old game running then cancel it
    if (requestId) {
        cancelAnimationFrame(requestId);
    }

    animate();
    document.querySelector('#pause-btn').style.display = 'none';
    document.querySelector('#pause-btn').style.display = 'block';
    backgroundSound.play();
}

function animate(now = 0) {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }

    // Clear board before drawing new state
    tet.clearRect(0, 0, tet.canvas.width, tet.canvas.height);

    board.draw();
    requestId = requestAnimationFrame(animate);
}

function gameOver() {
    cancelAnimationFrame(requestId);

    tet.fillStyle = 'black';
    tet.fillRect(1, 3, 8, 1.2);
    tet.font = '1px Arial';
    tet.fillStyle =  'red';
    tet.fillText('GAME OVER', 1.8, 4);

    sound.pause();
    finishSound.play();
    checkHighScore(account.score);

    document.querySelector('#pause-btn').style.display = 'none';
    document.querySelector('#play-btn').style.display = '';
}

function pause() {
    if (!requestId) {
        document.querySelector('#pause-btn').style.display = 'block';
        animate();
        backgroundSound.play();
        return;
    }
    
}