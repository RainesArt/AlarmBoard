// TODO: Create save button which saves the current board to local storage

const boardArea = document.getElementById('board-area');
const addWhiteBtn = document.getElementById('add-white');
const addBlackBtn = document.getElementById('add-black');
const clearBoardBtn = document.getElementById('clear-board');
const tileSlider = document.getElementById('tile-slider');
const sliderValue = document.getElementById('slider-value');
const tileCountDisplay = document.getElementById('tile-count');

const TILE_SIZE = 50;
const GRID_SIZE = 13;
const MAX_TILES = 170;
let draggedTile = null;
let tiles = [];
let highlightElement = null;

function createTile(color, x, y) {
    const tile = document.createElement('div');
    tile.classList.add('tile', color);
    tile.draggable = true;

    tile.addEventListener('dragstart', (e) => {
        draggedTile = e.target;
        e.dataTransfer.setData('text/plain', '');
    });

    placeTile(tile, x, y);
    return tile;
}

function addTiles(color, count) {
    const remainingSlots = MAX_TILES - tiles.length;
    const tilesToAdd = Math.min(count, remainingSlots);

    for (let i = 0; i < tilesToAdd; i++) {
        const position = findAvailablePosition();
        if (position) {
            const tile = createTile(color, position.x, position.y);
            tiles.push(tile);
            console.log(tile);
            boardArea.appendChild(tile);
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

function placeTile(tile, x, y) {
    tile.style.left = x * TILE_SIZE + 'px';
    tile.style.top = y * TILE_SIZE + 'px';
    tile.dataset.x = x;
    tile.dataset.y = y;
}

function snapToGrid(x, y) {
    const snappedX = Math.round(x / TILE_SIZE);
    const snappedY = Math.round(y / TILE_SIZE);
    return {
        x: Math.max(0, Math.min(snappedX, GRID_SIZE - 1)),
        y: Math.max(0, Math.min(snappedY, GRID_SIZE - 1))
    };
}

function createHighlight() {
    const highlight = document.createElement('div');
    highlight.classList.add('highlight');
    boardArea.appendChild(highlight);
    return highlight;
}

function updateHighlight(x, y) {
    if (!highlightElement) {
        highlightElement = createHighlight();
    }
    const snappedPosition = snapToGrid(x, y);
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

addWhiteBtn.addEventListener('click', () => addTiles('white', parseInt(tileSlider.value)));
addBlackBtn.addEventListener('click', () => addTiles('black', parseInt(tileSlider.value)));
clearBoardBtn.addEventListener('click', clearBoard);

tileSlider.addEventListener('input', () => {
    sliderValue.textContent = tileSlider.value;
});

boardArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    const rect = boardArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    updateHighlight(x, y);
});

boardArea.addEventListener('dragleave', () => {
    hideHighlight();
});

boardArea.addEventListener('drop', (e) => {
    e.preventDefault();
    hideHighlight();
    if (draggedTile) {
        const rect = boardArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const snappedPosition = snapToGrid(x, y);

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

updateTileCount();
updateControls();