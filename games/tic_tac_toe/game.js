let board = document.querySelector('.game');
let tiles = document.querySelectorAll('.tile');
let gameRunning = true;
let tile_ids = ['a','b','c','d','e','f','g','h','i'];
let count = 1;
let scoreCard = document.querySelector('.score');
let urlParams = new URLSearchParams(window.location.search);
let playerName = urlParams.get('data');
console.log(playerName);
for (let tile of tiles)
{
    if (gameRunning)
    {
        tile.onclick = function()
        {
            
            if (count == 1 && tile.innerText == '')
            {
                tile.innerText = 'X';
                count = -1;
                
                

            }
            if (!checkDraw())
            {
                 
                count = 1;
                cpuMove();
                
            }
            let winner = checkWinner();
            if(winner)
                {
                    Winner(winner)
                    return;
                }
        }
        
    }  
}

function cpuMove()
{
   
    let bestScore = -Infinity;
    let bestMove;
    let random = Math.random();
    if (random <= 0.5)
    {
    
        tiles.forEach(tile => {
            if (tile.innerHTML == '') {
                tile.innerHTML = 'O';
            
                let score = minimax(0 , false);
                tile.innerHTML = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = tile.id;
                }
            }
        }); 
        if (bestMove !== undefined) {
            document.getElementById(bestMove).innerHTML = 'O';
        }
        console.log('a');   
    }
    else
    {
            let num;
            let turnTaken = false;
            while (!turnTaken)
            {
                num = Math.floor(Math.random() * 9);
                if (tiles[num].innerText == '')
                {
                    turnTaken = true;
                }
            }
            tiles[num].innerText = 'O';
            console.log('b'); 
    }
}


function minimax(depth , isMaximizing)
{
    let result = checkWinner();
    if (result !== null)
    {
        return result;
    }
    
    if (isMaximizing)
    {
        let bestScore = -Infinity;
        tiles.forEach(tile => {
            if (tile.innerHTML == '')
            {
                tile.innerHTML = 'O';
                let score = minimax(depth + 1 , false);
                tile.innerHTML = '';
                if (score > bestScore)
                    bestScore = score;
                
            }
        });
        return bestScore;
    } else
    {
        let bestScore = Infinity;
        tiles.forEach(tile => {
            if (tile.innerHTML == '')
            {
                tile.innerHTML = 'X';
                let score = minimax(depth + 1 , true);
                tile.innerHTML = '';
                if (score < bestScore)
                    bestScore = score;
                
            }
        }); 
        return bestScore;
    }
}


let WinPositions = [
    ['a','b','c'] ,
    ['d','e','f'] ,
    ['g','h','i'] ,
    ['a','d','g'] ,
    ['b','e','h'] ,
    ['c','f','i'] ,
    ['a','e','i'] ,
    ['c','e','g'] ,
];

function checkDraw()
{
   let draw = true;
   for (let tile of tiles)
   {
    if (tile.innerText == '')
    {
        draw = false;
        break;      
    }
   }
   return draw;
}
function checkWinner()
{
    let winner = null;

    WinPositions.forEach(position => {
        let A = position[0];
        let B = position[1];
        let C = position[2];

        let tileA = document.getElementById(A);
        let tileB = document.getElementById(B);
        let tileC = document.getElementById(C);
        if (tileA.innerHTML != '' && tileA.innerHTML == tileB.innerHTML && tileC.innerHTML == tileB.innerHTML)
        {
            switch (tileA.innerHTML)
            {
                case 'X' :
                    winner =  -1;
                    break;
                case 'O' :
                    winner = 1;
                    break
            }
        }
    
    }); 
       
    if (checkDraw() && winner == null)
        winner = 0;
    
    return winner;
    
}



function Winner(winner)
{
    let won = document.createElement('div');
    won.classList.add('win');
    if (winner == -1)
    {
        won.innerHTML = 'Player Has Won The Game';

        // Send Axios request to update leaderboard for player win
        axios.post('http://localhost/wtProj/updatetictactoe.php', {
            
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

    } else if (winner == 1)
    {
        won.innerHTML = 'CPU Has Won The Game';

        // Send Axios request to update leaderboard for player win
        axios.post('http://localhost/wtProj/updatetictactoe.php', {
            
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
    document.body.insertBefore(won , board);

    for (let tile of tiles)
    {
        tile.onclick = null;
    }
}

