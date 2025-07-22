import {isGameOver, setGameOver, turnHeader,
    board, showPlayerTurn, sizex, sizey,
    cells, resetGame, menu, moveSound,
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
    subPoss = [];
    subPossSelf = [];
}
initMp();
function checkThreat(curcell, opponent=0) {
    if (!curcell) return [undefined, undefined, undefined, 0];
    const curimg = curcell.querySelector("img");
    if (!curimg) return [undefined, undefined, undefined, 0];
    const index = parseInt(curcell.dataset.index);
    let cnt = 0;
    const distance = 4;
    let p1, p2, p3, p1f, p2f, p3f;
    let blocked = false;
    let half_block = false;
    let max_cnt = 0;
    let possibility = 0;
    // check row
    let left = Math.floor(index/sizex)*sizex, right = Math.floor(index/sizex+1)*sizex-1;
    for (let i = Math.max(left, index-distance+1); i <= Math.min(right, index+distance-1); i++) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i-1;
            else if (cnt >= 3) p2=i+1;
            if (p1 && (p1 < 0 || p1 > sizex*sizey-1)) p1=i;
            if (p2 && (p2 < 0 || p2 > sizex*sizey-1)) p2=i;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            if (cells[i]?.querySelector("img")) {
                if (p2 && i != p2 && cnt < 4) blocked=true;
                max_cnt = Math.max(max_cnt, cnt); cnt = 0;
                if (i === p1 || i === p2) half_block=true;
                continue;
            }
            if (cnt >= 1 && cnt <= 3 && p3==undefined && !blocked) p3=i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
    if (cells[p1]?.querySelector("img").src !== curimg.src && cells[p2]?.querySelector("img").src !== curimg.src) blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("-",(opponent>0? "opponent":""), p1, p2, p3);
        initMp();
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30+(max_cnt-3)*1000 - (half_block? 25: 0);
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, Math.max(0, possibility));
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, Math.max(0, possibility));
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, Math.max(0, possibility));
        }
    }
    // check column
    let top = index - left, bottom = index + sizex*(sizey - 1 - left/sizex);
    p3 = undefined;
    blocked = false;
    half_block = false;
    cnt = 0;
    max_cnt = 0;
    for (let i = Math.max(top, index-(distance-1)*sizex); i <= Math.min(bottom, index+(distance-1)*sizex); i+=sizex) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i-sizex;
            else if (cnt >= 3) p2=i+sizex;
            if (p1 && (p1 < 0 || p1 > sizex*sizey-1)) p1=i;
            if (p2 && (p2 < 0 || p2 > sizex*sizey-1)) p2=i;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            if (cells[i]?.querySelector("img")) {
                if (p2 && i != p2 && cnt < 4) blocked=true;
                max_cnt = Math.max(max_cnt, cnt); cnt = 0;
                if (i === p1 || i === p2) half_block=true;
                continue;
            }
            if (cnt >= 1 && cnt <= 3 && p3==undefined && !blocked) p3=i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
        if (cells[p1].querySelector("img").src !== curimg.src && cells[p2].querySelector("img").src !== curimg.src)
            blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("|", (opponent>0? "opponent":""), p1, p2, p3);
        initMp();
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30+(max_cnt-3)*1000 - (half_block? 25: 0);
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, Math.max(0, possibility));
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, Math.max(0, possibility));
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, Math.max(0, possibility));
        }
    }
    // check diagonal
    cnt = 0;
    p3 = undefined;
    blocked = false;
    half_block = false;
    max_cnt = 0;
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
            if (p1 && (p1 < 0 || p1 > sizex*sizey-1)) p1=i;
            if (p2 && (p2 < 0 || p2 > sizex*sizey-1)) p2=i;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            if (cells[i]?.querySelector("img")) {
                if (p2 && i != p2 && cnt < 4) blocked=true;
                max_cnt = Math.max(max_cnt, cnt); cnt = 0;
                if (i === p1 || i === p2) half_block=true;
                continue;
            }
            if (cnt >= 1 && cnt <= 3 && p3==undefined && !blocked) p3=i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
    if (cells[p1]?.querySelector("img").src !== curimg.src && cells[p2]?.querySelector("img").src !== curimg.src) blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("\\", (opponent>0? "opponent":""), p1, p2, p3);
        p1f = p1; p2f = p2; p3f = p3;
        initMp();
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30+(max_cnt-3)*1000 - (half_block? 25: 0);
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, Math.max(0, possibility));
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, Math.max(0, possibility));
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, Math.max(0, possibility));
        }
    }

    cnt = 0;
    p3 = undefined;
    blocked = false;
    half_block = false;
    max_cnt = 0;
    for (let i = Math.max(top_right, index+distance-sizex*distance); i <= Math.min(bottom_left, index-distance+sizex*distance); i+=sizex-1) {
        if (cells[i]?.querySelector("img") && cells[i].querySelector("img").src === curimg.src) {
            cnt++;
            if (cnt===1) p1=i+1-sizex;
            else if (cnt >= 3) p2=i-1+sizex;
            if (p1 && (p1 < 0 || p1 > sizex*sizey-1)) p1=i;
            if (p2 && (p2 < 0 || p2 > sizex*sizey-1)) p2=i;
            max_cnt = Math.max(max_cnt, cnt);
        }
        else {
            if (cells[i]?.querySelector("img")) {
                if (p2 && i != p2 && cnt < 4) blocked=true;
                max_cnt = Math.max(max_cnt, cnt); cnt = 0;
                if (i === p1 || i === p2) half_block=true;
                continue;
            }
            if (cnt >= 1 && cnt <= 3 && p3==undefined && !blocked) p3=i;
        }
    }
    if (cells[p1]?.querySelector("img") && cells[p2]?.querySelector("img"))
    if (cells[p1]?.querySelector("img").src !== curimg.src && cells[p2]?.querySelector("img").src !== curimg.src) blocked = true;
    if (max_cnt >= 3 && !blocked) {
        console.log("/", (opponent>0? "opponent":""), p1, p2, p3);
        p1f = p1; p2f = p2; p3f = p3;
        initMp();
        p1f = p1; p2f = p2; p3f = p3;
        possibility = 30+(max_cnt-3)*1000 - (half_block? 25: 0);
        if (cells[p1]?.querySelector("img")) possibleMoves.set(p1, 0);
        else possibleMoves.set(p1, Math.max(0, possibility));
        if (cells[p2]?.querySelector("img")) possibleMoves.set(p2, 0);
        else possibleMoves.set(p2, Math.max(0, possibility));
        if (p3) {
            if (cells[p3]?.querySelector("img")) possibleMoves.set(p3, 0);
            else possibleMoves.set(p3, Math.max(0, possibility));
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
        cumulative += weight;
        if (cells[value]?.querySelector("img")) {
            possibleMoves.set(parseInt(value), 0);
        }
        else if (r < cumulative) {
            console.log("random",value,weight);
            possibleMoves.set(parseInt(value), 0);
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
    showPlayerTurn.src = bot==="x"? "img/X.png": "img/O.png";
    const img = document.createElement("img");
    img.src = bot==="x"? "./img/X.png": "./img/O.png";
    let finalmove;

    do finalmove = randMove();
    while (!finalmove);
    if (firstime) finalmove = centerindex;
    console.log("bot move", finalmove);
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
                    possibleMoves.set(p[i], Math.max(p[p.length-1], possibleMoves.get(p[i])));
                    console.log("threat1", i,p[i], possibleMoves.get(p[i]));
                }
                else p.splice(i, 1);
            }
        }
        for (let p of subPossSelf) {
            for (let i = 0; i < p.length-1; i++) {
                if (p[i]) {
                    possibleMoves.set(p[i], Math.max(p[p.length-1], possibleMoves.get(p[i])));
                    console.log("threat2", i,p[i], possibleMoves.get(p[i]));
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
