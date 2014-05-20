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
	$res = $this->model->rend();
	$tableau_barathons = "";
	foreach($res as $i => $barathon){
	    $tableau_barathons = $barathon;
	}
	return $tableau_barathons;
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
	$res = $this->model->rendMesBarathons();
	$tableau_barathons = "";
	foreach($res as $i => $barathon){
	    $tableau_barathons = $barathon;
	}
	return $tableau_barathons;
    }
    
    /**
     * Rend une liste des Barathons proposés
     * @return type
     */
    public function rendBarathonsProposes(){
	$res = $this->model->rendBarathonsProposes();
	$tableau_barathons = "";
	foreach($res as $i => $barathon){
	    $tableau_barathons = $barathon;
	}
	return $tableau_barathons;
    }
    
    
}