<?php
 
    include('../config/config.php');
    $sala = new sala($conexion);
    $proceso = '';
    if ( isset( $_GET['proceso'] ) && strlen( $_GET['proceso'] ) > 0) {
        $proceso = $_GET['proceso'];
    }
    $sala->$proceso($_GET['sala']);
 
    print_r(json_encode($sala->respuesta));
    class sala {
        private $datos = array(), $db;
        public $respuesta = ['msg' => 'Correcto'];
        public function __construct($db){
            $this->db = $db; 
        }
        public function recibirDatos($sala){
            $this->datos = json_decode($sala, true);
            $this->almacenar_sala();
        }
    
        private function almacenar_sala(){
            $this->db->consultas('INSERT INTO salas (uid, codigoSala) 
                VALUES("'.$this->datos['uid'].'", "'.$this->datos['codigoSala'].'")');
                return $this->respuesta = ['guardado'];         
        }
    } 
?> 