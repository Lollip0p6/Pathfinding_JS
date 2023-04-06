function Tile() {
    this.fromx = 0,
    this.fromy = 0,
    this.g_cost = 0,
    this.h_cost = 0,
    this.f_cost = 0,
    this.fp = false,
    this.type = 'g',
    this.list = 'v'
}

let Tile2 = {
    fromx: 0,
    fromy: 0,
    g_cost: 0,
    h_cost: 0,
    f_cost: 0,
    fp: false,
    type: 'g',
    list: 'v'
}

class Tile3 {
    constructor(fromx, fromy, g_cost, h_cost, f_cost, fp, type, list){
        this.fromx = 0,
        this.fromy = 0,
        this.g_cost = 0,
        this.h_cost = 0,
        this.f_cost = 0,
        this.fp = false,
        this.type = 'g',
        this.list = 'v'
    }
}

function calc_cost(startx, starty, finishx, finishy){
    var dx, dy;
    dx = Math.abs(startx - finishx);
    dy = Math.abs(starty - finishy);
    return 10 * (dx + dy) + (14 - 2 * 10) * Math.min(dx, dy);
}


function is_inside_grid(cx, cy, h, w){
    return  cx < w && cy < h && cx >= 0 && cy >= 0;
}
function is_better(x, y){
    return grid[cx+x][cy+y].f_cost > calc_cost(cx+x, cy+y, fx, fy) + calc_cost(cx+x, cy+y, cx, cy) + grid[cx][cy].g_cost;
}
function no_overflow(x, y){
    return cx+x >= 0 && cy+y >= 0 && cx+x < w && cy+y < h;
}

function add_open(grid, h, w, cx, cy, fx, fy, sx, sy){
    for (let x = 1; x > -2; x--)
    {
        for (let y = 1; y > -2; y--)
        {
            if (no_overflow(x, y) && (grid[cx+x][cy+y].list != 'c' && grid[cx+x][cy+y].type != 'w'  && is_inside_grid(cx+x, cy+y, h, w)))
            {
                if (x==0 && y==0)
                {
                    grid[cx+x][cy+y].list = 'c';
                }else if(grid[cx+x][cy+y].list != 'o' || is_better(x, y))
                {
                    grid[cx+x][cy+y].list = 'o';
                    grid[cx+x][cy+y].h_cost = calc_cost(cx+x, cy+y, fx, fy);
                    grid[cx+x][cy+y].g_cost = calc_cost(cx+x, cy+y, cx, cy) + grid[cx][cy].g_cost;
                    grid[cx+x][cy+y].f_cost = grid[cx+x][cy+y].g_cost + grid[cx+x][cy+y].h_cost;
                    grid[cx+x][cy+y].fromx = cx;
                    grid[cx+x][cy+y].fromy = cy;
                }
            }
        }
    }
}

function check_min_cost(grid, h, w, fx, fy){
    var min;
    var first = true;
    for (let y = 0; y < h; y++)
    {
        for (let x = 0; x < w; x++)
        {   
            if (grid[x][y].list == 'o')
            {
                if (x == fx && y == fy)
                {
                    cx = fx;
                    cy = fy;
                    return;
                }
                if (min > grid[x][y].f_cost || first)
                {
                    min = grid[x][y].f_cost;
                    cx = x;
                    cy = y;
                    first = false;
                }
            }
        }
    }
}

function final_path(grid, sx, sy, fx, fy){
    let pathx = fx, pathy = fy, buffx;
    while (!(pathx == sx && pathy == sy))
    {
        buffx = grid[pathx][pathy].fromx;
        pathy = grid[pathx][pathy].fromy;
        pathx = buffx;
        grid[pathx][pathy].fp = true;
    }
}

function draw(h, w){
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if(grid[x][y].type == 's'){
                context.fillStyle = "#2741B5";
                context.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
            }else if(grid[x][y].fp){
                context.fillStyle = "#31AC2A";
                context.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
            }else if(grid[x][y].type == 'f'){
                context.fillStyle = "#D52F15";
                context.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
            }else if(grid[x][y].type == 'w'){
                context.fillStyle = "#393939";
                context.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
            }else if(grid[x][y].type == 'g'){
                context.fillStyle = "#909090";
                context.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize -2, blockSize - 2);
            }
        }
    }
}

