<?php

class Controller_Users{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    public function __construct(PDO $dbh){
	$this->model = new Model_Users($dbh); 
    }

    public function rend(){
	$res = $this->model->rend();
        return $res;
	/*$tableau_users = "";
	foreach($res as $i => $user){
	    $tableau_users = $user;
	}
	return $tableau_users;*/
    }
    
    public function rendUserParId(){
        return $this->model->rendUserParId();
    }
    
    public function rendUserParLogin(){
        return $this->model->rendUserParLogin();
    }
    
    /**
     * 
     * url test : http://localhost/OGO_projetBarathon/www/bootstrap.php?controller=Users&action=validerUser&userLogin=admin&mdp=1234
     */
    public function validerUser(){
        $login = $_GET['userLogin'];
        $mdpRecu = $_GET['mdp'];
        
        $user = $this->rendUserParLogin();
        
        $mdpBD = $user['mdp'];
        
        if( $mdpRecu == $mdpBD ) {
            //echo "user OK";
            return $user["login"];
        } else {
            echo "user ou mdp non OK";
        }
        
        die();
    }
}