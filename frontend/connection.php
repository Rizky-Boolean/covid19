<?php
// Data koneksi ke database
$host = "localhost";
$username = "root";
$password = "root";
$database = "covid19";

// Membuat koneksi ke MySQL
$conn = new mysqli($host, $username, $password, $database);

// Mengecek apakah koneksi berhasil
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>