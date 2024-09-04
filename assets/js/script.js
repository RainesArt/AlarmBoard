const createBoardButton = document.getElementById('createBoardButton');
const existingBoardButton = document.getElementById('existingBoardButton');
const playButton = document.getElementById('playButton');

createBoardButton.addEventListener('click', function() {
   
   
    window.location.href = 'editor.html'; 

});

existingBoardButton.addEventListener('click', function() {
    
    
    window.location.href = 'editor.html'; 

});

playButton.addEventListener('click', function() {
    
    
    window.location.href = 'play.html';
    
});