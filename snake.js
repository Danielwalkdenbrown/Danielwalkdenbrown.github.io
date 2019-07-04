(function () {
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

    function restartGame() {

        Restart_Button.classList = "hidden";
        main(INITIAL_SNAKE_STATE.slice());
    }

    Restart_Button.addEventListener('click', restartGame)

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
        if (keyPressed === R_KEY && didGameEnd()) {
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
            }

        }, 200);
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

})();