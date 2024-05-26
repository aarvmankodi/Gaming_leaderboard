<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow only GET and POST methods
header("Access-Control-Allow-Methods: GET, POST");

// Allow the Content-Type header to be sent in the request
header("Access-Control-Allow-Headers: Content-Type");

// Check if it's a preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with a 200 status code for preflight requests
    http_response_code(200);
    exit();
}

// Get the JSON POST body
$json = file_get_contents('php://input');

// Decode JSON to associative array
$data = json_decode($json, true); // Set second parameter to true for associative array

// Extract the data
$player_name = $data['player_name'];
$matches_won = $data['matches_won'];
$matches_lost = $data['matches_lost'];

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
$sql_check = "SELECT * FROM tictactoe WHERE player_name = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $player_name);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    // Player exists, update their record if necessary
    $row = $result_check->fetch_assoc();
    $new_matches_won = $row['matches_won'] + $matches_won; // Increment matches_won
    $new_matches_lost = $row['matches_lost'] + $matches_lost; // Increment matches_lost
    
    $sql_update = "UPDATE tictactoe SET matches_won = ?, matches_lost = ? WHERE player_name = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("iis", $new_matches_won, $new_matches_lost, $player_name);
    
    if ($stmt_update->execute()) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . $conn->error;
    }
    
    $stmt_update->close();
} else {
    // Player doesn't exist, insert a new record
    $sql_insert = "INSERT INTO tictactoe (player_name, matches_won, matches_lost) VALUES (?, ?, ?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("sii", $player_name, $matches_won, $matches_lost);
    
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
