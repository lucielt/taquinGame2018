var button = document.getElementById('button');
var canvas = document.getElementById("puzzle");
var context = canvas.getContext("2d");
var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
};

/* CANVAS SIZE */

function canvasSize(){
    if (size.width < size.height){
        canvas.height = size.width * 0.75;
        canvas.width = canvas.height;
    } else {
        canvas.height = size.height * 0.75;
        canvas.width = canvas.height;
    }
}
canvasSize();

/* PUZZLE */

var boardSize = canvas.width;
var random = Math.floor((Math.random() * 2));
var tileCount = 2;
var tileSize = boardSize / tileCount;
var boardParts = {};
var clickLoc = {
    x: 0,
    y: 0,
};
var emptyLoc = {
    x: 0,
    y: 0,
};
var solved = false;

function setBoard() {
    boardParts =[];
    for (var raw = 0; raw < tileCount; ++raw) {
        boardParts[raw] = [];
        for (var column = 0; column < tileCount; ++column) {
            boardParts[raw][column] = {
                x: (tileCount - 1) - raw,
                y: (tileCount - 1) - column,
            };
            // remplacer l'attribution de x2 et y2 par une fonction random qui
            // check si le nombre a déjà été attribué ou s'il est égal à x / y
        }
        console.log(boardParts);
    }

    // emptyLoc.x = boardParts[tileCount - 1][tileCount - 1].x;
    // emptyLoc.y = boardParts[tileCount - 1][tileCount - 1].y;

    emptyLoc.x = boardParts[random][random].x;
    emptyLoc.y = boardParts[random][random].y;
    console.log("setBoard emptyTile" + emptyLoc.x + " " + emptyLoc.y);
    solved = false;
}
function drawTiles() {
    // Remove this line from here and move it to the onclick function to avoid
    // blank frame cause by the reset of the canvas context at each loop
    // context.clearRect ( 0 , 0 , boardSize , boardSize );
    for (var raw = 0; raw < tileCount; ++raw) {
        for (var column = 0; column < tileCount; ++column) {
            var x = boardParts[raw][column].x;
            var y = boardParts[raw][column].y;
            if (raw !== emptyLoc.x || column !== emptyLoc.y || solved) {
                context.drawImage(
                    video,
                    x * tileSize * ratio,
                    y * tileSize * ratio,
                    tileSize * ratio ,
                    tileSize * ratio,
                    raw * tileSize,
                    column * tileSize,
                    tileSize,
                    tileSize
                );
            }
        }
    }
    // setTimeout(drawTiles, 1000 / 30);
}

function distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function slideTile(toLoc, fromLoc) {
    if (!solved) {
        var initialX = boardParts[toLoc.x][toLoc.y].x;
        var initialY = boardParts[toLoc.x][toLoc.y].y;
        boardParts[toLoc.x][toLoc.y].x = boardParts[fromLoc.x][fromLoc.y].x;
        boardParts[toLoc.x][toLoc.y].y = boardParts[fromLoc.x][fromLoc.y].y;
        boardParts[fromLoc.x][fromLoc.y].x = initialX;
        boardParts[fromLoc.x][fromLoc.y].y = initialY;
        console.log("new boardpart new loc " + boardParts[toLoc.x][toLoc.y].x + " " + boardParts[toLoc.x][toLoc.y].y);
        console.log(" new boardpart new empty - click" + boardParts[fromLoc.x][fromLoc.y].x + " " + boardParts[fromLoc.x][fromLoc.y].y);
        toLoc.x = fromLoc.x;
        toLoc.y = fromLoc.y;
        checkSolved();
    }
}

function checkSolved() {
    solved = true;
    // console.log("result", boardParts);

    for (var raw = 0; raw < tileCount; ++raw) {
        for (var column = 0; column < tileCount; ++column) {
            if (boardParts[raw][column].x != raw || boardParts[raw][column].y != column) {
                solved = false;
            }
        }
    }
}

// redrw puzzle on resize - for now on scale //
// document.getElementById('scale').onchange = function() {
// tileCount = this.value;
// tileSize = boardSize / tileCount;
// setBoard();
// drawTiles();
// };

// Track mouse movement
canvas.addEventListener('mousemove', function(e) {
    clickLoc.x = Math.floor((e.pageX - this.offsetLeft) / tileSize);
    clickLoc.y = Math.floor((e.pageY - this.offsetTop) / tileSize);
});

// Track mouse movement
canvas.addEventListener('click', function() {
    if (distance(clickLoc.x, clickLoc.y, emptyLoc.x, emptyLoc.y) === 1) {
        console.log("emptyTile" + emptyLoc.x + " " + emptyLoc.y);
        console.log("click" + clickLoc.x + " " + clickLoc.y);
        slideTile(emptyLoc, clickLoc);
        // resets the entire context of the canvas before re-draw tiles
        // at new position
        context.clearRect ( 0 , 0 , boardSize , boardSize );
        drawTiles();
    }
    if (solved) {
        setTimeout(function() {alert("You solved it!");}, 500);
    }
});

// Button to toggle video on/off
button.addEventListener('click', function() {
    console.log(button.value);
    if (button.value == "Pause") {
        video.pause();
        button.value = "Play";
        button.innnerHTML = button.textContent = "Play";
    } else {
        video.play();
        button.value = "Pause";
        button.innnerHTML = button.textContent = "Pause";
    }
});

var video = document.createElement("video");
video.autoplay = true;
video.loop = true;
video.src = 'image/perso_02.mp4';
video.width = 1080;
video.height = 1080;
var ratio = video.width/canvas.width;
video.addEventListener('canplay', drawTiles, false);

setBoard();
