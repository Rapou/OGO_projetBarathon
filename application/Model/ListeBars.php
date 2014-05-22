<?php
class Model_ListeBars{ 
	/**
	 *
	 * @var PDO
	 */
	private $db;
	public function __construct(PDO $mydb){
	    $this->db = $mydb;
	}
	
	/**
	 * Rend toutes les ListeBars 
	 * @return array
	 */
	public function rend(){
	    $sql =  "SELECT * FROM ListeBars";	    
	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    
	    $i = 0;
	    $rendu = Array();

	    $fc = new FeatureCollection();
	    foreach ($resultats as $i => $resultat) {
		$fc->addFeature(new Feature($i, (json_decode($resultat['geometry'])), array("name" => $resultat['name'])));
	    }
	    	   array_push($rendu, $fc);

	    return $rendu;
	}
	
        /**
         * Rend la liste des Bars pour un Barathon(id)
         * @return type
         */
        public function rendListeBarsPourBarathon(){

            $barathonId = $_GET['barathonId'];

            $sql = "SELECT b.gid, b.name, ST_AsGeoJSON(b.the_geom) AS geometry, ListeBars.ordreDansBarathon from Bars as b LEFT JOIN ListeBars ON b.gid = ListeBars.barId ".
                "WHERE barathonId = $barathonId ORDER BY ListeBars.ordreDansBarathon ASC";

            $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
            
            return $resultats;
        }
        
        
        /**
         * Ajoute un bar à la liste des Bars d'un Barathon
         * @param type $barathonId
         */
        public function ajouterBarPourBarathon(){
            
            $barathonId = $_GET['barathonId'];
            $barId = $_GET['barId'];
            $ordreDansBarathon = $_GET['ordreDansBarathon'];
            
            $sql = "INSERT INTO listeBars (barId, barathonId, ordreDansBarathon) VALUES ( $barId ,  $barathonId ,  $ordreDansBarathon )";
            
            $statement=$this->db->prepare($sql);
            $resultats = $statement->execute();
            
            return $resultats;
        }
        
	/**
         * Ajoute un bar à la liste des Bars d'un Barathon
         * @param type $barathonId
         */
        public function recupereBarSuivant(){
            
           /* $barId = $_GET['idBar'];
	    
            $barathonId = $_GET['idBarathon'];
            
            $sql = "SELECT ordreDansBarathon FROME listeBars WHERE (barId, barathonId, ordreDansBarathon) VALUES ( $barId ,  idBarathon ,  $ordreDansBarathon )";
            
            $statement=$this->db->prepare($sql);
            $resultats = $statement->execute();
            */
            return "";// $resultats;
        }

        
}