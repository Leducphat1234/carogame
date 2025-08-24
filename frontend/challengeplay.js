import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, sizex, sizey,
    cells, resetGame, menu,
    switchPlayer,
    checkPlayer, checkWin, scroll
} from "./scripts.js";

window.resetGame = resetGame;
resetGame();
window.onload = () => {scroll(document.getElementById("center-cell"))};
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
        display:"flex",
        flexWrap: "wrap",
        backgroundColor: "rgb(243, 237, 221)",
        border: "3px groove black",
        top: "25vh",
        justifySelf: "center",
        alignItems: "center",
    });
    overlay.appendChild(popup);
    const wrap_input_name = document.createElement("div")
    const input_name = document.createElement("input");
    input_name.placeholder = "Nhập tên của bạn";
    const wrap_input = document.createElement("div");
    wrap_input.id = "wrap-input";
    const inputID = document.createElement("input");
    inputID.name = "IDgame";
    inputID.placeholder = "Nhập ID";
    const msg1 = document.createElement("h2");
    msg1.innerHTML = "Nhập ID bạn được gửi rồi nhấn Enter:";
    const msg2 = document.createElement("h2");
    msg2.innerHTML = "hoặc";
    const wrap_btn = document.createElement("div");
    wrap_btn.style.cursor = "pointer";
    const btn = document.createElement("a");
    wrap_btn.className = "wrap";
    btn.className = "btn";
    btn.innerText = "Tạo ID";
    msg1.style.width
    = msg2.style.width
    = wrap_input.style.width = "100%";
    msg1.style.textAlign
    = inputID.style.textAlign
    = wrap_input.style.textAlign
    = msg2.style.textAlign
    = btn.style.textAlign
    = wrap_btn.style.textAlign = "center";
    inputID.style.height = "7vh";
    inputID.style.width = "30vw";
    inputID.style.fontSize = "5vh";
    inputID.style.borderRadius = "2.5vh";
    wrap_input.appendChild(inputID);
    wrap_btn.appendChild(btn);
    popup.appendChild(msg1);
    popup.appendChild(wrap_input);
    popup.appendChild(msg2);
    popup.appendChild(wrap_btn);
    inputID.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const ID = inputID.value;
            console.log(ID);
            // join ID
        }
    });
    wrap_btn.addEventListener("click", (e) => {
        console.log("User creates ID");
        // create ID
    });
}
createPopup();
board.addEventListener("click", (e) => {
    
});