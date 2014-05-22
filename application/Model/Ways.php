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
            
            $start = 2339;
            $end = 2443;
            
            if (is_numeric($start) && is_numeric($end)) {

                $query = "SELECT seq, id1 AS node, id2 AS edge, cost, st_asgeojson(the_geom) as the_geom FROM pgr_dijkstra "
                        . "( 'SELECT gid as id , source, target, length as cost FROM ways', $start, $end, false, false) di INNER JOIN ways ON di.id2 = ways.gid "; 
                
                
                
                $rs = pg_query($this->conn, $query);
                $results = pg_fetch_all($rs);
                
            } else {
                echo '{"error": "Problem with start point id or end point id..."}';
            }

            return $results;
        }
        
        
        public function rendNodeLePlusProche() {
            $lat = $_GET['lat'];
            $lon = $_GET['lon'];

            /*
            if (is_numeric($lat) && is_numeric($lon)) {

                // Récupère les coordonées xy en 900913 et récupère le x/y en 4326
                if (isset($_GET['srid'])) {
                    $transform_query = "SELECT st_x(st_transform(st_geomfromtext('POINT(" . $lon . " " . $lat . ")', ".$_GET['srid']."), 4326)), st_y(st_transform(st_geomfromtext('POINT(" . $lon . " " . $lat . ")', ".$_GET['srid']."), 4326))";

                    $rs = pg_query($conn, $transform_query);
                    $transform_result = pg_fetch_assoc($rs);


                    $lon = $transform_result['st_x'];
                    $lat = $transform_result['st_y'];

                }


                $query =" ????? ";

                $rs = pg_query($conn, $query);
                $result = pg_fetch_assoc($rs);

                if (isset($result['id']) && $result['id'] != -1) {
                    echo '{"success": { "id": '.$result['id'].', "x": '.$result['x'].', "y": '.$result['y'].'}}';
                } else {
                    echo '{"error": "No nearby points..."}';
                }

            } else {
                echo '{"error": "problem with lat or lon..."}';
            }*/
        }
        
        
}