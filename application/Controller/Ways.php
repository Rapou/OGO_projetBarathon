<?php

class Controller_Ways{
    /**
     *
     * @var model_Bars 
     */
    private $model;
    
    public function __construct(PDO $dbh){
	$this->model = new Model_Ways($dbh);
        
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
    public function rendWayParId(){
	return $res = $this->model->rendWayParId();
        
        
    }
    
    public function rendCheminEntre2Bars(){
        return $this->model->rendCheminEntre2Bars();
    }
    
    public function rendNodeLePlusProche(){
        return $this->model->rendNodeLePlusProche();
    }
    
    
    
}