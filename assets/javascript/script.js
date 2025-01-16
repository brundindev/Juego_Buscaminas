/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/
const rows = 10;
const cols = 10;
const bombsCount = 20;
let revealedCells = 0;

let gameBoard = [];
let bombsArray = [];

const gameContainer = document.getElementById('game');
const counter = document.getElementById('counter');
const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', initGame);

// Inicializar el tablero de juego
function initGame() {
    revealedCells = 0;
    counter.textContent = `Celdas reveladas: ${revealedCells}`;
    gameBoard = Array(rows).fill().map(() => Array(cols).fill({
        revealed: false,
        bomb: false,
        flag: false,
        number: 0
    }));

    bombsArray = [];
    placeBombs();
    calculateNumbers();

    gameContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    renderBoard();
}

// Colocar bombas en el tablero
function placeBombs() {
    let placedBombs = 0;
    while (placedBombs < bombsCount) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);

        if (!gameBoard[row][col].bomb) {
            gameBoard[row][col] = { ...gameBoard[row][col], bomb: true };
            bombsArray.push([row, col]);
            placedBombs++;
        }
    }
}

// Calcular números de celdas adyacentes a bombas
function calculateNumbers() {
    for (let [row, col] of bombsArray) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (row + r >= 0 && row + r < rows && col + c >= 0 && col + c < cols) {
                    if (!gameBoard[row + r][col + c].bomb) {
                        gameBoard[row + r][col + c].number++;
                    }
                }
            }
        }
    }
}

// Renderizar el tablero de juego
function renderBoard() {
    gameContainer.innerHTML = '';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
            gameContainer.appendChild(cell);
        }
    }
}

// Manejar clic en una celda
function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    revealCell(row, col);
}

// Manejar clic derecho en una celda
function handleCellRightClick(event) {
    event.preventDefault();
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    toggleFlag(row, col);
}

// Revelar una celda
function revealCell(row, col) {
    if (gameBoard[row][col].revealed || gameBoard[row][col].flag) return;

    gameBoard[row][col].revealed = true;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    cell.classList.add('revealed');

    if (gameBoard[row][col].bomb) {
        cell.classList.add('bomb');
        alert('¡Perdiste! Pisaste una bomba.');
        revealAllBombs();
        return;
    }

    revealedCells++;
    counter.textContent = `Celdas reveladas: ${revealedCells}`;

    if (gameBoard[row][col].number > 0) {
        cell.classList.add('number');
        cell.textContent = gameBoard[row][col].number;
    } else {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (row + r >= 0 && row + r < rows && col + c >= 0 && col + c < cols) {
                    revealCell(row + r, col + c);
                }
            }
        }
    }
}

// Alternar bandera en una celda
function toggleFlag(row, col) {
    if (gameBoard[row][col].revealed) return;

    gameBoard[row][col].flag = !gameBoard[row][col].flag;
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

    if (gameBoard[row][col].flag) {
        cell.classList.add('flag');
    } else {
        cell.classList.remove('flag');
    }
}

// Revelar todas las bombas
function revealAllBombs() {
    for (let [row, col] of bombsArray) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('revealed', 'bomb');
    }
}

// Iniciar el juego
initGame();
/*=======================================================
Copyright (c) 2024. Alejandro Alberto Jiménez Brundin
=======================================================*/
