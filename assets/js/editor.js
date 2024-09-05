// TODO: Create save button which saves the current board to local storage

const boardArea = document.getElementById('board-area');
const addWhiteBtn = document.getElementById('add-white');
const addBlackBtn = document.getElementById('add-black');
const clearBoardBtn = document.getElementById('clear-board');
const autoFillBtn = document.getElementById('autofill-board');
const tileSlider = document.getElementById('tile-slider');
const sliderValue = document.getElementById('slider-value');
const tileCountDisplay = document.getElementById('tile-count');

const whiteBoxDragger = document.getElementById('white-box-draggable');
const blackBoxDragger = document.getElementById('black-box-draggable');
const eraserDragger = document.getElementById('eraser-box-draggable');
whiteBoxDragger.draggable = true;
blackBoxDragger.draggable = true;
eraserDragger.draggable = true;


const TILE_SIZE = 50;
const GRID_SIZE = 13;
const MAX_TILES = 170;
let draggedTile = null;
let tiles = [];
let highlightElement = null;

function createTile(color, indexX, indexY) {

    // overwrites tiles with a new object
    // if(checkBoard(indexX,indexY,'tile')){
    //     return null;
    // }
    deleteBoardChild(indexX,indexY,'tile');
    const tile = document.createElement('div');
    tile.classList.add('tile', color);
    tile.draggable = true;
    tiles.push(tile);
    boardArea.appendChild(tile);

    tile.addEventListener('dragstart', (e) => {
        draggedTile = e.target;
        e.dataTransfer.setData('text/plain', '');
    });

    // tile.addEventListener('dragend', (e) => {
    //     e.dataTransfer.setData('text/plain', '');
    //     this_x = e.target.
    //     const indexPosition = pixelToIndex(e.clientX,e.clientY);
    //     replace = checkBoard(indexPosition.x,indexPosition.y,'tile');
    //     swap(e.target,replace);
    // });

    placeTile(tile, indexX, indexY);
    return tile;
}

function addTiles(color, count) {
    const remainingSlots = MAX_TILES - tiles.length;
    const tilesToAdd = Math.min(count, remainingSlots);

    for (let i = 0; i < tilesToAdd; i++) {
        const position = findAvailablePosition();
        if (position) {
            const tile = createTile(color, position.x, position.y);
        } else {
            document.getElementById('reachedlimitmodel').classList.remove('hidden');
            document.getElementById('createarea').classList.add('hidden');
            console.log('Reaching this part of the code!!');
            document.getElementById('close-button').addEventListener("click", ()=>{
                document.getElementById('reachedlimitmodel').classList.add('hidden');
                document.getElementById('createarea').classList.remove('hidden');
            });
            break;
        }
    }

    updateTileCount();
    updateControls();
}

function autoFillTiles() {
    clearBoard();
    tile_color = 'white';

    // create function to swap colors
    const swap_color = function () {
        if(tile_color == 'white'){
            tile_color = 'black';
        } else {
            tile_color = 'white';
        }
    };

    for(let col = 0; col < GRID_SIZE; col++){
        for(let row = 0; row < GRID_SIZE; row++){
            createTile(tile_color,col,row);
            swap_color();
        }

        if(!(GRID_SIZE % 2)){
            swap_color();
        }
    }
}

function updateTileCount() {
    tileCountDisplay.textContent = `Total Tiles: ${tiles.length} / 160`; // this calculation means will need to hardcode value to do later fix caluclation
}

function updateControls() {
    const isFull = tiles.length >= MAX_TILES;
    addWhiteBtn.disabled = isFull;
    addBlackBtn.disabled = isFull;
    tileSlider.disabled = isFull;
}

function findAvailablePosition() {
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (!tiles.some(t => t.dataset.x == x && t.dataset.y == y)) { // Don't attempt to put tripple equals since string and number comparison
                return { x, y };
            }
        }
    }
    return null;
}

function placeTile(tile, indexX, indexY) {
    tile.style.left = indexX * TILE_SIZE + 'px';
    tile.style.top = indexY * TILE_SIZE + 'px';
    tile.dataset.x = indexX;
    tile.dataset.y = indexY;
}

