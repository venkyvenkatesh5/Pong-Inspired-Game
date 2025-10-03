'use strict';

const play_button = document.querySelector("#play_button");
const restart_button = document.querySelector("#restart_button");
const level_select = document.querySelector("#level_select");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas_width = canvas.width;
const canvas_height = canvas.height;

// Paddle variables
const paddle_width = 80;
const paddle_height = 10;
let paddleX;
let leftPressed = false;
let rightPressed = false;

// Ball variables
const ball_size = 30; 
let x;
let y;
let dx;
let dy;
const ball_emoji = "😎";

let score;
let level;

function drawBall() {
    ctx.font = `${ball_size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ball_emoji, x, y);
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas_height - paddle_height - 10, paddle_width, paddle_height);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawGameOver() {
    ctx.font = "24px Monospace";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText("GAME OVER", canvas_width / 2, canvas_height / 2);
}


function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
        leftPressed = false;
    }
    if (e.key === "Left" || e.key === "ArrowLeft") {
        rightPressed = false;
        leftPressed = true;
    }
}


function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    }
    if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddle_width / 2;
    }
}

function touchHandler(e) {
    if (e.touches) {
        const relativeX = e.touches[0].pageX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddle_width / 2;
        }
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);


function draw() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    drawBall();
    drawPaddle();
    drawScore();
    

    if (x + dx < ball_size / 2 || x + dx > canvas_width - ball_size / 2) {
        dx = -dx;
    }

    
    if (y + dy < ball_size / 2) {
        dy = -dy;
    }


    if (y + dy > canvas_height - paddle_height - 10 - ball_size / 2) {
        if (x > paddleX && x < paddleX + paddle_width) {
            dy = -dy;
            score++;
        } else if (y + dy > canvas_height - ball_size / 2) {
            
            drawGameOver();
            play_button.disabled = false;
            restart_button.disabled = true;
            return;
        }
    }

    
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas_width - paddle_width);
    }
    if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }


    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

function startGame() {
    play_button.disabled = true;
    restart_button.disabled = false;
    x = canvas_width / 2;
    y = canvas_height / 3;
    score = 0;
    

    const selectedLevel = parseInt(level_select.value);
    level = selectedLevel;
    setSpeed(selectedLevel);

    paddleX = (canvas_width - paddle_width) / 2;
    draw();
}

function restartGame() {
    x = canvas_width / 2;
    y = canvas_height / 3;
    draw();
}


function setSpeed(level) {
    switch (level) {
        case 1: // Beginner
            dx = 2;
            dy = 2;
            break;
        case 2: // Intermediate
            dx = 4;
            dy = 4;
            break;
        case 3: // Advanced
            dx = 6;
            dy = 6;
            break;
    }
}
