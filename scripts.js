const menu = document.getElementById("menu");
let gameOver = false;

export function isGameOver() {
    return gameOver;
}

export function setGameOver(status) {
    gameOver = status;
}