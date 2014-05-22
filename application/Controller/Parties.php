<?php

class Controller_Parties{
    /**
     *
     * @var model_Partie 
     */
    private $model;
    
    
    public function __construct(PDO $dbh){
	$this->model = new Model_Parties($dbh); 
    }

    public function nouvellePartie(){
        return $this->model->nouvellePartie();
    }
    
    public function rendPartie(){
        return $this->model->rendPartie();
    }
    
    
    public function changeBarPremier(){
	$idEtatSuivant = $_GET['idEtatSuivant'];
	$idEtape = $this->etape->rendsIdSelonNum(1);
	return $this->model->change($idEtatSuivant, $idEtape);
    }
    
    public function changeBarDernier(){
	$idEtatAvant = $_GET['idEtatAvant'];
	$idEtape = $this->etape->rendsIdSelonNum(12);
	return $this->model->change($idEtatAvant, $idEtape);
    }
    
    public function changeBarSuivant(){
	$idEtapeActive = $_GET['idEtapeActive'];
	$numEtapeSuivante = $this->etape->rendsNumSelonId($idEtapeActive)+1; 
	$idEtatSuivant = $_GET['idEtatSuivant'];
	$idEtape = $this->etape->rendsIdSelonNum($numEtapeSuivante);
	return $this->model->change($idEtatSuivant, $idEtape);
    }
    public function changeBarAvant(){
	$idEtapeActive = $_GET['idEtapeActive'];
	$numEtapeAvant = $this->etape->rendsNumSelonId($idEtapeActive)-1; 
	$idEtatAvant = $_GET['idEtatAvant'];
	$idEtape = $this->etape->rendsIdSelonNum($numEtapeAvant);
	return $this->model->change($idEtatAvant, $idEtape);
    }
    
    public function changeEtatMarche(){
	$idEtapeActive = $_GET['idEtapeActive'];
	$idEtat = $_GET['idEtat'];
	return $this->model->change($idEtat, $idEtapeActive);
    }

    public function rends(){
	$res = $this->model->rends($_GET["idPartie"]);
	$tableau_partie = "";
	foreach($res as $i => $partie){
	    $tableau_partie = $partie;
	}
	return $tableau_partie;
    }
}