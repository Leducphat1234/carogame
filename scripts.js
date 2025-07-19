export const menu = document.getElementById("menu");
export const turnHeader = document.getElementsByClassName("turnHeader");
export const board = document.getElementById("board");
export const showPlayerTurn = document.getElementById("playerturn");
export let winning = 5;
export let sizex = 25, sizey = 25;
export let cells = document.querySelectorAll('.cell');
export let cntmove = 0;
let gameOver = false;
let turn = "x";
let isFullBoard = false;

export function resetGame() {
    setGameOver(false);
    board.innerHTML = "";
    isFullBoard = false;
    cntmove = 0;
    turn = "x";
    showPlayerTurn.src = "img/X.png";
    board.style.gridTemplateColumns = `repeat(${sizex}, 40px)`;
    board.style.gridTemplateRows = `repeat(${sizey}, 40px)`;
    for (let i = 0; i < sizex*sizey; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        board.appendChild(cell);
    }
    turnHeader[0].innerHTML = "Đến lượt:&nbsp";
    cells = document.querySelectorAll('.cell');
}
export function isGameOver() {
    return gameOver;
}
export function checkFullBoard() {
    return isFullBoard;
}
export function setGameOver(status) {
    gameOver = status;
}
export function switchPlayer() {
    turn = (turn === "x"? "o": "x");
}
export function checkPlayer(who) {
    return turn === who;
}
export function checkWin(curcell) {
    cntmove++;
    if (cntmove >= sizex*sizey) {
        showPlayerTurn.style.display = "none";
        turnHeader[0].innerHTML = "Hòa";
        isFullBoard = true;
        setGameOver(true);
        return false;
    }
    // let x_axis = parseInt(curcell.dataset.index % sizex);
    // let y_axis = parseInt(curcell.dataset.index / sizex);
    const curimg = curcell.querySelector("img");
    const index = parseInt(curcell.dataset.index);
    let cnt = 0, max_cnt = 0;
    // check row
    let left = Math.floor(index/sizex)*sizex, right = Math.floor(index/sizex+1)*sizex-1;
    for (let i = Math.max(left, index-winning+1); i <= Math.min(right, index+winning-1); i++) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning) {
        return true
    }
    // check column
    let top = index - left, bottom = index + sizex*(sizey - 1 - left/sizex);
    max_cnt = 0; cnt = 0;
    for (let i = Math.max(top, index-(winning-1)*sizex); i <= Math.min(bottom, index+(winning-1)*sizex); i+=sizex) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning) {
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
    for (let i = Math.max(top_left, index-winning-sizex*winning); i <= Math.min(bottom_right, index+winning+sizex*winning); i+=sizex+1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning) {
        return true
    }
    for (let i = Math.max(top_right, index+winning-sizex*winning); i <= Math.min(bottom_left, index-winning+sizex*winning); i+=sizex-1) {
        // console.log(i, cells[i].querySelector("img"), curimg, bottom_left);
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning) {
        return true
    }
    return false;
}