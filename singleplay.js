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
const possibleMoves = new Map();
function initMp() {
    for (let i = 0; i < sizex*sizey; i++) {
        possibleMoves.set(i, 0);
    }
}
initMp();
function checkThreat(curcell) {
    if (!curcell) return;
    const curimg = curcell.querySelector("img");
    if (!curimg) return;
    const index = parseInt(curcell.dataset.index);
    let cnt = 0;
    const distance = 5;
    let candidates = [];
    let p1, p2, p3;
    // check row
    let left = Math.floor(index/sizex)*sizex, right = Math.floor(index/sizex+1)*sizex-1;
    for (let i = Math.max(left, index-distance+1); i <= Math.min(right, index+distance-1); i++) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i-1;
            else if (cnt >= 3) p2=i+1;
        }
        else {
            if (cells[i]?.querySelector("img")) continue;
            if (cnt > 1 && cnt <= 3 && !p3) p3=i;
        }
    }
    if (cnt >= 3) {
        console.log("-",candidates, p1, p2, p3);
        // for (let idx of candidates) {
        //     if (cells[idx]?.querySelector("img")) possibleMoves.set(idx, 0);
        //     else possibleMoves.set(idx, 10);
        // }
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, 10+(cnt-2)*10);
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, 10+(cnt-2)*10);
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, 100);
        }
    }
    // check column
    let top = index - left, bottom = index + sizex*(sizey - 1 - left/sizex);
    cnt = 0;
    candidates = [];
    for (let i = Math.max(top, index-(distance-1)*sizex); i <= Math.min(bottom, index+(distance-1)*sizex); i+=sizex) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i-sizex;
            else if (cnt >= 3) p2=i+sizex;
        }
        else {
            if (cells[i]?.querySelector("img")) continue;
            if (cnt > 1 && cnt <= 3 && !p3) p3=i;
        }
    }
    if (cnt >= 3) {
        console.log("|", candidates, p1, p2, p3);
        // for (let idx of candidates) {
        //     if (cells[idx]?.querySelector("img")) possibleMoves.set(idx, 0);
        //     else possibleMoves.set(idx, 10);
        // }
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, 10+(cnt-2)*10);
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, 10+(cnt-2)*10);
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, 100);
        }
    }
    // check diagonal
    candidates = [];
    cnt = 0;
    let lentop = Math.floor(index/sizex), lenleft = index-left,
        lenbottom = sizey-Math.floor(index/sizex), lenright = sizex-(index-left);
    let lentopleft = Math.min(lentop, lenleft),
        lentopright = Math.min(lentop, lenright),
        lenbottomleft = Math.min(lenbottom, lenleft),
        lenbottomright = Math.min(lenbottom, lenright);
    let top_left = index - lentopleft - sizex*lentopleft,
        top_right = index + lentopright - sizex*lentopright,
        bottom_left = index - lenbottomleft + sizex*lenbottomleft,
        bottom_right = index + lenbottomright + sizex*lenbottomright;
    for (let i = Math.max(top_left, index-distance-sizex*distance); i <= Math.min(bottom_right, index+distance+sizex*distance); i+=sizex+1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i-1-sizex;
            else if (cnt >= 3) p2=i+1+sizex;
        }
        else {
            if (cells[i]?.querySelector("img")) continue;
            if (cnt > 1 && cnt <= 3 && !p3) p3=i;
        }
    }
    if (cnt >= 3) {
        console.log("\\", candidates, p1, p2, p3);
        // for (let idx of candidates) {
        //     if (cells[idx]?.querySelector("img")) possibleMoves.set(idx, 0);
        //     else possibleMoves.set(idx, 10);
        // }
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, 10+(cnt-2)*10);
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, 10+(cnt-2)*10);
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, 100);
        }
    }

    candidates = [];
    cnt = 0;
    for (let i = Math.max(top_right, index+distance-sizex*distance); i <= Math.min(bottom_left, index-distance+sizex*distance); i+=sizex-1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i+1-sizex;
            else if (cnt >= 3) p2=i-1+sizex;
        }
        else {
            if (cells[i]?.querySelector("img")) continue;
            if (cnt > 1 && cnt <= 3 && !p3) p3=i;
        }
    }
    if (cnt >= 3) {
        console.log("/", candidates, p1, p2, p3);
        // for (let idx of candidates) {
        //     if (cells[idx]?.querySelector("img")) possibleMoves.set(idx, 0);
        //     else possibleMoves.set(idx, 10);
        // }
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, 10+(cnt-2)*10);
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, 10+(cnt-2)*10);
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, 100);
        }
    }
}
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
    return null;
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
    initMp();
    displayUnderscore("x");
});
O_img.addEventListener("click", () => {
    bot = "x";
    resetGame();
    initMp();
    displayUnderscore("o");
    botMove(true);
});
document.getElementsByClassName("replay")[0].addEventListener("click", () => {
    initMp();
    if (bot==="x") botMove(true);
});
let move = -1;
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
        checkThreat(e.target);
        checkThreat(cells[move]);
        move = await botMove();
        if (checkWin(cells[move])) {
            setGameOver(true);
            turnHeader[0].innerHTML = "Bạn Thua";
            return;
        }
        if (checkFullBoard()) return;
        genPossibleMoves(cells[move]);
        console.log(possibleMoves);
    }
});