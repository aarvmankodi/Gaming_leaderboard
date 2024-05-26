let game;
let boardHeight = 500;
let boardWidth = 1000;
let context;

//player dimensions
let playerHeight = 100;
let playerWidth = 30;
let playerX = 70;
let playerY = 350;
window.onload = function()
{
    game = document.querySelector(".game");
    game.height = boardHeight;
    game.width = boardWidth;
    context = game.getContext("2d");

    update();
}

function update()
{
    context.fillStyle = 'black';
    context.fillRect(0,0,game.height , game.width);
    //place ground
    context.fillStyle='white';
    context.beginPath();
    context.moveTo(0,playerY+playerHeight+5);
    context.lineTo(boardWidth , playerY+playerHeight+5);
    context.strokeStyle = 'white';
    context.lineWidth = 10;
    context.stroke();
    //place dino
    context.fillStyle = 'white';
    context.fillRect(playerX , playerY , playerWidth , playerHeight);
    
}

function jump(e)
{
    if (e.code == "ArrowUp")
    
}