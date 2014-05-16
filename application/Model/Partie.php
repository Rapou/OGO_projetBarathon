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
	
	public function change($idEtat, $idEtape){
	    $this->db->exec("UPDATE partie SET etape_id=$idEtape, etat_id=$idEtat WHERE id=1");
	    return true;
	}
	
	/**
	 * 
	 * @return array
	 */
	public function rends($idPartie){
	    $sql =  "	SELECT partie.id AS partieID, 
			    partie.nom AS partieNOM , 
			    etat.id AS etatID, 
			    etat.nom AS etatNOM, 
			    etape.id AS etapeID, 
			    etape.nom AS etapeNOM, 
			    etape.numero AS etapeNUM, 
			    etape.latitude AS etapeLAT, 
			    etape.longitude AS etapeLONG,
			    etape.adresse AS etapeADR,
			    etape.npa AS etapeNPA,
			    etape.localite AS etapeLOC
			FROM partie
			INNER JOIN etat ON partie.etat_id = etat.id 
			INNER JOIN etape ON partie.etape_id = etape.id
			WHERE partie.id = $idPartie";	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    
	    return $resultats;
	}
}