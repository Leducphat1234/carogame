import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, sizex, sizey,
    cells, resetGame, menu,
    switchPlayer, checkFullBoard,
    checkPlayer, checkWin,
    centerindex,
    cntmove,
    isFullBoard,
    turn
} from "./scripts.js";


// window.addEventListener("load", () => {
//     const centercell = document.querySelector(`.cell[data-index='${centerindex}']`); // center cell

//     const rect = centercell.getBoundingClientRect();
//     const gridRect = board.getBoundingClientRect();

//     board.scrollLeft = centercell.offsetLeft - board.clientWidth / 2 + centercell.clientWidth / 2;
//     board.scrollTop = centercell.offsetTop - board.clientHeight / 2 + centercell.clientHeight / 2;
// });
window.resetGame = resetGame;
resetGame();
const chosen = document.getElementsByClassName("chosen");
// const choice = document.getElementsByClassName("choice");
let bot = "o";
const O_img = document.getElementById("O");
const X_img = document.getElementById("X");
let isBotThinking = false;
function displayUnderscore(cur) {
    if (cur === "x") {
        chosen[0].style.display = "initial";
        chosen[1].style.display = "none";
        bot = "o";
    }
    else {
        chosen[0].style.display = "none";
        chosen[1].style.display = "initial";
        bot = "x";
    }
}
displayUnderscore("x");
function randMove(moves) {
    const entries = Array.from(moves.entries());
    const totalWeight = entries.reduce((sum, [_, weight]) => sum + weight, 0);
    const r = Math.random() * totalWeight;
    let cumulative = 0;
    for (const [value, weight] of entries) {
        cumulative += weight;
        if (r < cumulative) {
            possibleMoves.set(value, 0);
            return value;
        }
    }
}
const possibleMoves = new Map();
for (let i = 0; i < sizex*sizey; i++) {
    possibleMoves.set(i, 0);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function genPossibleMoves(playercell) {
    const index = parseInt(playercell.dataset.index);
    possibleMoves.set(index, 0);
    const deviation = [
        [0, 1], [0, -1], [-1, -1], [-1, 0], [-1, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    // console.log("index", index);
    for (let d of deviation) {
        let around = index + d[0]+d[1]*sizex
        // console.log(around);
        if (around < 0 || around > sizex*sizey) continue;
        if (cells[around].querySelector("img")) {
            possibleMoves.set(around, 0);
        }
        else {
            possibleMoves.set(around, 1);
        }
    }
}
async function botMove(firstime=false) {
    isBotThinking = true;
    showPlayerTurn.src = bot==="x"? "img/X.png": "img/O.png";
    const img = document.createElement("img");
    img.src = bot==="x"? "img/X.png": "img/O.png";
    let finalmove;
    /////////// edit later
    finalmove = randMove(possibleMoves);
    ///////////
    if (firstime) finalmove = centerindex;
    console.log("bot move", finalmove);
    await sleep(500);
    cells[finalmove].appendChild(img);
    showPlayerTurn.src = bot==="x"? "img/O.png": "img/X.png"
    isBotThinking = false;
    return finalmove;
}
X_img.addEventListener("click", () => {
    bot = "o";
    resetGame();
    possibleMoves.clear();
    displayUnderscore("x");
});
O_img.addEventListener("click", () => {
    bot = "x";
    resetGame();
    possibleMoves.clear();
    displayUnderscore("o");
    botMove(true);
});
document.getElementsByClassName("replay")[0].addEventListener("click", () => {
    if (bot==="x") botMove(true);
    possibleMoves.clear();
});

board.addEventListener("click", async (e) => {
    if (isGameOver()) return;
    if (isBotThinking) return;
    if (e.target.classList.contains("cell")) {
        if (e.target.querySelector("img")) return;
        const img = document.createElement("img");
        img.src = bot==="x"? "img/O.png": "img/X.png";
        e.target.appendChild(img);
        if (checkWin(e.target)) {
            setGameOver(true);
            turnHeader[0].innerHTML = "Bạn thắng";
            return;
        }
        if (checkFullBoard()) return;
        genPossibleMoves(e.target);
        let move = await botMove();
        if (checkWin(cells[move])) {
            setGameOver(true);
            turnHeader[0].innerHTML = "Bạn Thua";
            return;
        }
        if (checkFullBoard()) return;
    }
});