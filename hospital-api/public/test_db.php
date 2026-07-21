<?php
$conn = new mysqli('127.0.0.1', 'root', '', 'hospital_db'); // تأكد من اسم الداتابيز
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully! Tables in database:";
$result = $conn->query("SHOW TABLES");
while ($row = $result->fetch_array()) {
    echo "<br>" . $row[0];
}
?>