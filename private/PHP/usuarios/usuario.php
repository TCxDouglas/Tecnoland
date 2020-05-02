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
        public $respuesta = ['msg' => 'Correcto'];
        public function __construct($db){
            $this->db = $db; 
        }
        public function obtener_datos($usuario){
            $this->datos = json_decode($usuario, true);
            $this->almacenar_usuario();
        }
    
       
        private function almacenar_usuario(){
          
          /*  $this->db->consultas('IF EXISTS (SELECT * FROM usuarios WHERE uid ='.$this->datos['uid']. 
            ') RETURN DELETE  FROM usuarios WHERE uid = '.$this->datos['uid']);
*/          $this->db->consultas('SELECT * FROM usuarios WHERE uid = "'. $this->datos['uid'].'"');
            $GG = $this->db->obtener_datos();
            $cont = count($GG);
            if ($cont>0){
                return $this->respuesta = ['ya existe'];
            }
            else{
                $this->db->consultas('INSERT INTO usuarios (uid, displayname, email, fechanacimiento, tipocuenta) VALUES("'.$this->datos['uid'].'", "'.$this->datos['displayname'].'", "'.$this->datos['email'].'", "'.$this->datos['fechanacimiento'].'", "'.$this->datos['tipocuenta'].'")');
                return $this->respuesta = ['guardado'];
            }
           
          /*  
            $this->db->consultas('IF EXISTS (SELECT * FROM usuarios WHERE uid = '.$this->datos['uid'].')
            BEGIN
               Set @existeUsuario=1
            END
            IF  @existeUsuario=1      
            BEGIN
            DELETE  FROM usuarios WHERE usuarios.uid = '.$this->datos['uid'].'
            end
            else
            begin
            INSERT INTO usuarios (uid, displayname, email, fechanacimiento, tipocuenta) VALUES("'.$this->datos['uid'].'", "'.$this->datos['displayname'].'", "'.$this->datos['email'].'", "'.$this->datos['fechanacimiento'].'", "'.$this->datos['tipocuenta'].'")
            end'); */
            
        }
        
    }
    
?> 