<?php
class Model_Bars{ 
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
	    $sql =  "SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry FROM bars";	    
	    
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
	}
}