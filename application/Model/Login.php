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

    /**
     * 
     * @return array
     */
    public function rend(){
        $sql =  "SELECT * FROM users";	    

        $statement=$this->db->prepare($sql);
        $statement->execute();
        $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);

        return $resultats;

    }
        
     
}