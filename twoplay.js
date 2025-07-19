import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, winning, sizex, sizey,
    cells, resetGame, menu,
    switchPlayer,
    checkPlayer, checkWin
} from "./scripts.js";
// const imgplayer = document.getElementsByClassName("imgplayer");
// const turnHeader = document.getElementsByClassName("turnHeader");
// let turn = "x";
// const board = document.getElementById("board");
// const showPlayerTurn = document.getElementById("playerturn");
// let winning = 5;
// let sizex = 35, sizey = 35;
// let cells = document.querySelectorAll('.cell');
window.resetGame = resetGame;
resetGame();
board.addEventListener("click", (e) => {
    if (isGameOver()) return;
    if (e.target.classList.contains("cell")) {
        if (e.target.querySelector("img")) return;
        const img = document.createElement("img");
        if (checkPlayer("x")) {
            img.src = "/img/X.png";
            img.alt = "x";
            e.target.appendChild(img);
            if (checkWin(e.target)) {
                // window.alert(turn + " wins");
                turnHeader[0].innerHTML = "Người thắng:&nbsp";
                setGameOver(true);
                return;
            }
            switchPlayer();
            showPlayerTurn.src = "/img/O.png";
        }
        else {
            img.src = "/img/O.png";
            img.alt = "o";
            e.target.appendChild(img);
            if (checkWin(e.target)) {
                turnHeader[0].innerHTML = "Người thắng:&nbsp";
                setGameOver(true);
                return;
            }
            switchPlayer();
            showPlayerTurn.src = "/img/X.png";
        }
        
    }
})