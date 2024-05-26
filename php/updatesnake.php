<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the JSON POST body
$json = file_get_contents('php://input');

// Decode JSON to associative array
$data = json_decode($json, true); 

// Extract the data
$player_name = $data['player_name'];
$highest_score = $data['highest_score'];

// Database connection parameters
$servername = "localhost";
$username = "webtech";
$password = "1234";
$dbname = "leaderboard";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if player already exists in the database
$sql_check = "SELECT * FROM snake WHERE player_name = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $player_name);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    // Player exists, update their record if necessary
    $row = $result_check->fetch_assoc();
    if ($row['highest_score'] < $highest_score) {
        $sql_update = "UPDATE snake SET highest_score = ? WHERE player_name = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("is", $highest_score, $player_name);
        
        if ($stmt_update->execute()) {
            echo "Record updated successfully";
        } else {
            echo "Error updating record: " . $conn->error;
        }
        
        $stmt_update->close();
    } else {
        echo "Player's highest score is already higher than the provided score.";
    }
} else {
    // Player doesn't exist, insert a new record
    $sql_insert = "INSERT INTO snake (player_name, highest_score) VALUES (?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("si", $player_name, $highest_score);
    
    if ($stmt_insert->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql_insert . "<br>" . $conn->error;
    }
    
    $stmt_insert->close();
}

$stmt_check->close();
$conn->close();

?>
