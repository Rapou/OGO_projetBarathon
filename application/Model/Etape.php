<?php
class Model_Etape{ 
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
	public function rendsIdSelonNum($num){
	    $sql =  "	SELECT etape.id AS etapeID 
			FROM etape
			WHERE etape.numero = $num";	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    if(!empty($resultats)){
		foreach ($resultats as $resultat) {
		    $resultats = $resultat["etapeID"];
		}
	    }
	    return $resultats;
	}
	
	public function rendsNumSelonId($id){
	    $sql =  "	SELECT etape.numero AS etapeNUM
			FROM etape
			WHERE etape.id = $id";	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    if(!empty($resultats)){
		foreach ($resultats as $resultat) {
		    $resultats = $resultat["etapeNUM"];
		}
	    }
	    return $resultats;
	}
}