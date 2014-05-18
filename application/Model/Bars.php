<?php
class Model_Partie{ 
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
	public function rends(){
	    $sql =  "SELECT gid, name, ST_AsEWKT(the_geom) FROM bars";	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    return $resultats;
	}
}