let game;
let boardHeight = 600;
let boardWidth = 600;
let context;
let boxSize = 30;
let rows = 20;
let cols = 20;
let score = 0;
let scoreCard = document.querySelector('.score');
let urlParams = new URLSearchParams(window.location.search);
let playerName = urlParams.get('data');
console.log(playerName);
//snake
let snakeX = boxSize * 2;
let snakeY = boxSize * 2;
let snakeSpeedX = 0;
let snakeSpeedY = 0;
let snakeLength = 1;


//food
let foodX;
let foodY;

let snake = 
{
    x : snakeX,
    y : snakeY,
    length : snakeLength,
    speedX : boxSize,
    speedY : boxSize,
    body : []
    
};

let gameStart = true;

window.onload = function()
{
    game = document.querySelector(".game");
    game.height = boardHeight;
    game.width = boardWidth;
    context = game.getContext("2d");
    
    food();
    // document.addEventListener('keyup' , startGame);
    //move snake
    document.addEventListener('keyup' , moveSnake);
    
    setInterval(update , 1000/10);
    // requestAnimationFrame(update);

}


function update()
{
    if (!gameStart) return;     
    context.fillStyle = 'black';
    context.fillRect(0,0,game.height , game.width);

    //place food
    context.fillStyle = 'white';
    context.fillRect(foodX , foodY , boxSize , boxSize);

    if (foodX == snake.x && foodY == snake.y)
    {
        snake.body.push([foodX , foodY]);
        
            score ++;
        
        scoreCard.innerText = score;
        food();
    }
    //draw snake
    for (let i = snake.body.length - 1 ; i > 0 ; i--)
    {
        snake.body[i] = snake.body[i-1];
    }

    if (snake.body.length)
    {
        snake.body[0] = [snake.x , snake.y];
    }
    context.fillStyle = '#dc2f02';
    snake.x += snakeSpeedX * snake.speedX;
    snake.y += snakeSpeedY * snake.speedY;
    outOfbounds();
    context.fillRect(snake.x , snake.y , boxSize , boxSize);
    for (let i = 0 ; i < snake.body.length ; i++)
    {
        context.fillStyle = '#ffba08';
        context.fillRect(snake.body[i][0] , snake.body[i][1] , boxSize , boxSize);
    }
    collision();

    


    
}

function moveSnake(e)
{
    if (e.code == 'ArrowUp' && snakeSpeedY != 1)
    {
        snakeSpeedX = 0;
        snakeSpeedY = -1;
    }
    else if (e.code == 'ArrowDown' && snakeSpeedY != -1)
    {
        snakeSpeedX = 0;
        snakeSpeedY = 1;
    }
    else if (e.code == 'ArrowLeft' && snakeSpeedX != 1)
    {
        snakeSpeedX = -1;
        snakeSpeedY = 0;
    }
    else if (e.code == 'ArrowRight' && snakeSpeedX != -1)
    {
        snakeSpeedX = 1;
        snakeSpeedY = 0;
    }
    
}

function food()
{
    foodX = Math.floor(Math.random() * cols) * boxSize;
    foodY = Math.floor(Math.random() * rows) * boxSize;
}

function outOfbounds()
{
    if (snake.x < 0)
        snake.x = boardWidth;
    else if (snake.x >= boardWidth)
        snake.x = 0;
    else if (snake.y < 0)
        snake.y = boardHeight;
    else if (snake.y >= boardHeight)
        snake.y = 0;
}

function collision()
{
    for (let i = 0 ; i < snake.body.length-1 ; i++)
    {
        if (snake.x == snake.body[i][0] && snake.y == snake.body[i][1])
        {
            snake.x = snakeX;
            snake.y = snakeY;
            snake.body = [];
            gameStart = false;
            
            axios.post('http://localhost/wtProj/updatesnake.php', {
           
            player_name: `${playerName}`,
            highest_score : scoreCard.innerText
        })
        .then(function(response) {
            console.log('Leaderboard updated successfully:', response.data);
        })
        .catch(function(error) {
            console.error('Error updating leaderboard:', error);
        });
        }
    }
}