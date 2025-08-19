export const menu = document.getElementById("menu");
export const turnHeader = document.getElementsByClassName("turnHeader");
export const board = document.getElementById("board");
export const showPlayerTurn = document.getElementById("playerturn");
export let winning_dis = 5;
export let sizex = 35, sizey = 25;
export let cells = document.querySelectorAll('.cell');
export let cntmove = 0;
export let centerindex = Math.floor(sizey / 2) * sizex + Math.floor(sizex / 2);
let gameOver = false;
export let turn = "x";
export let isFullBoard = false;
export const moveSound = new Audio("audio/move.mp3");


export function resetGame() {
    setGameOver(false);
    board.innerHTML = "";
    isFullBoard = false;
    cntmove = 0;
    turn = "x";
    showPlayerTurn.src = "./img/X.png";
    board.style.gridTemplateColumns = `repeat(${sizex}, 40px)`;
    board.style.gridTemplateRows = `repeat(${sizey}, 40px)`;
    for (let i = 0; i < sizex*sizey; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        if (i === centerindex) cell.id = "center-cell";
        board.appendChild(cell);
    }
    turnHeader[0].innerHTML = "Đến lượt:";
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

function mark(arr) {
    for (let i of arr) {
        cells[i].style.backgroundColor = "orange";
    }
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
    const curimg = curcell.querySelector("img");
    const index = parseInt(curcell.dataset.index);
    let cnt = 0, max_cnt = 0;
    const left = Math.floor(index/sizex)*sizex, right = Math.floor(index/sizex+1)*sizex-1;
    const top = index - left, bottom = index + sizex*(sizey - 1 - left/sizex);
    const lentop = Math.floor(index/sizex), lenleft = index-left,
        lenbottom = sizey-Math.floor(index/sizex), lenright = sizex-(index-left);
    const lentopleft = Math.min(lentop, lenleft),
        lentopright = Math.min(lentop, lenright),
        lenbottomleft = Math.min(lenbottom, lenleft),
        lenbottomright = Math.min(lenbottom, lenright);
    const top_left = index - lentopleft - sizex*lentopleft,
        top_right = index + lentopright - sizex*lentopright,
        bottom_left = index - lenbottomleft + sizex*lenbottomleft,
        bottom_right = index + lenbottomright + sizex*lenbottomright;
    // check row
    let candidates = [];
    for (let i = Math.max(left, index-winning_dis+1); i <= Math.min(right, index+winning_dis-1); i++) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
            candidates.push(i);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning_dis) {
        mark(candidates);
        return true;
    }
    // check column
    candidates = [];
    max_cnt = 0; cnt = 0;
    for (let i = Math.max(top, index-(winning_dis-1)*sizex); i <= Math.min(bottom, index+(winning_dis-1)*sizex); i+=sizex) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
            candidates.push(i);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning_dis) {
        mark(candidates);
        return true;
    }
    // check diagonal \
    candidates = [];
    for (let i = Math.max(top_left, index-winning_dis-sizex*winning_dis); i <= Math.min(bottom_right, index+winning_dis+sizex*winning_dis); i+=sizex+1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
            candidates.push(i);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning_dis) {
        mark(candidates);
        return true;
    }
    // check diagonal /
    candidates = [];
    for (let i = Math.max(top_right, index+winning_dis-sizex*winning_dis); i <= Math.min(bottom_left, index-winning_dis+sizex*winning_dis); i+=sizex-1) {
        // console.log(i, cells[i].querySelector("img"), curimg, bottom_left);
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            max_cnt = Math.max(max_cnt, cnt);
            candidates.push(i);
        }
        else {
            cnt = 0;
        }
    }
    if (max_cnt >= winning_dis) {
        mark(candidates);
        return true;
    }
    return false;
}

export function scroll(cell) {
      if (cell) {
        cell.scrollIntoView({
          behavior: 'instant',
          block: 'center',
          inline: 'center'
        });
      }
    };
