<?php

class Controller_Parties{
    /**
     *
     * @var model_Partie 
     */
    private $model_partie;
    private $model_ListeBars;
    
    public function __construct(PDO $dbh){
	$this->model_partie = new Model_Parties($dbh);
	$this->model_ListeBars = new Model_ListeBars($dbh); 
    }

    public function nouvellePartie(){
	$idBarDebut = $this->model_ListeBars->rendIdPremierePartie();
        return $this->model_partie->nouvellePartie($idBarDebut);
    }
    
    public function rendPartie(){
        return $this->model_partie->rendPartie();
    }
    
    public function changeBarActif(){
	$idBarSuivant = $this->model_ListeBars->recupereIdBarSuivant();
        return $this->model_partie->changeBarSuivant($idBarSuivant);
    }
    

    public function rendMesPartiesJouees(){
        return $this->model_partie->rendMesPartiesJouees();
    }
    
    public function termineBarathon(){
        return $this->model_partie->termineBarathon();
    }
    
    /*
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
    }*/
}