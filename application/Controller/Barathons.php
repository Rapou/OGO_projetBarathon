<?php

class Controller_Barathons{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    public function __construct(PDO $dbh){
	$this->model = new Model_Barathons($dbh); 
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
     * @return type
     */
    public function rendBarathonParId(){
	return $res = $this->model->rendBarathonParId();
    }
    
    
    /**
     * Rend une liste des Barathons de l'utilisateur loggé
     * @return type
     */
    public function rendMesBarathons(){
	return $this->model->rendMesBarathons();
    }
    
    /**
     * Rend une liste des Barathons proposés
     * @return type
     */
    public function rendBarathonsProposes(){
        return $this->model->rendBarathonsProposes();
    }
}