import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, sizex, sizey,
    cells, resetGame, menu,
    switchPlayer,
    checkPlayer, checkWin,
    moveSound, scroll, centerindex
} from "./scripts.js";

window.resetGame = resetGame;
resetGame();
window.onload = () => {
    scroll(document.getElementById("center-cell"));
};
moveSound.preload = "auto";
board.addEventListener("click", (e) => {
    if (isGameOver()) return;
    if (e.target.classList.contains("cell")) {
        if (e.target.querySelector("img")) return;
        const img = document.createElement("img");
        moveSound.play();
        if (checkPlayer("x")) {
            img.src = "./img/X.png";
            img.alt = "x";
            e.target.appendChild(img);
            if (checkWin(e.target)) {
                // window.alert(turn + " wins");
                turnHeader[0].innerHTML = "Người thắng:&nbsp";
                setGameOver(true);
                return;
            }
            switchPlayer();
            showPlayerTurn.src = "./img/O.png";
        }
        else {
            img.src = "./img/O.png";
            img.alt = "o";
            e.target.appendChild(img);
            if (checkWin(e.target)) {
                turnHeader[0].innerHTML = "Người thắng:";
                setGameOver(true);
                return;
            }
            switchPlayer();
            showPlayerTurn.src = "./img/X.png";
        }
        
    }
});
