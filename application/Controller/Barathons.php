<?php

class Controller_Barathons{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    private $modelListeBars;
    
    public function __construct(PDO $dbh){
	$this->model = new Model_Barathons($dbh); 
	$this->modelListeBars = new Model_listeBars($dbh); 
        
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
     * 
     * @return typeAjoute un Barathon à la BD. Retourne l'id du B créé
     */
    public function ajouterBarathon(){
        // crée le Barathon
        $idBarathonCree = $this->model->ajouterBarathon();
        
        return $idBarathonCree;
        die();
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