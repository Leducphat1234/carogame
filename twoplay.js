const imgplayer = document.getElementsByClassName("imgplayer");
let turn = "x";
const board = document.getElementById("board");
const showPlayerTurn = document.getElementById("playerturn");

let sizex = 35, sizey = 25;
// grid-template-columns: repeat(50, 40px);
// grid-template-rows: repeat(50, 40px);
board.style.gridTemplateColumns = `repeat(${sizex}, 40px)`;
board.style.gridTemplateRows = `repeat(${sizey}, 40px)`;
for (let i = 0; i < sizex*sizey; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    board.appendChild(cell);
}
board.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell")) {
        if (e.target.querySelector("img")) return;
        const img = document.createElement("img");
        if (turn === "x") {
            img.src = "/img/X.png";
            img.alt = "x";
            turn = "o";
            showPlayerTurn.src = "/img/O.png";
        }
        else {
            img.src = "/img/O.png";
            img.alt = "o";
            turn = "x";
            showPlayerTurn.src = "/img/X.png";
        }
        e.target.appendChild(img);
        if (check()) {

        }
    }
})