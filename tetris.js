//Set up canvas
var canvas = document.getElementById("canvas");
var GRID_WIDTH = 360;
var GRID_HEIGHT = 630;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;

var ctx = canvas.getContext("2d");

//Initalize variables
var BORDER = -2;
var COLS = 12;
var ROWS = 21;
var SQUARE_SIZE = 30;
var speed = 300
var startRow = 0;

var startCol = 3;
var active;
var grid = [];
var interval;
var right = { row: 0, col: 1 };
var left = { row: 0, col: -1 };
var down = { row: 1, col: 0 };

//Set up piece templates
var O = [
    [[0, -1], [0, 0], [1, -1], [1, 0]]
]

var I = [
    [[1, -2], [1, -1], [1, 0], [1, 1]],
    [[0, 0], [1, 0], [2, 0], [3, 0]]
]

var S= [
    [[0, 0], [0, 1], [1, 0], [1, -1]],
    [[1, 0], [0, 0], [1, 1], [2, 1]]
]

var Z = [
    [[0, 0], [0, -1], [1, 0], [1, 1]],
    [[1, 0], [0, 1], [2, 0], [1, 1]]
]

var L = [
    [[0, 0], [0, -1], [0, 1], [1, -1]],
    [[1, 0], [0, 0], [2, 0], [2, 1]],
    [[1, 0], [1, -1], [1, 1], [0, 1]],
    [[1, 0], [2, 0], [0, -1], [0, 0]]
]

var J = [
    [[0, 0], [0, -1], [0, 1], [1, 1]],
    [[1, 0], [2, 0], [0, 0], [0, 1]],
    [[1, 0], [0, -1], [1, -1], [1, 1]],
    [[1, 0], [2, -1], [2, 0], [0, 0]]
]

var T = [
    [[0, 0], [0, -1], [0, 1], [1, 0]],
    [[1, 0], [0, 0], [1, 1], [2, 0]],
    [[1, 0], [1, -1], [1, 1], [0, 0]],
    [[1, 0], [0, 0], [1, -1], [2, 0]]
]
//List of all piece templates
var pieces = [
    O,I, S, Z, L, J, T]
//List of each piece's color
var colors = ["#ffD500", "#00f1f5", "#08ff29", "#ff0808", "#ffbf00", "#0021b5", "#b000ad"];



class Piece {
    constructor(piece, o, location, color) {
        this.type = piece;
        this.orientation = o;
        this.location = location;
        this.color = color;
        this.pivot = { r: startRow, c: startCol };
    }
}
//Checks if piece can move and either spawns a new piece or ends game
function drop() {
if(move(down)==false){
if(active.pivot.r < 1) {
        setTimeout(gameEnd,100);
    }
    checkLines();
    setTimeout(spawnPiece,100);

}
}

function main() {

    initGrid();
    spawnPiece();
    drawBoard();
    interval = setInterval(drop,speed);

}
//Make every spot where active piece was empty
function undrawPiece() {
for (var i =0; i<active.location.length;i++){
      row = active.location[i][0];
        col = active.location[i][1];
         if( grid[row][col] !==  BORDER){


           ctx.fillStyle = "black";
            ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            ctx.strokeStyle = "white";
             ctx.strokeRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            grid[row][col] = -1;}
}
}

//End game
function gameEnd() {

    active = null;
    clearInterval(interval);
    alert("Game Over");
}

