boardArea = document.getElementById('board-area');
homeBtn = document.getElementById('home-button')

/* Timer functionality */
const timerText = document.getElementById('timer');

let timerTimeMinutes = 10*60;
const TILE_SIZE = 50;
const GRID_SIZE = 13;
const MAX_TILES = 170;
let draggedTile = null;
let tiles = [];
let pieces = [];
let highlightElement = null;

function startTimer() {
    let timer = timerTimeMinutes;
    let newInterval = setInterval(function() {
        minutes = parseInt(timer/ 60, 10);
        seconds = parseInt(timer % 60, 10);

        timerText.innerText = "(" + minutes + ":" + seconds + ")";

        if (--timer < 0){
            clearInterval(newInterval);
            display.innerText = "Game Finished!";
        }
    }, 1000);
}

homeBtn.addEventListener('click',()=>{
    window.location.href = 'index.html';
});

boardArea.addEventListener('dragover', (e) => {
    if(draggedTile){
        e.preventDefault();
        updateHighlight(e.clientX,e.clientY);
    }
});

boardArea.addEventListener('dragleave', () => {
    hideHighlight();
});

boardArea.addEventListener('drop', (e) => {
    e.preventDefault();
    hideHighlight();

    if(!draggedTile){return;}

    const position = pixelToIndex(e.clientX,e.clientY);
    const classList = draggedTile.classList

    if (classList.contains('piece')){

        const destination = checkBoard(position.x,position.y,'piece');

        if(destination != draggedTile){
            deletePiece(position.x, position.y);
        }

        placeObject(draggedTile, position.x, position.y);

    }

    draggedTile = null;
});

startTimer();
loadBoardState();

tiles.forEach(tile => {
    tile.draggable = false;
});