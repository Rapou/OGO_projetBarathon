<?php

class Controller_Users{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    public function __construct(PDO $dbh){
	$this->model = new Model_Login($dbh); 
    }

    /**
     * Rend tous les Barathons en BD
     * @return type
     */
    public function rend(){
	return $this->model->rend();
    }
    
    /**
     * Rend le Barathon avec l'id désiré
     * @return true si valide, false si non valide
     */
    public function valideUser(){
	return $res = $this->model->rend();
        
        
        
    }
    
    
    
}