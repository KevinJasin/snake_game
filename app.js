document.addEventListener('DOMContentLoaded', function() {
    const gameBoardTable = document.getElementById('gameboard');
    const messageDiv = document.getElementById('message');
    const scoreDisplay = document.getElementById('score');

    console.log(scoreDisplay); // Check if scoreDisplay is correctly assigned

    const foodArray = ['&#127815', '&#127816', '&#127817', '&#127822', '&#127826', '&#129373', '&#129361', '&#127814', '&#129365', '&#127812', '&#127829'];
    const boardSize = 20;

    let gameBoard = [...Array(boardSize)].map(() => Array(boardSize).fill(0));

    const snakeY = Math.floor(boardSize / 2);
    const snakeX = Math.floor(boardSize / 2);

    gameBoard[snakeY][snakeX] = 's';
    let snake = [snakeY + '_' + snakeX];

    let direction = 'u';
    let score = 0;

    let foodY, foodX, foodEmojiIndex;

    let intervalID = setInterval(playGame, 200);

    document.addEventListener('keydown', e => {
        switch (e.key) {
            case 'ArrowUp':
                direction = 'u';
                break;
            case 'ArrowDown':
                direction = 'd';
                break;
            case 'ArrowLeft':
                direction = 'l';
                break;
            case 'ArrowRight':
                direction = 'r';
                break;
        }
    });

    // Function to update the score and display it
    function updateScore() {
        score++;
        console.log('Score:', score); // Log the score to debug
        scoreDisplay.innerText = 'Score: ' + score;
    }
    

    // Function to handle when the snake eats food
    function handleFoodEaten() {
        addFood();
        updateScore();
    }

    addFood();

    // Game engine
    function playGame() {
        let [cursorY, cursorX] = calculateNewCursor();

        if (ifHitsBorder(cursorY, cursorX) || ifHitsBody(cursorY, cursorX)) {
            gameOver();
            return;
        }

        snake.unshift(cursorY + '_' + cursorX);

        if (cursorY == foodY && cursorX == foodX) {
            handleFoodEaten();
        } else {
            snake.pop();
        }

        drawGameBoard();
    }

    // Drawing game board
    function drawGameBoard() {
        gameBoardTable.innerHTML = '';
        gameBoard.forEach((row, y) => {
            const boardRowTr = document.createElement('tr');
            row.forEach((cell, x) => {
                const boardCellTd = document.createElement('td');
                const id = y + '_' + x;
                boardCellTd.setAttribute('id', id);

                if (snake.includes(id)) {
                    boardCellTd.innerHTML = '&#128055';
                }

                if (y == foodY && x == foodX) {
                    boardCellTd.innerHTML = foodArray[foodEmojiIndex];
                }

                boardRowTr.append(boardCellTd);
            });
            gameBoardTable.append(boardRowTr);
        });
    }

    // Calculating new cursor for snake
    function calculateNewCursor() {
        let [y, x] = snake[0].split('_');

        switch (direction) {
            case 'u':
                y--;
                break;
            case 'd':
                y++;
                break;
            case 'l':
                x--;
                break;
            case 'r':
                x++;
                break;
        }

        if (y == foodY && x == foodX) {
            addFood();
            snake.push(undefined);
        }

        return [y, x];
    }

    // Test if snake hits the border
    function ifHitsBorder(y, x) {
        if (y < 0 || y >= boardSize || x < 0 || x >= boardSize) {
            clearInterval(intervalID);
            intervalID = null;
            messageDiv.innerText = 'Game Over';
            messageDiv.classList.remove('hidden');
            return true;
        }
        return false;
    }

    // Test if snake hits its body
    function ifHitsBody(y, x) {
        const newHeadPosition = y + '_' + x;
        return snake.slice(1).includes(newHeadPosition);
    }

    // Game over function for snake hits its body
    function gameOver() {
        clearInterval(intervalID);
        intervalID = null;
        messageDiv.innerText = 'Game Over';
        messageDiv.classList.remove('hidden');
    }

    // Generate food with random
    function addFood() {
        do {
            foodY = Math.floor(Math.random() * boardSize);
            foodX = Math.floor(Math.random() * boardSize);
            foodEmojiIndex = Math.floor(Math.random() * foodArray.length);
        } while (snake.includes(foodY + '_' + foodX));
    }
});
