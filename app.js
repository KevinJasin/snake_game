const gameBoardTable = document.getElementById('gameboard');
const 

const foodArray = ["&#127815","&#127817" ," &#127818", "&#127819", "&#127826", ]
const boardSize = 20
let gameBoard = [...Array(boardSize).keys()].map(() => [...Array(boardSize).keys()].map(() => 0));
const snakeY = parseInt(boardSize / 2);
const snakeX = parseInt(boardSize / 2);
gameBoard[snakeY][snakeX] = 's';
let snake = [snakeY + '_' + snakeX];
let direction = 'u';
let foodY, foodX, foodEmojiIndex;
let intervalID = setInterval(playGame, 200);
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
addFood();
// game engine
function playGame () {
    let [cursorY, cursorX] = calculateNewCursor();
    if ( ifHitsBorder(cursorY, cursorX) ) {
        return 0;
    }
    snake.unshift(cursorY + '_' + cursorX);
    snake.pop();
    drawGameBoard();
}

// for drawing game board
function drawGameBoard () {
    gameBoardTable.innerHTML = '';
    gameBoard.forEach( (row, y) => {
        const boardRowTr = document.createElement('tr');
        row.forEach( (cell, x) => {
            const boardCellTd = document.createElement('td');
            const id = y + '_' + x;
            boardCellTd.setAttribute('id', id);
            if ( snake.includes(id) ) {
                boardCellTd.classList.add('snake');
            }
            if ( y == foodY && x == foodX ) {
                boardCellTd.innerHTML = foodArray[foodEmojiIndex];
            }
            boardRowTr.append(boardCellTd);
        });
        gameBoardTable.append(boardRowTr);
    });
}
// calculate new cursor for snake
function calculateNewCursor () {
    let [y, x] = snake[0].split('_');
    switch ( direction ) {
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
    if ( y == foodY && x == foodX ) {
        addFood();
        snake.push(undefined);
    }
    return [y, x];
}
// test if snake hits the border
function ifHitsBorder ( y, x ) {

    if ( y < 0 || y >= boardSize || x < 0 || x >= boardSize ) {
        clearInterval(intervalID);
        intervalID = null;
        messageDiv.innerText = "Game Over"
        return true;
    }
    return false;
}
// gerenate food with random
function addFood () {
    do {
        foodY = Math.floor(Math.random() * boardSize);
        foodX = Math.floor(Math.random() * boardSize);
        foodEmojiIndex = Math.floor(Math.random() * foodArray.length);
    } while ( snake.includes(foodY + '_' + foodX) )
    // const foodTd = document.getElementById(y + '_' + x);
    // console.log(y + '_' + x, foodTd);
    // foodTd.classList.add('food');
}
