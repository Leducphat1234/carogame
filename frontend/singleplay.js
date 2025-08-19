import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, sizex, sizey,
    cells, resetGame, menu, moveSound,
    switchPlayer, checkFullBoard,
    checkPlayer, checkWin,
    centerindex,
    cntmove,
    isFullBoard,
    turn, scroll
} from "./scripts.js";

window.resetGame = resetGame;
resetGame();
window.onload = scroll(document.getElementById("center-cell"));
const chosen = document.getElementsByClassName("chosen");
// const choice = document.getElementsByClassName("choice");
let bot = "o";
const O_img = document.getElementById("O");
const X_img = document.getElementById("X");
let isBotThinking = false;
moveSound.preload = "auto";
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
let move = -1, subPoss = [], subPossSelf = [];
window.possibleMoves = possibleMoves;
function initMp() {
    for (let i = 0; i < sizex*sizey; i++) {
        possibleMoves.set(i, 0);
    }
}
initMp();
function checkThreat(curcell) {
    if (!curcell) return [undefined, undefined, undefined, 0];
    const curimg = curcell.querySelector("img");
    if (!curimg) return [undefined, undefined, undefined, 0];
    const index = parseInt(curcell.dataset.index);
    let cnt = 0;
    const distance = 5;
    let p1, p2, p3, p1f, p2f, p3f;
    let blocked = false;
    let half_block = false;
    let max_cnt = 0;
    let possibility = 0;
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
    
    // === CHECK ROW ===
    for (let i = Math.max(left, index-distance+1); i <= Math.min(right, index+distance-1); i++) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
        cnt++;
        if (cnt === 1) p1 = i - 1;
        else if (cnt >= 3) p2 = i + 1;
        max_cnt = Math.max(max_cnt, cnt);
        } else {
        if (cells[i]?.querySelector("img")) {
            if (p2 && i !== p2 && cnt < 4) blocked = true;
            if (i === p1 || i === p2) half_block = true;
            cnt = 0;
            continue;
        }
        if (cnt >= 1 && cnt <= 3 && p3 === undefined && !blocked) p3 = i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
        if (cells[p1].querySelector("img").src !== curimg.src && cells[p2].querySelector("img").src !== curimg.src)
        blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("get", "-");
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30 + (max_cnt - 3) * 1000 - (half_block ? 500 : 0);
        for (let pos of [p1, p2, p3]) {
        if (pos !== undefined && !cells[pos]?.querySelector("img")) {
            possibleMoves.set(pos, Math.max(possibleMoves.get(pos) || 0, possibility));
        }
        }
    }

    // === CHECK COLUMN ===
    cnt = 0; p3 = undefined; blocked = false; half_block = false; max_cnt = 0;
    for (let i = Math.max(top, index-(distance-1)*sizex); i <= Math.min(bottom, index+(distance-1)*sizex); i+=sizex) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
        cnt++;
        if (cnt === 1) p1 = i - sizex;
        else if (cnt >= 3) p2 = i + sizex;
        max_cnt = Math.max(max_cnt, cnt);
        } else {
        if (cells[i]?.querySelector("img")) {
            if (p2 && i !== p2 && cnt < 4) blocked = true;
            if (i === p1 || i === p2) half_block = true;
            cnt = 0;
            continue;
        }
        if (cnt >= 1 && cnt <= 3 && p3 === undefined && !blocked) p3 = i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
        if (cells[p1].querySelector("img").src !== curimg.src && cells[p2].querySelector("img").src !== curimg.src)
        blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("get", "|");
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30 + (max_cnt - 3) * 1000 - (half_block ? 500 : 0);
        for (let pos of [p1, p2, p3]) {
        if (pos !== undefined && !cells[pos]?.querySelector("img")) {
            possibleMoves.set(pos, Math.max(possibleMoves.get(pos) || 0, possibility));
        }
        }
    }

    // === CHECK DIAGONAL \ ===
    cnt = 0; p3 = undefined; blocked = false; half_block = false; max_cnt = 0;
    for (let i = Math.max(top_left, index-distance-sizex*distance); i <= Math.min(bottom_right, index+distance+sizex*distance); i+=sizex+1) {
        if (i < 0 || i >= sizex * sizey) continue;
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
        cnt++;
        if (cnt === 1) p1 = i - (sizex + 1);
        else if (cnt >= 3) p2 = i + (sizex + 1);
        max_cnt = Math.max(max_cnt, cnt);
        } else {
        if (cells[i]?.querySelector("img")) {
            if (p2 && i !== p2 && cnt < 4) blocked = true;
            if (i === p1 || i === p2) half_block = true;
            cnt = 0;
            continue;
        }
        if (cnt >= 1 && cnt <= 3 && p3 === undefined && !blocked) p3 = i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
        if (cells[p1].querySelector("img").src !== curimg.src && cells[p2].querySelector("img").src !== curimg.src)
        blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("get", "\\");
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30 + (max_cnt - 3) * 1000 - (half_block ? 500 : 0);
        for (let pos of [p1, p2, p3]) {
        if (pos !== undefined && !cells[pos]?.querySelector("img")) {
            possibleMoves.set(pos, Math.max(possibleMoves.get(pos) || 0, possibility));
        }
        }
    }

    // === CHECK DIAGONAL / ===
    cnt = 0; p3 = undefined; blocked = false; half_block = false; max_cnt = 0;
    for (let i = Math.max(top_right, index+distance-sizex*distance); i <= Math.min(bottom_left, index-distance+sizex*distance); i+=sizex-1) {
        if (i < 0 || i >= sizex * sizey) continue;
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
        cnt++;
        if (cnt === 1) p1 = i - (sizex - 1);
        else if (cnt >= 3) p2 = i + (sizex - 1);
        max_cnt = Math.max(max_cnt, cnt);
        } else {
        if (cells[i]?.querySelector("img")) {
            if (p2 && i !== p2 && cnt < 4) blocked = true;
            if (i === p1 || i === p2) half_block = true;
            cnt = 0;
            continue;
        }
        if (cnt >= 1 && cnt <= 3 && p3 === undefined && !blocked) p3 = i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
        if (cells[p1].querySelector("img").src !== curimg.src && cells[p2].querySelector("img").src !== curimg.src)
        blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("get", "/");
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30 + (max_cnt - 3) * 1000 - (half_block ? 500 : 0);
        for (let pos of [p1, p2, p3]) {
        if (pos !== undefined && !cells[pos]?.querySelector("img")) {
            possibleMoves.set(pos, Math.max(possibleMoves.get(pos) || 0, possibility));
        }
        }
    }

    return [p1f, p2f, p3f, possibility];
}

