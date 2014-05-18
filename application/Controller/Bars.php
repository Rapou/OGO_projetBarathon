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

    public function rends(){
	$res = $this->model->rends();
	$tableau_partie = "";
	foreach($res as $i => $partie){
	    $tableau_partie = $partie;
	}
	return $tableau_partie;
    }
}