
/* Timer functionality */
const timerText = document.getElementById('timer');

let timerTimeMinutes = 10*60;
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

startTimer();