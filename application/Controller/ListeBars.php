<?php

class Controller_ListeBars{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    public function __construct(PDO $dbh){
	$this->model = new Model_ListeBars($dbh); 
    }

    public function rend(){
	$res = $this->model->rend();
	$tableau_listeBars = "";
	foreach($res as $i => $bar){
	    $tableau_listeBars = $bar;
	}
	return $tableau_listeBars;
    }
    
    public function rendListeBarsPourBarathon(){
        
        return $this->model->rendListeBarsPourBarathon();
    }
    
}