var grid = [];

var draws = "";

var h = 8;
var w = 8;

var sx = 2;
var sy = 0;

var fx = 6;
var fy = 6;

var cx = sx, cy = sy;

var blockSize = 25;


for (let y = 0; y < h; y++) {
        
    for (let x = 0; x < w; x++) {
        const arr = [];

        if (Array.isArray(grid[y])) {
            grid[y][x] = new Tile3;
        } else {
            grid[y] = [new Tile3];
        }
    }
}


grid[sx][sy].type = 's';
grid[fx][fy].type = 'f';

grid[5][5].type = 'w';
grid[5][4].type = 'w';
grid[4][5].type = 'w';

cx = sx;
cy = sy;


window.onload = function() {
    board = document.getElementById("board");
    button = document.getElementById("find");
    resetb = document.getElementById("reset");
    startb = document.getElementById("start");
    finishb = document.getElementById("finish");
    hinput = document.getElementById("height");
    winput = document.getElementById("width");
    gridb = document.getElementById("resetgrid");
    board.height = h * blockSize;
    board.width = w * blockSize;
    context = board.getContext("2d");

    
    resetb.addEventListener("click", reset);
    startb.addEventListener("click", start);
    gridb.addEventListener("click", resetgrid);
    hinput.addEventListener("input", resetgrid);
    winput.addEventListener("input", resetgrid);
    finishb.addEventListener("click", finish);
    button.addEventListener("click", find);
    board.addEventListener("click", putWall);
    setInterval(update, 100);
    
    context.fillStyle = "white";
    context.fillRect(0, 0, w * blockSize, h * blockSize);
}

function update(){
    
    draw(h, w);
}

function find(){
    
    cx = sx;
    cy = sy;
    grid[sx][sy].type = 's';
    grid[fx][fy].type = 'f';
    while (!(cx == fx && cy == fy))
    {
        add_open(grid, h, w, cx, cy, fx, fy, sx, sy);
        check_min_cost(grid, h, w, fx, fy);
    }
    
    final_path(grid, sx, sy, fx, fy);
    
}

function putWall(event){
    var x = event.offsetX;
    var y = event.offsetY;
    x = Math.floor(x / blockSize);
    y = Math.floor(y / blockSize);
    if(draws == "start"){
        grid[sx][sy].type = 'g';
        grid[x][y].type = 's';
        sx = x;
        sy = y;
        draws = "";
    }else if(draws == "finish"){
        grid[fx][fy].type = 'g';
        grid[x][y].type = 'f';
        fx = x;
        fy = y;
        draws = "";
    }else{
        grid[x][y].type = 'w';
    }
    //context.fillStyle = "grey";
    //context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function reset(){
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            grid[x][y].fromx = 0;
            grid[x][y].fromy = 0;
            grid[x][y].g_cost = 0;
            grid[x][y].h_cost = 0;
            grid[x][y].f_cost = 0;
            grid[x][y].fp = false;
            grid[x][y].type = 'g';
            grid[x][y].list = 'v';
        }
    }
}

function resetgrid(){
    h = hinput.value;
    w = winput.value;
    //alert(h * blockSize + " " + w * blockSize)
    board.height = h * blockSize;
    board.width = w * blockSize;
    context = board.getContext("2d");
    
    context.fillStyle = "white";
    context.fillRect(0, 0, w * blockSize, h * blockSize);
    
    for (let y = 0; y < w; y++) {
        
        for (let x = 0; x < h; x++) {
            const arr = [];
    
            if (Array.isArray(grid[y])) {
                grid[y][x] = new Tile3;
            } else {
                grid[y] = [new Tile3];
            }
        }
    }
    reset();
}

function start(){
    draws = "start";
}

function finish(){
    draws = "finish";
}
/*
while (!(cx == fx && cy == fy))
{
    add_open(grid, h, w, cx, cy, fx, fy, sx, sy);
    check_min_cost(grid, h, w, fx, fy);
}

final_path(grid, sx, sy, fx, fy);
show_final_grid(grid, w, h);
*/