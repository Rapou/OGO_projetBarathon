<?php
class Model_Barathons{ 
	/**
	 *
	 * @var PDO
	 */
	private $db;
	public function __construct(PDO $mydb){
	    $this->db = $mydb;
	}
	
	/**
	 * 
	 * @return array
	 */
	public function rend(){
	    $sql =  "SELECT * FROM barathons";	    
	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    
            return $resultats;
            
            
            /*
	    $i = 0;
	    $rendu = Array();

            
	    $fc = new FeatureCollection();
	    foreach ($resultats as $i => $resultat) {
		$fc->addFeature(new Feature($i, (json_decode($resultat['geometry'])), array("name" => $resultat['name'])));
	    }
	    	   array_push($rendu, $fc);

	    return $rendu;
            */
	}
        
        /**
	 * Rend un Barathon selon Id donné
	 * @return array
	 */
	public function rendBarathonParId(){
            
            $barathonId = $_GET['barathonId'];
            
	    $sql =  "SELECT * FROM barathons WHERE id = " . barathonId;	    
	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetch();
	    
            return $resultats;
	}
	
	
}