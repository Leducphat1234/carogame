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
        top: "11vh",
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
        position: "fixed",
        width: "60vw",
        height: "60vh",
        display: "flex",
        backgroundColor: "rgb(243, 237, 221)",
        border: "3px groove black",
        top: "25vh",
        justifyContent: "center",
        alignItems: "center",
    });
    overlay.appendChild(popup);
    const inputID = document.createElement("input");
    const msg1 = document.createElement("h2");
    msg1.innerHTML = "Nhập ID được gửi:";
    const msg2 = document.createElement("h2");
    const breakline = document.createElement("br");
    msg2.innerHTML = "hoặc";
    const wrap_btn = document.createElement("div");
    const btn = document.createElement("a");
    wrap_btn.className = "mode";
    btn.className = "btn";
    btn.innerText = "Tạo ID";
    wrap_btn.appendChild(btn);
    popup.appendChild(msg1);
    popup.appendChild(inputID);
    popup.appendChild(msg2);
    popup.appendChild(wrap_btn);
}
createPopup();
board.addEventListener("click", (e) => {
    
});
