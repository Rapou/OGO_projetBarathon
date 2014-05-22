<?php
class Model_Parties{ 
	/**
	 *
	 * @var PDO
	 */
	private $db;
	public function __construct(PDO $mydb){
	    $this->db = $mydb;
	}
	
        public function rendPartie(){
            $idPartie = $_GET['idPartie'];
            
            $sql = "SELECT * FROM parties WHERE id = $idPartie";
            
            $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultat=$statement->fetch();
            
            return $resultat;
        }
	
	public function changeBarSuivant($idBarSuivant){
            $partieId = $_GET['idPartie'];
            $sql = "UPDATE parties SET barencoursid = ". $idBarSuivant ." WHERE partie = " . $partieId;
            
            $statement=$this->db->prepare($sql);
            $resultats = $statement->execute();
            
            return $resultats;
        }
        
	/**
	 
	public function change($idEtat, $idEtape){
	    $this->db->exec("UPDATE partie SET etape_id=$idEtape, etat_id=$idEtat WHERE id=1");
	    return true;
	}
	
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
	}*/
        
        public function nouvellePartie(){
            $idBarathon = $_GET['idBarathon'];
            $idUser = $_GET['idUser'];
            
            $sql = "INSERT INTO parties (barathonId, userId, etat, barEnCoursId, tempsEffectue, positionsRecues) VALUES"
                                   . "( $idBarathon, $idUser, 'en cours', 0, null, null )";
            
            $statement=$this->db->prepare($sql);
	    $res = $statement->execute();
            
            if($res){
                $idCreated = $this->db->lastInsertId('parties_id_seq');
            } else {
                $idCreated = 0;
            }
            
            return $idCreated;
        }
        
        public function rendMesPartiesJouees(){
            
            $userId = $_GET['userId'];
            
            $sql = "SELECT * FROM parties WHERE userId= $userId ";
            
            $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
            
            return $resultats;
        }
}