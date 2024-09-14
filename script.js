const canvas = document.getElementById('chessBoard');
const ctx = canvas.getContext('2d');
const pieceMenu = document.getElementById('piece-menu');
const drawButton = document.getElementById('drawMode');
const downloadButton = document.getElementById('download');
const clearButton = document.getElementById('clearBoard');

let isDrawingMode = false;
let currentPiece = null;
let isDrawing = false;

// Drawing mode for touch compatibility
function getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

// Chessboard Setup
const boardSize = 4;
const squareSize = canvas.width / boardSize;
function drawBoard() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const x = col * squareSize;
            const y = row * squareSize;
            ctx.fillStyle = (row + col) % 2 === 0 ? 'white' : 'green';
            ctx.fillRect(x, y, squareSize, squareSize);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, squareSize, squareSize);
        }
    }
}

drawBoard();

// Select a chess piece
pieceMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('piece')) {
        currentPiece = e.target;
    }
});

// Place a chess piece on the board (works for both mobile and desktop)
canvas.addEventListener('click', (e) => {
    if (currentPiece && !isDrawingMode) {
        const x = Math.floor(e.offsetX / squareSize) * squareSize;
        const y = Math.floor(e.offsetY / squareSize) * squareSize;
        const img = new Image();
        img.src = currentPiece.src;
        img.onload = () => {
            ctx.drawImage(img, x, y, squareSize, squareSize);
        };
    }
});

// Toggle drawing mode
drawButton.addEventListener('click', () => {
    isDrawingMode = !isDrawingMode;
    canvas.style.cursor = isDrawingMode ? 'crosshair' : 'default';
});

// Drawing functionality (mouse)
canvas.addEventListener('mousedown', () => {
    if (isDrawingMode) {
        isDrawing = true;
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (isDrawingMode && isDrawing) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});
canvas.addEventListener('mouseup', () => {
    if (isDrawingMode) {
        isDrawing = false;
        ctx.beginPath();
    }
});

// Drawing functionality (touch)
canvas.addEventListener('touchstart', (e) => {
    if (isDrawingMode) {
        e.preventDefault();
        isDrawing = true;
        const pos = getTouchPos(canvas, e);
        ctx.moveTo(pos.x, pos.y);
    }
});

canvas.addEventListener('touchmove', (e) => {
    if (isDrawingMode && isDrawing) {
        e.preventDefault();
        const pos = getTouchPos(canvas, e);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
});

canvas.addEventListener('touchend', () => {
    if (isDrawingMode) {
        isDrawing = false;
        ctx.beginPath();
    }
});

// Download board as an image
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `4x4ChessTool_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

// Clear board
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
});
