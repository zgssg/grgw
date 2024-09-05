document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board');
    const resetButton = document.getElementById('resetButton');
    const messageElement = document.getElementById('message');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameOver = false;

    function createBoard() {
        boardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            boardElement.appendChild(cellElement);
        });
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal from top-left to bottom-right
            [2, 4, 6]  // Diagonal from top-right to bottom-left
        ];

        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.includes('') ? null : 'Draw';
    }

    function handleClick(event) {
        if (isGameOver) return;

        const index = event.target.dataset.index;
        if (board[index]) return;

        board[index] = currentPlayer;
        createBoard();

        const winner = checkWinner();
        if (winner) {
            isGameOver = true;
            if (winner === 'Draw') {
                messageElement.textContent = '平局！';
            } else {
                messageElement.textContent = `${winner} 胜利！`;
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isGameOver = false;
        messageElement.textContent = '';
        createBoard();
    }

    boardElement.addEventListener('click', handleClick);
    resetButton.addEventListener('click', resetGame);

    createBoard();
});
