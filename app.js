const gameBoardTable = document.getElementById('gameboard');
const messageDiv = document.getElementById('message');
const playAgainBtn = document.getElementById('playAgainBtn');
const speedSelect = document.getElementById('speed');
const wallToggleBtn = document.getElementById('wallToggle');

let isWallWrapEnabled = true; // Initially, wall wrap is enabled


wallToggleBtn.addEventListener('click', () => {
    isWallWrapEnabled = !isWallWrapEnabled; // Toggle the wall wrap option
});

const foodArray = ['&#127815', '&#127816', '&#127817', '&#127822', '&#127826', '&#129373', '&#129361', '&#127814', '&#129365', '&#127812', '&#127829'];
const boardSize = 20;

let gameBoard = [...Array(boardSize).keys()].map(() => [...Array(boardSize).keys()].map(() => 0));

let snake;
let direction;
let foodY, foodX, foodEmojiIndex;
let intervalID;
let selectedSpeed = parseInt(speedSelect.value);

function startGame() {
    const snakeY = parseInt(boardSize / 2);
    const snakeX = parseInt(boardSize / 2);

    gameBoard[snakeY][snakeX] = 's';
    snake = [snakeY + '_' + snakeX];

    direction = 'u';

    intervalID = setInterval(playGame, selectedSpeed);

    document.addEventListener ('keydown', e => {
        switch ( e.key ) {
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

    speedSelect.addEventListener('change', () => {
        clearInterval(intervalID);
        selectedSpeed = parseInt(speedSelect.value);
        intervalID = setInterval(playGame, selectedSpeed);
    });

    addFood();
}

// game engine
function playGame() {
    let [cursorY, cursorX] = calculateNewCursor();

    if ( ifHitsBorder(cursorY, cursorX) ) {
        endGame();
        return;
    }
   
    snake.unshift(cursorY + '_' + cursorX);
    snake.pop();

    drawGameBoard();
}

// for drawing game board
function drawGameBoard() {
    gameBoardTable.innerHTML = '';
    
    gameBoard.forEach((row, y) => {
        const boardRowTr = document.createElement('tr');
        row.forEach((cell, x) => {
            const boardCellTd = document.createElement('td');
            const id = y + '_' + x;
            boardCellTd.setAttribute('id', id);

            // draw snake
            if ( snake.includes(id) ) {
                boardCellTd.innerHTML = '&#128055';
            }

            // draw food
            if ( y == foodY && x == foodX ) {
                boardCellTd.innerHTML = foodArray[foodEmojiIndex];
            }

            boardRowTr.append(boardCellTd);
        });
        gameBoardTable.append(boardRowTr);
    });
}

// calculate new cursor for snake
function calculateNewCursor() {
    let [y, x] = snake[0].split('_');

    switch ( direction ) {
        case 'u':
            y = parseInt(y) - 1;
            break;
        case 'd':
            y = parseInt(y) + 1;
            break;
        case 'l':
            x = parseInt(x) - 1;
            break;
        case 'r':
            x = parseInt(x) + 1;
            break;
    }


    if (isWallWrapEnabled) {
        // Wrap around the walls
        y = (y + boardSize) % boardSize;
        x = (x + boardSize) % boardSize;
    } else {
        // Check for collision with walls
        if (y < 0 || y >= boardSize || x < 0 || x >= boardSize) {
            endGame(); // Game over if the snake hits the wall
            return;
        }
    }

    if ( y == foodY && x == foodX ) {
        addFood();
        snake.push(undefined);
    }

    return [y, x];    
}

// test if snake hits the border
function ifHitsBorder(y, x) {
    if ( y < 0 || y >= boardSize || x < 0 || x >= boardSize ) {
        return true;
    }
    return false;
}

// end the game
function endGame() {
    clearInterval(intervalID);
    intervalID = null;
    messageDiv.innerText = 'Game Over';
    messageDiv.classList.remove('hidden');
    playAgainBtn.classList.remove('hidden');
}

// restart the game
function restartGame() {
    clearInterval(intervalID);
    snake = [];
    direction = null;
    foodY = null;
    foodX = null;
    foodEmojiIndex = null;
    messageDiv.innerText = '';
    messageDiv.classList.add('hidden');
    playAgainBtn.classList.add('hidden');
    
    startGame(); // Start a new game
}

// generate food with random
function addFood() {
    do {
        foodY = Math.floor(Math.random() * boardSize);
        foodX = Math.floor(Math.random() * boardSize);
        foodEmojiIndex = Math.floor(Math.random() * foodArray.length);
    } while ( snake.includes(foodY + '_' + foodX) );
}

startGame(); // Start the initial game
