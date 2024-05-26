<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

$servername = "localhost";
$username = "webtech";
$password = "1234";
$dbname = "leaderboard";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql_tic_tac_toe = "SELECT * FROM tictactoe";
$result_tic_tac_toe = $conn->query($sql_tic_tac_toe);
$rows_tic_tac_toe = [];

if ($result_tic_tac_toe->num_rows > 0) {
    while ($row = $result_tic_tac_toe->fetch_assoc()) {
        $rows_tic_tac_toe[] = $row;
    }
}

$sql_snake = "SELECT * FROM snake";
$result_snake = $conn->query($sql_snake);
$rows_snake = [];

if ($result_snake->num_rows > 0) {
    while ($row = $result_snake->fetch_assoc()) {
        $rows_snake[] = $row;
    }
}

$sql_pong = "SELECT * FROM pong";
$result_pong = $conn->query($sql_pong);
$rows_pong = [];

if ($result_pong->num_rows > 0) {
    while ($row = $result_pong->fetch_assoc()) {
        $rows_pong[] = $row;
    }
}

$sql_2048 = "SELECT * FROM g2048";
$result_2048 = $conn->query($sql_2048);
$rows_2048 = [];

if ($result_2048->num_rows > 0) {
    while ($row = $result_2048->fetch_assoc()) {
        $rows_2048[] = $row;
    }
}

// Close connection
$conn->close();

// Prepare data for response
$response = [
    "tic_tac_toe_leaderboard" => $rows_tic_tac_toe,
    "snake_leaderboard" => $rows_snake,
    "pong_leaderboard" => $rows_pong,
    "2048_leaderboard" => $rows_2048
];

// Output data in JSON format
echo json_encode($response);
?>
