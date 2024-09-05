const boardSize = 4;
let board = [];
let score = 0;
let touchStartX, touchStartY, touchEndX, touchEndY;

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Initialize the game board
function initBoard() {
    for (let i = 0; i < boardSize; i++) {
        board[i] = [];
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = 0;
        }
    }
    addNewTile();
    addNewTile();
    drawBoard();
}

// Draw the game board on the screen
function drawBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
                cell.style.backgroundColor = getTileColor(board[i][j]);
            } else {
                cell.textContent = '';
                cell.style.backgroundColor = '#cdc1b4';
            }
            gameBoard.appendChild(cell);
        }
    }
    scoreDisplay.textContent = score;
}

// Add a new tile (either 2 or 4) to the board
function addNewTile() {
    let emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ x: i, y: j });
            }
        }
    }

    if (emptyCells.length === 0) return;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
}

// Handle keyboard input for moving tiles
document.addEventListener('keydown', handleInput);

function handleInput(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
    drawBoard();
}

// Move functions (combine tiles and shift them)
function moveLeft() {
    for (let i = 0; i < boardSize; i++) {
        let row = board[i];
        row = compress(row);
        row = merge(row);
        row = compress(row);
        board[i] = row;
    }
    addNewTile();
}

function moveRight() {
    for (let i = 0; i < boardSize; i++) {
        let row = board[i].slice().reverse();
        row = compress(row);
        row = merge(row);
        row = compress(row);
        board[i] = row.reverse();
    }
    addNewTile();
}

function moveUp() {
    for (let j = 0; j < boardSize; j++) {
        let column = [];
        for (let i = 0; i < boardSize; i++) {
            column.push(board[i][j]);
        }
        column = compress(column);
        column = merge(column);
        column = compress(column);
        for (let i = 0; i < boardSize; i++) {
            board[i][j] = column[i];
        }
    }
    addNewTile();
}

function moveDown() {
    for (let j = 0; j < boardSize; j++) {
        let column = [];
        for (let i = 0; i < boardSize; i++) {
            column.push(board[i][j]);
        }
        column = column.reverse();
        column = compress(column);
        column = merge(column);
        column = compress(column);
        column = column.reverse();
        for (let i = 0; i < boardSize; i++) {
            board[i][j] = column[i];
        }
    }
    addNewTile();
}

// Touch event listeners for mobile devices
gameBoard.addEventListener('touchstart', (e) => {
    e.preventDefault();  // Prevent default touch behavior
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

gameBoard.addEventListener('touchend', (e) => {
    e.preventDefault();  // Prevent default touch behavior
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
});

function handleGesture() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            moveRight();
        } else {
            moveLeft();
        }
    } else {
        if (deltaY > 0) {
            moveDown();
        } else {
            moveUp();
        }
    }
    drawBoard();
}

// Compress the row/column by shifting numbers to the left
function compress(row) {
    let newRow = row.filter(val => val !== 0);
    while (newRow.length < boardSize) {
        newRow.push(0);
    }
    return newRow;
}

// Merge adjacent equal numbers
function merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    return row;
}

// Return the color of the tile based on its value
function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

// Start the game
initBoard();
