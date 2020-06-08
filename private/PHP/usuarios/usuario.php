<?php
 
    include('../config/config.php');
    $usuario = new usuario($conexion);
    $proceso = '';
    if ( isset( $_GET['proceso'] ) && strlen( $_GET['proceso'] ) > 0) {
        $proceso = $_GET['proceso'];
    }
    $usuario->$proceso($_GET['usuario']);
 
    print_r(json_encode($usuario->respuesta));
    class usuario {
        private $datos = array(), $db;
        public $respuesta = ['sinCambios'];
        public function __construct($db){
            $this->db = $db; 
        }
        public function obtener_datos($usuario){
            $this->datos = json_decode($usuario, true);
            if ($this->datos['accion']=='update'){
                $this->updateUser();
            } else {
                $this->almacenar_usuario();
            }
           
        }
    
       
        private function almacenar_usuario(){
            $this->db->consultas('SELECT * FROM usuarios WHERE uid = "'. $this->datos['uid'].'"');
            $GG = $this->db->obtener_datos();
            $cont = count($GG);
            if ($cont>0){
                
                return $this->respuesta = $GG;
            }
            else if($this->datos['accion']=='guardar'){
                $this->db->consultas('INSERT INTO usuarios (uid, displayname, email, fechanacimiento, tipocuenta, conocimiento) 
                VALUES("'.$this->datos['uid'].'", "'.$this->datos['displayname'].'", "'.$this->datos['email'].'", "'.$this->datos['fechanacimiento'].'", "'.$this->datos['tipocuenta'].'", "'.$this->datos['conoc'].'")');
                return $this->respuesta = ['guardado'];
            }
            else{
                return $this->respuesta =['sinCambios'];
            }
            
        }

        private function updateUser(){
            $this->db->consultas('
            UPDATE usuarios SET 
            displayname= "'. $this->datos['displayname'].'",
            fechanacimiento= "'.$this->datos['fechanacimiento'].'"
            WHERE uid="'. $this->datos['uid'].'"
            ');
            return $this->respuesta =['Update listo'];

        }
        
    }
    
?> 