function randMove() {
    const entries = Array.from(possibleMoves.entries());
    const totalWeight = entries.reduce((sum, [_, weight]) => sum + weight, 0);
    const r = Math.random() * totalWeight;
    let cumulative = 0;
    for (const [value, weight] of entries) {
        if (weight === 0) continue;
        if (cells[value]?.querySelector("img")) {
            possibleMoves.set(parseInt(value), 0);
            continue;
        }
        else if (r < cumulative + weight) {
            console.log("random",value,weight);
            possibleMoves.set(parseInt(value), 0);
            return parseInt(value);
        }
        cumulative += weight;
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
        let around = index + d[0]+d[1]*sizex;
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
    showPlayerTurn.src = bot==="x"? "./img/X.png": "./img/O.png";
    const img = document.createElement("img");
    img.src = bot==="x"? "./img/X.png": "./img/O.png";
    let finalmove;

    if (firstime) finalmove = centerindex;
    else {
        do {
            finalmove = randMove();
        } while (!finalmove);
    }
    console.log("bot move", finalmove);
    possibleMoves.set(finalmove, 0);
    await sleep(1000);
    moveSound.play();
    cells[finalmove].appendChild(img);
    showPlayerTurn.src = bot==="x"? "./img/O.png": "./img/X.png"
    isBotThinking = false;
    return finalmove;
}
X_img.addEventListener("click", () => {
    bot = "o";
    resetGame();
    initMp();
    subPoss = [];
    subPossSelf = [];
    displayUnderscore("x");
});
O_img.addEventListener("click", () => {
    bot = "x";
    resetGame();
    initMp();
    subPoss = [];
    subPossSelf = [];
    displayUnderscore("o");
    botMove(true);
});
document.getElementsByClassName("replay")[0].addEventListener("click", () => {
    initMp();
    subPoss = [];
    subPossSelf = [];
    if (bot==="x") botMove(true);
});
board.addEventListener("click", async (e) => {
    if (isGameOver()) return;
    if (isBotThinking) return;
    if (e.target.classList.contains("cell")) {
        if (e.target.querySelector("img")) return;
        const img = document.createElement("img");
        img.src = bot==="x"? "./img/O.png": "./img/X.png";
        e.target.appendChild(img);
        moveSound.play();
        console.log(cntmove,"-----------")
        console.log("player move", parseInt(e.target.dataset.index));
        possibleMoves.set(parseInt(e.target.dataset.index), 0);
        if (checkWin(e.target)) {
            setGameOver(true);
            turnHeader[0].innerHTML = "Bạn thắng";
            return;
        }
        if (checkFullBoard()) return;
        genPossibleMoves(e.target);
        subPoss.push(checkThreat(e.target));
        subPossSelf.push(checkThreat(cells[move]));
        for (let p of subPoss) {
            for (let i = 0; i < p.length-1; i++) {
                if (p[i]) {
                    if (cells[p[i]].querySelector("img") === null)
                        possibleMoves.set(p[i], Math.max(p[p.length-1], possibleMoves.get(p[i])));
                    console.log("threat", i,p[i], possibleMoves.get(p[i]));
                }
                else p.splice(i, 1);
            }
        }
        for (let p of subPossSelf) {
            for (let i = 0; i < p.length-1; i++) {
                if (p[i]) {
                    if (cells[p[i]].querySelector("img") === null)
                        possibleMoves.set(p[i], Math.max(p[p.length-1], possibleMoves.get(p[i])));
                    console.log("oppoturnity", i,p[i], possibleMoves.get(p[i]));
                }
                else p.splice(i, 1);
            }
        }
        move = await botMove();
        let i = 0;
        while (i < subPoss.length) {
            if (subPoss[i].length < 1) subPoss.splice(i, 1);
            else i++;
        }
        while (i < subPossSelf.length) {
            if (subPossSelf[i].length < 1) subPossSelf.splice(i, 1);
            else i++;
        }
        if (checkWin(cells[move])) {
            setGameOver(true);
            turnHeader[0].innerHTML = "Bạn Thua";
            return;
        }
        if (checkFullBoard()) return;
        genPossibleMoves(cells[move]);
        // console.log(possibleMoves);
    }
});
