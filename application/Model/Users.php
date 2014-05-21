<?php
class Model_Users{ 
	/**
	 *
	 * @var PDO
	 */
	private $db;
	public function __construct(PDO $mydb){
	    $this->db = $mydb;
	}
	
        /*
	public function change($idEtat, $idEtape){
	    $this->db->exec("UPDATE partie SET etape_id=$idEtape, etat_id=$idEtat WHERE id=1");
	    return true;
	}
	*/
        
	/**
	 * Rend un User selon l'id donné
	 * @return array
	 */
	public function rend(){
            
            $sql = " SELECT * FROM users";
            
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    
	    return $resultats;
	}
        
        public function rendUserParId(){
            
            $userId = $_GET['userId'];
            
            $sql = " SELECT * FROM users WHERE id = $userId";
            
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetch();
	    
	    return $resultats;
            
        }
        
        public function rendUserParLogin(){
            
            $userLogin = $_GET['userLogin'];
            
            $sql = " SELECT * FROM users WHERE login = '$userLogin' LIMIT 1";
            
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetch();
	    
	    return $resultats;
            
        }
        
        public function addUser(){
            
        }
        
        
}