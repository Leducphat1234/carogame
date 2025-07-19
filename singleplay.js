import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, winning, sizex, sizey,
    cells, resetGame, menu,
    switchPlayer, checkFullBoard,
    checkPlayer, checkWin
} from "./scripts.js";

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
function randrange(a, b) {
    return Math.floor(Math.random() * (b-a+1))+a;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function check3(curcell) {
    // let x_axis = parseInt(curcell.dataset.index % sizex);
    // let y_axis = parseInt(curcell.dataset.index / sizex);
    const curimg = curcell.querySelector("img");
    const index = parseInt(curcell.dataset.index);
    let cnt = 0, max_cnt = 0;
    // check row
    let left = Math.floor(index/sizex)*sizex, right = Math.floor(index/sizex+1)*sizex-1;
    for (let i = Math.max(left, index-3+1); i <= Math.min(right, index+3-1); i++) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= 3) {
        return true
    }
    // check column
    let top = index - left, bottom = index + sizex*(sizey - 1 - left/sizex);
    max_cnt = 0; cnt = 0;
    for (let i = Math.max(top, index-(3-1)*sizex); i <= Math.min(bottom, index+(3-1)*sizex); i+=sizex) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= 3) {
        return true
    }
    // check diagonal
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
    for (let i = Math.max(top_left, index-3-sizex*3); i <= Math.min(bottom_right, index+3+sizex*3); i+=sizex+1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= 3) {
        return true
    }
    for (let i = Math.max(top_right, index+3-sizex*3); i <= Math.min(bottom_left, index-3+sizex*3); i+=sizex-1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= 3) {
        return true
    }
}
async function botMove() {
    isBotThinking = true;
    showPlayerTurn.src = bot==="x"? "img/X.png": "img/O.png";
    const img = document.createElement("img");
    img.src = bot==="x"? "img/X.png": "img/O.png";
    let finalmove;
    // do {
    //     finalmove = randrange(0, sizex*sizey-1);
    // } while (cells[finalmove]?.querySelector("img"));
    await sleep(1000);
    cells[finalmove].appendChild(img);
    showPlayerTurn.src = bot==="x"? "img/O.png": "img/X.png"
    isBotThinking = false;
    return finalmove;
}
X_img.addEventListener("click", () => {
    bot = "o";
    resetGame();
    displayUnderscore("x");
});
O_img.addEventListener("click", () => {
    bot = "x";
    resetGame();
    displayUnderscore("o");
    botMove();
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
        let move = await botMove();
        if (checkWin(cells[move])) {
            setGameOver(true);
            turnHeader[0].innerHTML = "Bạn Thua";
            return;
        }
    }
});