import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, sizex, sizey,
    cells, resetGame, menu,
    switchPlayer,
    checkPlayer, checkWin
} from "./scripts.js";

window.resetGame = resetGame;
resetGame();
function createPopup() {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1000",
    });
    document.body.appendChild(overlay);
    const popup = document.createElement("div");
    Object.assign(popup.style, {

    });
    document.body.removeChild(overlay);
}
createPopup();
board.addEventListener("click", (e) => {
    
});
