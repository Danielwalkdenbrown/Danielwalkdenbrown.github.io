/* global firebase */
// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyDLHwF99M-MjxrhVrPVJC21CtbrfiRHgXY',
    projectId: 'my-website-danielwb'
});
var db = firebase.firestore();

let highScore = 0;
db.collection("namedScores").orderBy('score', 'desc').limit(1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        highScore = doc.data().score;
        const highScoreElement = document.getElementById('high-score');
        highScoreElement.innerHTML = `High score: ${highScore}<br/>by ${doc.data().name}`;
    });
});



const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
// Get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");
const SQUARE_SIZE = 30;
// Horizontal velocity
let dx = SQUARE_SIZE;;
// Vertical velocity
let dy = 0;

const initialXPosition = 90;
const INITIAL_SNAKE_STATE = [
    { x: initialXPosition + SQUARE_SIZE * 4, y: 150 },
    { x: initialXPosition + SQUARE_SIZE * 3, y: 150 },
    { x: initialXPosition + SQUARE_SIZE * 2, y: 150 },
    { x: initialXPosition + SQUARE_SIZE, y: 150 },
    { x: initialXPosition, y: 150 },

];

let snake = INITIAL_SNAKE_STATE.slice();

let foodX = -1;
let foodY = -1;
let score = 0;

const Restart_Button = document.getElementById('restart-button');
const submitGroup = document.getElementById('submit-group');
const scoreSubmittedMessage = document.getElementById('score-submitted-message');

function restartGame() {
    Restart_Button.classList = "hidden";
    main(INITIAL_SNAKE_STATE.slice());
    submitGroup.style.display = 'none';
    scoreSubmittedMessage.style.display = 'none';
    score = 0;
    document.getElementById('score').innerHTML = "Score: 0";
}

function submitScore() {
    const submitInput = document.getElementById('submit-input');
    const name = submitInput.value;
    submitInput.value = "";
    if (name) {
        db.collection("namedScores").add({ score, name });
        if (score > highScore) {
            highScore = score;
            const highScoreElement = document.getElementById('high-score');
            highScoreElement.innerHTML = `High score: ${highScore}<br/>by ${name}`;
        }
        submitGroup.style.display = 'none';
        scoreSubmittedMessage.style.display = 'block';
    }
}

Restart_Button.addEventListener('click', restartGame);
const submitGroupButton = document.getElementById('submit-button');
submitGroupButton.addEventListener('click', submitScore);
const submitInput = document.getElementById("submit-input");
submitInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') submitScore();
});

function clearCanvas() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    //  Select the colour for the border of the canvas
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;
    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, SQUARE_SIZE, SQUARE_SIZE);
    ctx.strokeRect(snakePart.x, snakePart.y, SQUARE_SIZE, SQUARE_SIZE);
}


function drawSnake(intialPosition) {
    if (intialPosition === undefined) {
        snake.forEach(drawSnakePart);
    } else {
        dx = SQUARE_SIZE;
        dy = 0;
        snake = intialPosition;
        snake.forEach(drawSnakePart);
    }
}

function advanceSnake() {
    const head = {
        x: snake[0].x + dx, y:
            snake[0].y + dy
    };
    snake.unshift(head);
    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    // if (didEatFood) {    setFoodPosition();  } else {    snake.pop();  }
    if (didEatFood) {
        // Increase score
        score += 1;
        // Display score on screen
        document.getElementById('score').innerHTML = "Score: " + score;
        // Generate new food location
        setFoodPosition();
    }

    else {
        // Remove the last part of snake body
        snake.pop();
    }
}



function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const R_KEY = 82
    const keyPressed = event.keyCode;
    const goingUp = dy === -SQUARE_SIZE;
    const goingDown = dy === SQUARE_SIZE;
    const goingRight = dx === SQUARE_SIZE;
    const goingLeft = dx === -SQUARE_SIZE;
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -SQUARE_SIZE;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -SQUARE_SIZE;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = SQUARE_SIZE;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = SQUARE_SIZE;
    }
    if (keyPressed === R_KEY && didGameEnd() && event.target.tagName !== 'INPUT') {
        restartGame();
    }
}

function main(intialPosition) {

    clearCanvas();
    setFoodPosition();
    drawFood();
    drawSnake(intialPosition);
    advanceSnake();
    document.addEventListener("keydown", changeDirection);
    const intervalId = setInterval(function () {
        clearCanvas();
        advanceSnake();
        drawSnake();
        drawFood();
        if (didGameEnd()) {
            clearInterval(intervalId);
            Restart_Button.classList = "";
            submitGroup.style.display = 'flex';

        }

    }, 70);
};

function randomTen(max) {
    const randomNumber = (Math.random() * max);
    const randomTen = Math.round(randomNumber / SQUARE_SIZE) * SQUARE_SIZE;
    return randomTen;
}

function setFoodPosition() {
    foodX = randomTen(gameCanvas.width - SQUARE_SIZE);
    foodY = randomTen(gameCanvas.height - SQUARE_SIZE);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(foodX, foodY, SQUARE_SIZE, SQUARE_SIZE);
    ctx.strokeRect(foodX, foodY, SQUARE_SIZE, SQUARE_SIZE);
}


function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > gameCanvas.width - SQUARE_SIZE;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > gameCanvas.height - SQUARE_SIZE;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

main();
