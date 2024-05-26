let rows = 4;
let cols = 4;
let score = 0;
let board;
let gameStarted = true;
let urlParams = new URLSearchParams(window.location.search);
let playerName = urlParams.get('data');
console.log(playerName);
window.onload = function()
{
    
    startGame();
}

function startGame()
{

    
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    for (let row = 0 ; row < rows ; row++)
    {
        for (let col = 0 ; col < cols ; col++ )
        {
            let tile = document.createElement('div');

            tile.id = row.toString() + '-' + col.toString();

            let num = board[row][col];

            updateTile(tile , num);
            document.querySelector(".board").append(tile);
            
            
            
        }
    }
    startTwo();
    startTwo();
}

function updateTile(tile , num)
{
    
    tile.innerText = "";
    tile.classList.value = "";

    tile.classList.add("tile");

    if (num > 0){
        tile.innerText = num.toString();
        if ( num <= 2048){
            tile.classList.add('x'+num.toString());
        }
        else{
            tile.classList.add('x4096');
        }
    }
}

function emptyTile()
{
    for (let row = 0 ; row < rows ; row++)
    {
        for (let col = 0 ; col < cols ; col++ )
        {
            if (board[row][col] == 0)
                return true;
        }
    }
    
    return false;
}
function startTwo()
{
    

    let found = false;
    while(!found)
    {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        if (board[r][c] == 0)
        {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
    
}




document.addEventListener('keyup' , (e) =>
{
    if (!gameStarted)
    {
        return;
    }
    if (e.code == "ArrowLeft")
    {
        slideLeft();
        setTwo();
    }
    if (e.code == "ArrowRight")
    {
        slideRight();
        setTwo();
    }
    if (e.code == "ArrowDown")
    {
        slideDown();
        setTwo();
    }
    if (e.code == "ArrowUp")
    {
        slideUp();
        setTwo();   
    }

})

function slide(row)
{
    row = row.filter(num => num > 0)
    for (let i = 0 ; i < row.length ; i++)
    {
        if (row[i] == row[i+1])
        {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    }
    row = row.filter(num => num > 0)
    while (row.length < 4)
    {
        row.push(0);
    }
    document.querySelector(".score").innerText = score; 
    return row;
}

function slideLeft()
{
    for (let row = 0 ; row < rows ; row++)
    {
        board[row] = slide(board[row]);
        for (let col = 0 ; col < cols ; col++ )
        {
            let tile = document.getElementById( row.toString() + '-' + col.toString())
            let num = board[row][col];

            updateTile(tile , num);
        }
    }
}


function slideRight()
{
    for (let row = 0 ; row < rows ; row++)
    {
        board[row] = slide(board[row].reverse()).reverse();
        
        for (let col = 0 ; col < cols ; col++ )
        {
            let tile = document.getElementById( row.toString() + '-' + col.toString())
            let num = board[row][col];

            updateTile(tile , num);
        }   
    }
}

function slideUp()
{
    for (let col = 0 ; col < cols ; col++)
    {
        let r = [board[0][col] , board[1][col] , board[2][col] , board[3][col]];
        r = slide(r);
        
        for (let i = 0 ; i < cols ; i++)
        {
            board[i][col] = r[i];
        }
        for (let row = 0 ; row < rows ; row++ )
        {
            let tile = document.getElementById( row.toString() + '-' + col.toString())
            let num = board[row][col];

            updateTile(tile , num);
        }   

    }
}

function slideDown()
{
    for (let col = 0 ; col < cols ; col++)
    {
        let r = [board[0][col] , board[1][col] , board[2][col] , board[3][col]];
        r = slide(r.reverse()).reverse();
        
        for (let i = 0 ; i < cols ; i++)
        {
            board[i][col] = r[i];
        }
        for (let row = 0 ; row < rows ; row++ )
        {
            let tile = document.getElementById( row.toString() + '-' + col.toString())
            let num = board[row][col];

            updateTile(tile , num);
        }   

    }
}

function setTwo()
{
    if (!emptyTile())
    {
        
        gameStarted = false;
        axios.post('http://localhost/wtProj/update2048.php', {
            player_name: `${playerName}`, 
            highest_score : score
        })
        .then(function(response) {
            console.log('Leaderboard updated successfully:', response.data);
        })
        .catch(function(error) {
            console.error('Error updating leaderboard:', error);
        });
        return;
    }
    let found = false;
    while(!found)
    {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);

        if (board[r][c] == 0)
        {
            let change = Math.random();
            if ( change < 0.75)
            {
                board[r][c] = 2;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "2";
                tile.classList.add("x2");
                found = true;
            }
            else
            {
                board[r][c] = 4;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "4";
                tile.classList.add("x4");
                found = true;
            }
            
        }
    }
}