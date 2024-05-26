document.addEventListener("DOMContentLoaded", function() {
    // Function to render the leaderboard data in a table
    function renderLeaderboard(data, containerId) {
        var leaderboardTable = document.getElementById(containerId + "-leaderboard-body");
        if (!Array.isArray(data)) {
            console.error('Data received from server is not an array:', data);
            return;
        }
        data.forEach(function(player) {
            var row = leaderboardTable.insertRow();
            Object.keys(player).forEach(function(key, index) {
                var cell = row.insertCell(index);
                cell.textContent = player[key];
            });
        });
    }

    // Make an Axios request to fetch leaderboard data
    axios.get('http://localhost/wtProj/leaderboards.php')
        .then(function(response) {
            // Handle success
            var leaderboardData = response.data;
            console.log('Data received:', leaderboardData); // Log the received data
            // Render Tic Tac Toe leaderboard data
            renderLeaderboard(leaderboardData.tic_tac_toe_leaderboard, 'tic');
            // Render Snake leaderboard data
            renderLeaderboard(leaderboardData.snake_leaderboard, 'snake');
            // Render Pong leaderboard data
            renderLeaderboard(leaderboardData.pong_leaderboard, 'pong');
            // Render 2048 leaderboard data
            renderLeaderboard(leaderboardData["2048_leaderboard"], '2048');
        })
        .catch(function(error) {
            // Handle error
            console.error('Error fetching leaderboard data:', error);
        });
});
