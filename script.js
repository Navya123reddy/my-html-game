const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasWidth = 400;
const canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Load Sound Effects
const bgMusic = new Audio("background.mp3"); // Background music
const eatSound = new Audio("eat.mp3"); // Eating sound
const moveSound = new Audio("move.mp3"); // Movement sound
const gameOverSound = new Audio("gameover.mp3"); // Game over sound

bgMusic.loop = true; // Loop background music
bgMusic.volume = 0.3; // Adjust volume

let snake = [{ x: 160, y: 200 }];
let food = {};
let direction = "RIGHT";
let score = 0;
let gameInterval;
let gamePaused = false;
let firstMove = true; // To play background music only once

function randomFoodPosition() {
    const x = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;
    return { x, y };
}

function drawSnake() {
    ctx.fillStyle = "green";
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.arc(segment.x + gridSize / 2, segment.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // Add eyes to the snake head
        if (index === 0) {
            ctx.fillStyle = "white";
            const eyeOffsetX = direction === "LEFT" ? -4 : direction === "RIGHT" ? 4 : 0;
            const eyeOffsetY = direction === "UP" ? -4 : direction === "DOWN" ? 4 : 0;
            ctx.beginPath();
            ctx.arc(segment.x + gridSize / 2 - 5 + eyeOffsetX, segment.y + gridSize / 2 - 5 + eyeOffsetY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(segment.x + gridSize / 2 + 5 + eyeOffsetX, segment.y + gridSize / 2 - 5 + eyeOffsetY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 4, 0, Math.PI * 2);
    ctx.fill();
}

function updateScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}

function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = randomFoodPosition();
        score++;
        updateScore();
        eatSound.play(); // Play eating sound
    } else {
        snake.pop();
    }

    // Play movement sound on every move
    moveSound.play();
}

function checkCollision() {
    const head = snake[0];

    if (
        head.x < 0 ||
        head.x >= canvasWidth ||
        head.y < 0 ||
        head.y >= canvasHeight ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOverSound.play(); // Play game over sound
        stopGame();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSnake();
    drawFood();
}

function gameLoop() {
    if (gamePaused) return;
    moveSnake();
    checkCollision();
    draw();
}

function startGame() {
    food = randomFoodPosition();
    snake = [{ x: 160, y: 200 }];
    score = 0;
    updateScore();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 200);

    // Play background music only on first move
    if (firstMove) {
        bgMusic.play();
        firstMove = false;
    }
}

function stopGame() {
    clearInterval(gameInterval);
    alert(`Game Over! Final Score: ${score}`);
    document.getElementById("score").style.display = "none";
    bgMusic.pause(); // Stop background music when the game ends
    bgMusic.currentTime = 0; // Reset music position
}

function pauseResumeGame() {
    gamePaused = !gamePaused;
    document.getElementById("pauseBtn").textContent = gamePaused ? "Resume" : "Pause";
    
    if (gamePaused) {
        bgMusic.pause(); // Pause background music
    } else {
        bgMusic.play(); // Resume background music
    }
}

function restartGame() {
    startGame();
    document.getElementById("score").style.display = "block";
    bgMusic.play(); // Resume background music on restart
}

document.getElementById("pauseBtn").addEventListener("click", pauseResumeGame);
document.getElementById("stopBtn").addEventListener("click", stopGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);

document.addEventListener("keydown", event => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

startGame();