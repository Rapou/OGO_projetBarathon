<?php
class Model_Ways{ 
	/**
	 *
	 * @var PDO
	 */
	private $db;
        private $conn;
        
	public function __construct(PDO $mydb){
	    $this->db = $mydb;
            $conn_string = "host=". DB_HOST ." port=5432 dbname=" . DB_NAME  ." user=" . DB_USER . " password=" . DB_PASS . " connect_timeout=1";
            $this->conn = pg_connect($conn_string);
	}
	
	/**
	 * Rend un User selon l'id donné
	 * @return array
	 */
	public function rend(){
            
            $sql = " SELECT * FROM ways";
            
	    $statement=$this->db->prepare($sql);
	    $statement->execute();
	    $resultats=$statement->fetchAll(PDO::FETCH_ASSOC);
	    
	    return $resultats;
	}
        
        /**
         * Rend le chemin entre 2 points
         * @return type
         */
        public function rendCheminEntre2Bars(){
            
            $start = $_GET['start'];
            $end = $_GET['end'];
            
            if (is_numeric($start) && is_numeric($end)) {

                $query = "SELECT seq, id1 AS node, id2 AS edge, cost, st_asgeojson(the_geom) as the_geom FROM pgr_dijkstra "
                        . "( 'SELECT gid as id , source, target, length as cost FROM ways', $start, $end, false, false) di INNER JOIN ways ON di.id2 = ways.gid ORDER BY seq ASC "; 
                
                
                $rs = pg_query($this->conn, $query);
                $results = pg_fetch_all($rs);
                
            } else {
                echo '{"error": "Problem with start point id or end point id..."}';
            }

            return $results;
        }
        
        /**
         * Requete PGIS pour prendre le point le plus proche d'un bar
         * @return type
         */
        public function rendNodeLePlusProche() {
            $lat = $_GET['lat'];
            $lon = $_GET['lon'];

            $sql = "SELECT * FROM ways_vertices_pgr ORDER BY the_geom <-> ST_GeometryFromText('POINT($lon $lat)',4326) LIMIT 1;";
            
            $rs = pg_query($this->conn, $sql);
            $result = pg_fetch_all($rs);
            
            return $result;
        }
        
        
}