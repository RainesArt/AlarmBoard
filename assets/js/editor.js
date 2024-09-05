// TODO: Create save button which saves the current board to local storage

const boardArea = document.getElementById('board-area');
const addWhiteBtn = document.getElementById('add-white');
const addBlackBtn = document.getElementById('add-black');
const clearBoardBtn = document.getElementById('clear-board');
const autoFillBtn = document.getElementById('autofill-board');
const tileSlider = document.getElementById('tile-slider');
const sliderValue = document.getElementById('slider-value');
const tileCountDisplay = document.getElementById('tile-count');


let draggableElements = document.querySelectorAll('.draggable');

draggableElements.forEach((element) => {
    element.draggable = true;
    element.addEventListener('dragstart',(e) => {
        draggedTile = e.target;
    });
});

const TILE_SIZE = 50;
const GRID_SIZE = 13;
const MAX_TILES = 170;
let draggedTile = null;
let tiles = [];
let pieces = [];
let highlightElement = null;

function createTile(color, indexX, indexY) {

    deleteBoardChild(indexX,indexY,'tile',tiles);
    const tile = document.createElement('div');
    tile.classList.add('tile', color);
    tile.draggable = true;
    tiles.push(tile);
    boardArea.appendChild(tile);

    tile.addEventListener('dragstart', (e) => {
        draggedTile = e.target;
        e.dataTransfer.setData('text/plain', '');
    });

    placeObject(tile, indexX, indexY);
    return tile;
}

function createPiece(pieceName,indexX,indexY){
    deleteBoardChild(indexX,indexY,'piece',pieces);
    const piece = document.createElement('div');
    const piece_classes = pieceName.split(' ') ;
    piece.classList.add('piece', 'z-50',piece_classes[0],piece_classes[1]);
    piece.draggable = true;
    pieces.push(piece);
    boardArea.appendChild(piece);

    piece.addEventListener('dragstart', (e) => {
        draggedTile = e.target;
        e.dataTransfer.setData('text/plain', '');
    });

    placeObject(piece, indexX, indexY);
    return piece;
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
    tileCountDisplay.textContent = `Total Tiles: ${tiles.length} / 169`; // this calculation means will need to hardcode value to do later fix caluclation
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

function placeObject(object, indexX, indexY) {
    object.style.left = indexX * TILE_SIZE + 'px';
    object.style.top = indexY * TILE_SIZE + 'px';
    object.dataset.x = indexX;
    object.dataset.y = indexY;
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

function deleteBoardChild(indexX,indexY,className,trackingArray){
    /* 
    This function searches all children of the board for objects with 
    The specified className and index, and deletes them.
    */
    const children = boardArea.children;
    for (var i = 0; i < children.length; i++){
        let child = children[i];

        if(child.classList.contains(className)){
            let x = child.getAttribute('data-x');
            let y = child.getAttribute('data-y');
            if(x == indexX && y == indexY){
                deleteIndex = trackingArray.findIndex((element)=>{
                    return element == child;
                });

                if(deleteIndex != -1){
                    trackingArray = trackingArray.splice(deleteIndex,1);
                }
                child.remove();
            }
        }
    }
    return false;
}

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

    if(!draggedTile){return;}

    const position = pixelToIndex(e.clientX,e.clientY);
    const classList = draggedTile.classList

    if (classList.contains('piece')){

        const destination = checkBoard(position.x,position.y,'piece');

        if(destination != draggedTile){
            deleteBoardChild(position.x, position.y,'piece',pieces);
        }

        placeObject(draggedTile, position.x, position.y);

    } else if (classList.contains('tool-bar-icon')){
        const destination = checkBoard(position.x,position.y,'piece');

        if(destination != draggedTile){
            deleteBoardChild(position.x, position.y,'piece',pieces);
        }

        piece_classes = Array.from(classList).filter((className) => {
            return className.startsWith('fa-');
        });

        createPiece(`${piece_classes[0]} ${piece_classes[1]}`,position.x,position.y)
    } else if (classList.contains('tile')) {
        const destination = checkBoard(position.x,position.y,'tile');

        if(destination != draggedTile){
            deleteBoardChild(position.x, position.y,'tile',tiles);
        }
        placeObject(draggedTile, position.x, position.y);

    } else if (classList.contains('draggable')) {
        const destination = checkBoard(position.x,position.y,'tile');

        if(destination != draggedTile){
            deleteBoardChild(position.x, position.y,'tile',tiles);
        }

        if(draggedTile.classList.contains('white')){
            createTile('white',position.x,position.y);
        }

        else if(draggedTile.classList.contains('black')){
            createTile('black',position.x,position.y);
        }
    }

    draggedTile = null;
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
deleteBoardChild(0,0,'tile',tiles);