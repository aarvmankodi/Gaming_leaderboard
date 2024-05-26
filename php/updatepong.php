<?php

header("Access-Control-Allow-Origin: *");

header("Access-Control-Allow-Methods: GET, POST");


header("Access-Control-Allow-Headers: Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    
    http_response_code(200);
    exit();
}

$json = file_get_contents('php://input');

$data = json_decode($json, true); 

// Extract the data
$player_name = $data['player_name'];
$matches_won = $data['matches_won'];
$matches_lost = $data['matches_lost'];

$servername = "localhost";
$username = "webtech";
$password = "1234";
$dbname = "leaderboard";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql_check = "SELECT * FROM pong WHERE player_name = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $player_name);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    $row = $result_check->fetch_assoc();
    $new_matches_won = $row['matches_won'] + $matches_won; 
    $new_matches_lost = $row['matches_lost'] + $matches_lost; 
    
    $sql_update = "UPDATE pong SET matches_won = ?, matches_lost = ? WHERE player_name = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("iis", $new_matches_won, $new_matches_lost, $player_name);
    
    if ($stmt_update->execute()) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . $conn->error;
    }
} else {
    // Player doesn't exist, insert a new record
    $sql_insert = "INSERT INTO pong (player_name, matches_won, matches_lost) VALUES (?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("sii", $player_name, $matches_won, $matches_lost);
    
    if ($stmt_insert->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql_insert . "<br>" . $conn->error;
    }
}

$stmt_check->close();
if(isset($stmt_update)) {
    $stmt_update->close();
}
$stmt_insert->close();
$conn->close();

?>
