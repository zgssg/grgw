// script.js
let randomNumber;
let attempts = 0;

function startGame() {
    randomNumber = Math.floor(Math.random() * 1000) + 1;
    attempts = 0;
    document.getElementById('feedback-message').innerText = '';
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').focus();
    document.getElementById('status').innerText = '尝试次数：0';
}

document.getElementById('submit-guess').addEventListener('click', function() {
    let userGuess = parseInt(document.getElementById('guess-input').value);
    
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 1000) {
        document.getElementById('feedback-message').innerText = '请输入一个1到1000之间的数字。';
        return;
    }

    attempts++;
    document.getElementById('status').innerText = `尝试次数：${attempts}`;

    if (userGuess === randomNumber) {
        document.getElementById('feedback-message').innerText = `恭喜你！你猜对了，数字是 ${randomNumber}。尝试了 ${attempts} 次。`;
        document.getElementById('feedback-message').style.color = '#28a745';
    } else if (userGuess < randomNumber) {
        document.getElementById('feedback-message').innerText = '猜得太低了！再试试。';
        document.getElementById('feedback-message').style.color = '#dc3545';
    } else {
        document.getElementById('feedback-message').innerText = '猜得太高了！再试试。';
        document.getElementById('feedback-message').style.color = '#dc3545';
    }
});

document.getElementById('restart-game').addEventListener('click', startGame);

// 初始化游戏
window.onload = startGame;
