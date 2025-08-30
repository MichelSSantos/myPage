const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        livesDisplay: document.querySelector("#lives"),
        gameOverScreen: document.querySelector(".game-over"),
        finalScoreText: document.querySelector(".final-score-text"),
        highScoreText: document.querySelector(".high-score-text"),
        restartButton: document.querySelector(".restart-button"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        lives: 3,
        currentTime: 60,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

function playSound(audioName) {
    let audio = new Audio(`./assets/audios/${audioName}`);
    audio.volume = 0.1;
    audio.play();
}

function randomSquare() {
    // Remove a classe "enemy" de todos os quadrados
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });
    
    // Escolhe um novo quadrado aleatório para ser o "enemy"
    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
    
    // Se o Ralph não for atingido, perde vida
    setTimeout(() => {
        if (state.values.hitPosition === randomSquare.id) {
            loseLife();
        }
    }, state.values.gameVelocity);
}

function loseLife() {
    state.values.lives--;
    state.view.livesDisplay.textContent = `${state.values.lives}x`;
    
    if (state.values.lives <= 0) {
        gameOver();
    }
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;
    
    if (state.values.currentTime <= 0) {
        gameOver();
    }
}

function gameOver() {
    // Para todos os temporizadores
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);
    
    // Exibe a tela de Fim de Jogo
    state.view.gameOverScreen.classList.remove("hidden");
    state.view.finalScoreText.textContent = `Sua pontuação final foi: ${state.values.result}`;
    
    // Atualiza o ranking
    updateHighScore(state.values.result);
}

function updateHighScore(newScore) {
    let currentHighScore = localStorage.getItem("highScore") || 0;
    
    if (newScore > currentHighScore) {
        currentHighScore = newScore;
        localStorage.setItem("highScore", newScore);
        state.view.highScoreText.textContent = `NOVO RECORDE: ${currentHighScore} pontos!`;
    } else {
        state.view.highScoreText.textContent = `Recorde: ${currentHighScore} pontos`;
    }
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit.m4a");
                square.classList.remove("enemy"); // Remove imediatamente para evitar o "hit" duplo
            }
        });
    });
}

function resetGame() {
    // Reseta todos os valores
    state.values.result = 0;
    state.values.lives = 3;
    state.values.currentTime = 60;
    state.values.hitPosition = 0;
    
    // Atualiza o display
    state.view.score.textContent = state.values.result;
    state.view.livesDisplay.textContent = `${state.values.lives}x`;
    state.view.timeLeft.textContent = state.values.currentTime;
    
    // Esconde a tela de game over
    state.view.gameOverScreen.classList.add("hidden");
    
    // Inicia o jogo novamente
    initialize();
}

function initialize() {
    // Para garantir que os temporizadores não se acumulem em reinícios
    clearInterval(state.actions.timerId);
    clearInterval(state.actions.countDownTimerId);
    
    addListenerHitBox();
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    state.view.restartButton.addEventListener("click", resetGame);
}

initialize();