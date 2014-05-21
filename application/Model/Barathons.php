<?php

include_once 'ListeBars.php';

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

	}
        
        /**
	 * Rend un Barathon selon Id donné
	 * @return array
	 */
	public function rendBarathonParId(){
            
            $barathonId = $_GET['barathonId'];
            
	    $sql =  "SELECT * FROM barathons WHERE id = " . $barathonId;
	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetch();
	    
            return $resultats;
	}
        
        
        /**
	 * Rend un Barathon selon Id donné
	 * @return array
	 */
	public function rendBarathonsProposes(){
            
            $userCreateurId = 0;
            
            // Récupération des barathons
	    $sql =  "SELECT * FROM barathons WHERE userCreateurId = " . $userCreateurId;
	    
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
            
            return $resultats;
	}
        
        public function ajouterBarathon(){
            
            $inputNom = $_GET['inputNomBarathon'];
            $difficulte = $_GET['inputDifficulteBarathon']; //calculé en fonction du nbre de bars ?
            $tempsEstime = "3h";//calculé en fonction du nbre de bars + durée trajets
            $description = "Description de " . $inputNom;
            $userCreateurId = $_GET['userCreateurId'];
            
            $sql = "INSERT INTO Barathons (nom, difficulte, tempsEstime, description, userCreateurId) VALUES"
                    . " ( '".$inputNom."', '". $difficulte ."','". $tempsEstime ."', '".$description."', ".$userCreateurId." ) RETURNING id";
            
            $statement=$this->db->prepare($sql);
	    $resultat = $statement->execute();
            
            if($resultat){
                $idCreated = $this->db->lastInsertId('barathons_id_seq');
            } else {
                $idCreated = false;
            }
            
            return $idCreated;
        }
}