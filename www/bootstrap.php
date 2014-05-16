<?php
    // define('APP_ENV', 'DEV');
    
    // Definition du path de l'application
    define('APP_PATH', dirname(__FILE__) . '/../application/');
    set_include_path(get_include_path() . PATH_SEPARATOR . APP_PATH);
    
    // Récupération des données de configuration
    $conf = parse_ini_file("config/config.ini");
    foreach($conf as $key => $val){
	define($key, $val);
    }
    
    // echo DB_HOST;
    // Affichage des erreurs selon SHOW_ERROR = 1 ou 0
    error_reporting(E_ALL | E_STRICT);
    ini_set('display_startup_errors', SHOW_ERROR);
    ini_set('display_errors', SHOW_ERROR);
    
   
    // Auto load
    spl_autoload_register(function($class){
	$classPath = str_replace('_', '/', $class) . ".php";
	if(file_exists(APP_PATH . $classPath)){
	    require_once $classPath;
	}else{
	    throw new Exception('Wrong class name');
	}
    });
     
    // UTF-8 consistency
    mb_internal_encoding('UTF-8');
   
    // Call Dispacher
    require_once 'dispacher.php';

   