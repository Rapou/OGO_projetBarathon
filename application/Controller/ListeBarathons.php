<?php

class Controller_ListeBarathons{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    public function __construct(PDO $dbh){
	$this->model = new Model_ListeBarathons($dbh); 
    }

    public function rend(){
	$res = $this->model->rend();
	$tableau_barathons = "";
	foreach($res as $i => $barathon){
	    $tableau_barathons = $barathon;
	}
	return $tableau_barathons;
    }
    
    
}