//Moves piece in specified direction if possible
function move(direction) {
    var row, col;
    var canMove = true;
    undrawPiece();
    for (var i = 0; i < active.location.length; i++) {

        row = active.location[i][0];
        col = active.location[i][1];
        row += direction.row;
        col += direction.col;
        if (grid[row][col] !==-1 || grid[row][col] === BORDER) {
            canMove = false;
        }
    }
    if (canMove) {
        for (var i = 0; i < active.location.length; i++) {
            active.location[i][0] += direction.row;
            active.location[i][1] += direction.col;
        }
        active.pivot.r += direction.row;
        active.pivot.c += direction.col;
    }
    piece2Grid();
    drawBoard();
    return canMove;
}
//Rotates active piece counterclockwise
function rotate() {

    var newOrient = active.orientation + 1;
    undrawPiece();

    if (newOrient >= active.type.length) {
        newOrient = 0;
    }
    var test = active.type[newOrient];
        for (var i = 0; i < test.length; i++) {
            active.location[i][0] =test[i][0] + active.pivot.r;
            active.location[i][1] = test[i][1] + active.pivot.c;
        }
    if (check(active.location)) {
            active.orientation = newOrient;

                }

    else {
            var orig = active.type[active.orientation];
            for (var i = 0; i < orig.length; i++) {
                 active.location[i][0] =orig[i][0] + active.pivot.r;
                 active.location[i][1] =orig[i][1] + active.pivot.c;
    }}
    piece2Grid();
    drawBoard();
    return false;
}
//Checks for user input
addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
             rotate();
            break;
        case 'ArrowDown':
            move(down);
            break;
        case 'ArrowLeft':
            move(left);
            break;
        case 'ArrowRight':
            move(right);
            break;

        case 'q':
            gameEnd();
            break;

        case 'r':
       //restart
        active = null;
        grid = [];
        clearInterval(interval);
            main();
            break;

    }
});

//Create a new piece in a random location at top
function spawnPiece() {

    var rand = Math.floor(Math.random() * (pieces.length));
    var type = pieces[rand];
    var o = Math.floor(Math.random() * type.length);
    var p = type[o];
    var location = [];
        var ranLoc = Math.floor(Math.random() * 7);
        startCol = 3+ranLoc;
    for (var i = 0; i < p.length; i++) {
        location[i] = new Array(2);
        location[i][0] = p[i][0] + startRow;
        location[i][1] = p[i][1] +startCol ;
    }
  var end = false;

active = new Piece(type,o,location,rand);
active = new Piece(type,o,location,rand);
    piece2Grid();



}
//Checks if location of piece would be empty or not
function check(piece) {
    var empty = true;
    var r, c;
    for (var i = 0; i < piece.length; i++) {
        r = piece[i][0];
        c = piece[i][1];
        if (grid[r][c] === BORDER || grid[r][c] !== -1) {
            empty = false;
        }
    }
    return empty;
}
//Places piece onto grid
function piece2Grid() {
    for (var i = 0; i < active.location.length; i++) {
        grid[active.location[i][0]][active.location[i][1]] = active.color;

    }
}


//Draws the grid
function drawBoard() {
    for (var r = 0; r < ROWS; r++) {
        for (var c = 1; c < COLS; c++) {
            if (grid[r][c] >= 0) {
                 ctx.fillStyle = colors[grid[r][c]];
                    ctx.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                    ctx.strokeStyle = "white";
                    ctx.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

//Checks if any lines are full
function checkLines(){
    for(var r = 0; r < ROWS - 1; r++){
        for(var c = 1; c < COLS - 1; c++){
            if(grid[r][c] === -1){
                break;
            }
            if(c === COLS - 2){
                clearLine(r);
            }
        }
    }
}
//Clears any full line
function clearLine(row){
    for(var c = 1; c < COLS - 1; c++){
        if(grid[row][c] !==  BORDER){
                  ctx.fillStyle = "black";
                    ctx.fillRect(c * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                    ctx.strokeStyle = "white";
                    ctx.strokeRect(c * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                    grid[row][c] = -1;}
    }
    for(var c = 1; c < COLS - 1; c++){
        for(var r = row; r > 0; r--){
            grid[r][c] = grid[r-1][c];
              if( grid[r-1][c] !==  BORDER){


                      ctx.fillStyle = "black";
                        ctx.fillRect(c * SQUARE_SIZE, (r-1) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                        ctx.strokeStyle = "white";
                        ctx.strokeRect(c * SQUARE_SIZE, (r-1) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                        grid[r-1][c] =-1;}
            drawBoard();
        }
    }
}

//Initialize the grid
function initGrid() {

    for (var row = 0; row < ROWS; row++) {
        grid[row] = new Array(COLS);
        for (var col = 0; col < COLS; col++) {
            grid[row][col] =-1;
            if (row === ROWS - 1 || col === 0 || col === COLS - 1) {
                grid[row][col] = BORDER;
            }
            else {
                    ctx.beginPath();
                    ctx.lineWidth = "1";

                    ctx.fillStyle="black";
                     ctx.fillRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
                    ctx.strokeStyle = "white"
                    ctx.strokeRect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            }
        }
    }
}

