let board;
let context;
let boardHeight =600 , boardWidth = 900;
let urlParams = new URLSearchParams(window.location.search);
let playerName = urlParams.get('data');
console.log(playerName);
//players
let playerHeight = 15;
let playerWidth = 100;
let playerspeedY = 0;

//player score
let player1Score = 0;
let player2Score = 0;

//ball
let ballSpeedX = 4;
let ballSpeedY = 2;
let ballRadius = 10;

//player 1
let p1 = 
{
    x : 10,
    y : boardHeight/2 - (playerWidth/2),
    speed : playerspeedY,
    width : playerWidth,
    height : playerHeight
};

//player 2
let p2 = 
{
    x : boardWidth - 25,
    y : boardHeight/2 - (playerWidth/2),
    speed : playerspeedY,
    width : playerWidth,
    height : playerHeight
}

//ball
let ball = 
{
    radius : ballRadius,
    x : boardWidth/2,
    y : boardHeight/2,
    speedX : ballSpeedX,
    speedY : ballSpeedY,
    height : 20 ,
    width : 20

}
let gameStarted = false;
let gameEnded = false;
window.onload = function()
{
    board = document.querySelector(".board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw p1
    context.fillStyle = "white";
    context.fillRect(p1.x , p1.y , p1.height , p1.width);

    //draw p2
    context.fillRect(p2.x , p2.y , p2.height , p2.width);

    //draw ball
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();

    //show score
    context.font = "45px anta";
    context.fillText(player1Score , boardWidth/5 , 45);
    context.fillText(player2Score , boardWidth*0.8 , 45);

    //draw line
    context.beginPath();
    context.moveTo(boardWidth/2 , 0);
    context.lineTo(boardWidth/2 , boardHeight);
    context.strokeStyle = 'white';
    context.lineWidth = 10;
    context.setLineDash([60,50]);
    context.stroke();

    //game loop
    document.addEventListener('keypress' ,startGame);
    //keypress changes
    document.addEventListener('keyup', moveplayer);
    document.addEventListener('keydown', moveplayer);
    moveCpu();


    
  
}

function startGame(e) {
    if (e.code == "Enter" && !gameStarted && !gameEnded) {
        gameStarted = true;
        gameContinue = true;
        let r1 = Math.floor(Math.random() * 2);
        if (r1 == 1)
        {
            ball.speedX *= -1;
        }
        let r2 = Math.floor(Math.random() * 2);
        if (r2 == 1)
        {
            ball.speedY *= -1;
        }
        requestAnimationFrame(changePosition);
         
    }
}

function changePosition()
{
    
    if (!gameStarted) return;
    
    requestAnimationFrame(changePosition);
    context.clearRect(0,0,boardWidth,boardHeight);
    //draw p1
    context.fillStyle = "white";
    if (!outOfbounds(p1.y + p1.speed))
        p1.y += p1.speed;
    p1.speed = 0;
    context.fillRect(p1.x , p1.y , p1.height , p1.width);

    //draw p2
    setTimeout(moveCpu , 500);
    if (!outOfbounds(p2.y + p2.speed))
        p2.y += p2.speed;
    p2.speed = 0;
    context.fillRect(p2.x , p2.y , p2.height , p2.width);

     // Move ball
    ball.x += ball.speedX;

     if (ballOutofBoundsY(ball.y + ball.speedY))
        ball.speedY *= -1;
     ball.y += ball.speedY;
    if (detectCollision(ball, p1)) {
        if (ball.x - ball.radius<= p1.x + p1.height) { //left side of ball touches right side of p 1 (left paddle)
            ball.speedX *= -1;   // flip x direction
        }
    }
    else if (detectCollision(ball, p2)) {
        if (ball.x + ball.radius >= p2.x) { //right side of ball touches left side of p 2 (right paddle)
            ball.speedX *= -1;   // flip x direction
        }
    }
    
    if (ball.x <= 0)
    {
        player2Score += 1;
        ball.x = boardWidth/2;
        ball.y = boardHeight/2;
        ball.speedX = ballSpeedX;
        ball.speedY = ballSpeedY;
        p1.y = boardHeight/2 - (playerWidth/2),
        p2.y = boardHeight/2 - (playerWidth/2),
        gameStarted = false;
        document.addEventListener('keydown', startGame);

    }
    else if (ball.x >= boardWidth)
    {
        player1Score += 1;
        ball.x = boardWidth/2;
        ball.y = boardHeight/2;
        ball.speedX = ballSpeedX;
        ball.speedY = ballSpeedY;
        p1.y = boardHeight/2 - (playerWidth/2),
        p2.y = boardHeight/2 - (playerWidth/2),
        gameStarted = false;
        document.addEventListener('keydown', startGame);
    }

    //show score
    context.font = "45px anta";
    context.fillText(player1Score , boardWidth/5 , 45);
    context.fillText(player2Score , boardWidth*0.8 , 45);
     // Draw ball
     context.beginPath();
     context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
     context.fill();
     context.closePath(); 
     
      //draw line
    context.beginPath();
    context.moveTo(boardWidth/2 , 0);
    context.lineTo(boardWidth/2 , boardHeight);
    context.strokeStyle = 'white';
    context.lineWidth = 10;
    context.setLineDash([60,50]);
    context.stroke();
    
     if (player1Score >= '1' )
     {
        gameEnded = true;
        document.querySelector("h2").innerText = "Player Has Won the Game";
        axios.post('http://localhost/wtProj/updatepong.php', {
            
            player_name: `${playerName}`,
            matches_won: 1, 
            matches_lost: 0 
        })
        .then(function(response) {
            console.log('Leaderboard updated successfully:', response.data);
        })
        .catch(function(error) {
            console.error('Error updating leaderboard:', error);
        });

     }  
     else if (player2Score >= '1')
     {
        gameEnded = true;
        document.querySelector("h2").innerText = "CPU Has Won the Game";
        axios.post('http://localhost/wtProj/updatepong.php', {
            
            player_name: `${playerName}`,
            matches_won: 0, 
            matches_lost: 1 
        })
        .then(function(response) {
            console.log('Leaderboard updated successfully:', response.data);
        })
        .catch(function(error) {
            console.error('Error updating leaderboard:', error);
        });
     }
}


function moveplayer(e)
{
    //p 1
    if (e.code == "KeyW")
    {
        p1.speed = -50;
    } else if (e.code == "KeyS")
    {
        p1.speed = 50;
    }

   
}
let cpuSpeed = 0;
function moveCpu()
{
    let difference = ball.y - (p2.y + p2.width/2) -70;

    let targetSpeed = Math.sign(difference)*30;
  

    cpuSpeed += (targetSpeed - cpuSpeed) * 0.08;

    p2.speed = cpuSpeed;
}

function outOfbounds (yPos)
{
    return (yPos + playerWidth - playerHeight>= boardHeight || yPos + playerHeight< 0)
    
}



function ballOutofBoundsY (y)
{
    return (y + ballRadius > boardHeight || y - ballRadius < 0)
}

function detectCollision(a, b) {
    return a.x < b.x + b.height &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.width &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;     //a's bottom left corner passes b's top left corner
}