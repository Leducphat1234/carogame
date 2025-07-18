import {isGameOver, setGameOver} from "./scripts.js"
// const imgplayer = document.getElementsByClassName("imgplayer");
const turnHeader = document.getElementsByClassName("turnHeader");
let turn = "x";
const board = document.getElementById("board");
const showPlayerTurn = document.getElementById("playerturn");
let winning = 5;
let sizex = 35, sizey = 35;
let cells = document.querySelectorAll('.cell');
function resetGame() {
    setGameOver(false);
    board.innerHTML = "";
    turn = "x";
    showPlayerTurn.src = "/img/X.png";
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
window.resetGame = resetGame;
resetGame();
board.addEventListener("click", (e) => {
    function checkWin(curcell) {
        // let x_axis = parseInt(curcell.dataset.index % sizex);
        // let y_axis = parseInt(curcell.dataset.index / sizex);
        const curimg = curcell.querySelector("img");
        const index = parseInt(curcell.dataset.index);
        let cnt = 0, max_cnt = 0;
        // check row
        let left = Math.floor(index/sizex)*sizex, right = Math.floor(index/sizex+1)*sizex-1;
        for (let i = Math.max(left, index-winning+1); i <= Math.min(right, index+winning-1); i++) {
            if (cells[i].querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
                cnt++;
                max_cnt = Math.max(max_cnt, cnt);
            }
            else {
                cnt = 0;
            }
        }
        if (max_cnt >= 5) {
            return true
        }
        // check column
        let top = index - left, bottom = index + sizex*(sizey - 1 - left/sizex);
        max_cnt = 0; cnt = 0;
        for (let i = Math.max(top, index-(winning-1)*sizex); i <= Math.min(bottom, index+(winning-1)*sizex); i+=sizex) {
            if (cells[i].querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
                cnt++;
                max_cnt = Math.max(max_cnt, cnt);
            }
            else {
                cnt = 0;
            }
        }
        if (max_cnt >= 5) {
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
            if (cells[i].querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
                cnt++;
                max_cnt = Math.max(max_cnt, cnt);
            }
            else {
                cnt = 0;
            }
        }
        if (max_cnt >= 5) {
            return true
        }
        for (let i = Math.max(top_right, index+winning-sizex*winning); i <= Math.min(bottom_left, index-winning+sizex*winning); i+=sizex-1) {
            console.log(i, cells[i].querySelector("img"), curimg, bottom_left);
            if (cells[i].querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
                cnt++;
                max_cnt = Math.max(max_cnt, cnt);
            }
            else {
                cnt = 0;
            }
        }
        if (max_cnt >= 5) {
            return true
        }
        return false;
    }
    if (isGameOver()) return;
    if (e.target.classList.contains("cell")) {
        if (e.target.querySelector("img")) return;
        const img = document.createElement("img");
        if (turn === "x") {
            img.src = "/img/X.png";
            img.alt = "x";
            e.target.appendChild(img);
            if (checkWin(e.target)) {
                // window.alert(turn + " wins");
                turnHeader[0].innerHTML = "Người thắng:&nbsp";
                setGameOver(true);
                return;
            }
            turn = "o";
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
            turn = "x";
            showPlayerTurn.src = "/img/X.png";
        }
        
    }
})