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
            
            $nom;
            $difficulte; //calculé en fonction du nbre de bars ?
            $tempsEstime;//calculé en fonction du nbre de bars + durée trajets
            $description;
            $userCreateurId;
            
            $listeBars;
            // créer liste de bars dans table associative : 
            // foreach bar in listeBars, addBarToBarathon
            
            
            // Ajax create new barathon
            
        }
}