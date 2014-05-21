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

            $sql = "SELECT * from Bars as b LEFT JOIN ListeBars ON b.gid = ListeBars.barId ".
                "WHERE barathonId = $barathonId ORDER BY ListeBars.ordreDansBarathon ASC";

            $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
            
            return $resultats;
        }
        
        /**
         * Ajoute un Bar à un Barathon
         */
        public function addBarToBarathon(){
            
            $barId;
            $barathonId;
            $ordreDansBarathon;
            
            $sql = "INSERT INTO listeBars (barId, barathonId, ordreDansBarathon) VALUES (:barId, :barathonid, :ordreDansBarathon)";
            
            // new data
            $title = 'PHP Security';
            $author = 'Jack Hijack';
            // query
            $sql = "INSERT INTO books (title,author) VALUES (:title,:author)";
            
            $q = $conn->prepare($sql);
            $q->execute(array(':barId'=>$barId,
                              ':barathonId'=>$barathonId,
                              ':ordreDansbarathon'=>$ordreDansbarathon));
        }
        
        
        
        /*
	public function rendPub(){
	    $sql =  "SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry FROM bars WHERE type like 'pub'";	    
	    
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
	public function rendBarEtPub(){
	    $sql =  "SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry FROM bars WHERE type like 'pub' OR type like 'bar'";	    
	    
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
	}*/
}