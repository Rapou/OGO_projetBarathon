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

	    return $resultats;
	}
        
        public function rendBar(){
            $barId = $_GET['barId'];
            
            $sql = "SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry  FROM bars WHERE gid = $barId";
            
            $statement=$this->db->prepare($sql);
            $statement->execute();
	    $resultats=$statement->fetch();
            
	    return $resultats;
        }
	
	public function rendPub(){
	    $sql =  "SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry FROM bars WHERE type like 'pub'";	    
	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
            
	    return $resultats;
	}
	public function rendBarEtPub(){
	    $sql =  "SELECT gid, name, ST_AsGeoJSON(the_geom) AS geometry FROM bars WHERE type like 'pub' OR type like 'bar'";
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);

	    return $resultats;
	}
}