<?php

class Controller_Bars{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    public function __construct(PDO $dbh){
	$this->model = new Model_Bars($dbh); 
    }

    public function rend(){
	$res = $this->model->rend();
	$tableau_partie = "";
	foreach($res as $i => $partie){
	    $tableau_partie = $partie;
	}
	return $tableau_partie;
    }
    
    public function rendPub(){
	$res = $this->model->rendPub();
	$tableau_partie = "";
	foreach($res as $i => $partie){
	    $tableau_partie = $partie;
	}
	return $tableau_partie;
    }
    public function rendBarEtPub(){
	$res = $this->model->rendBarEtPub();
	$tableau_partie = "";
	foreach($res as $i => $partie){
	    $tableau_partie = $partie;
	}
	return $tableau_partie;
    }
    
}