function pixelToIndex(clientX, clientY) {
    /* 
    This function converts from pixel values on the screen to index values on 
    the chess board.

    inputs: event.clientX, and event.clientY
    outputs: object cotaining an x value and y value

    example usage: inputed (231.3,294.1), outputs (3,3)
    Position (3,3) is the X on this  tile board:

    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  X  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    0  0  0  0  0  0  0  0  
    */

    bounds = boardArea.getBoundingClientRect();
    const index_X = Math.round((clientX - bounds.left) / TILE_SIZE);
    const index_Y = Math.round((clientY - bounds.top) / TILE_SIZE);
    return {
        x: Math.max(0, Math.min(index_X, GRID_SIZE - 1)),
        y: Math.max(0, Math.min(index_Y, GRID_SIZE - 1))
    };
}

function updateHighlight(clientX, clientY) {
    if (!highlightElement) {
        highlightElement = document.createElement('div');
        highlightElement.classList.add('highlight');
        boardArea.appendChild(highlightElement);
    }
    const snappedPosition = pixelToIndex(clientX, clientY);
    highlightElement.style.left = snappedPosition.x * TILE_SIZE + 'px';
    highlightElement.style.top = snappedPosition.y * TILE_SIZE + 'px';
    highlightElement.style.display = 'block';
}

function hideHighlight() {
    if (highlightElement) {
        highlightElement.style.display = 'none';
    }
}

function clearBoard() {
    boardArea.innerHTML = '';
    tiles = [];
    highlightElement = null;
    updateTileCount();
    updateControls();
}

function checkBoard(indexX,indexY,className){
    /* 
    This function searches all children of the board for children with 
    The specified className and index, return true if found or false if 
    none are found
    */
    const children = boardArea.children;
    for (var i = 0; i < children.length; i++){
        let child = children[i];

        if(child.classList.contains(className)){
            let x = child.getAttribute('data-x');
            let y = child.getAttribute('data-y');
            if(x == indexX && y == indexY){
                return child;
            }
        }
    }
    return false;
}

function deleteBoardChild(indexX,indexY,className){
    /* 
    This function searches all children of the board for objects with 
    The specified className and index, and deltes them
    */
    const children = boardArea.children;
    for (var i = 0; i < children.length; i++){
        let child = children[i];

        if(child.classList.contains(className)){
            let x = child.getAttribute('data-x');
            let y = child.getAttribute('data-y');
            if(x == indexX && y == indexY){
                child.remove();
            }
        }
    }
    return false;
}

whiteBoxDragger.addEventListener('dragstart', (e) => {
    draggedTile = e.target;
    // e.dataTransfer.setData('text/plain', '');
});

whiteBoxDragger.addEventListener('dragend', (e) => {
    // e.dataTransfer.setData('text/plain', '');
    const indexPosition = pixelToIndex(e.clientX,e.clientY);
    const tile = createTile('white',indexPosition.x,indexPosition.y);
});

blackBoxDragger.addEventListener('dragstart', (e) => {
    // e.dataTransfer.setData('text/plain', '');
    draggedTile = e.target;
});

blackBoxDragger.addEventListener('dragend',(e) => {
    const indexPosition = pixelToIndex(e.clientX,e.clientY);
    const tile = createTile('black',indexPosition.x,indexPosition.y);
});

eraserDragger.addEventListener('dragstart', (e) => {
    draggedTile = e.target;
});

eraserDragger.addEventListener('dragend', (e) => {
    const indexPosition = pixelToIndex(e.clientX,e.clientY);
    deleteBoardChild(indexPosition.x,indexPosition.y,'tile');
});

addWhiteBtn.addEventListener('click', () => addTiles('white', parseInt(tileSlider.value)));
addBlackBtn.addEventListener('click', () => addTiles('black', parseInt(tileSlider.value)));
clearBoardBtn.addEventListener('click', clearBoard);

tileSlider.addEventListener('input', () => {
    sliderValue.textContent = tileSlider.value;
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
    if (draggedTile) {
        const snappedPosition = pixelToIndex(e.clientX,e.clientY);

        if (!tiles.some(t => t !== draggedTile && t.dataset.x == snappedPosition.x && t.dataset.y == snappedPosition.y)) {
            placeTile(draggedTile, snappedPosition.x, snappedPosition.y);
        }

        draggedTile = null;
    }
});

boardArea.addEventListener('dblclick', (e) => {
    if (e.target.classList.contains('tile')) {
        e.target.classList.toggle('white');
        e.target.classList.toggle('black');
    }
});

autoFillBtn.addEventListener('click',() => {
    autoFillTiles();
});

updateTileCount();
updateControls();
autoFillTiles();
