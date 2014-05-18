<?php
require_once 'GeoManager.php';
$dsn = 'pgsql:host=' . DB_HOST . ';port=5432;dbname=' . DB_NAME;
try {
    $dbh = new PDO($dsn, DB_USER, DB_PASS);
} catch (PDOException $e) {
    die( "Erreur ! : " . $e->getMessage() );
}
echo "salut";
/*
if($dbh){ 
    $controller = isset($_GET['controller']) ? $_GET['controller'] : 'Message';
    $action = isset($_GET['action']) ? $_GET['action'] : 'lire';
    $classTest = "Controller_" . $controller;
    $contr = new $classTest($dbh);
    echo json_encode($contr->$action());
}else{
    echo "Erreur de connection";
}*/


