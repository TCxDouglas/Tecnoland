<?php
 /**
  * @author Douglas Alexander Hernandez Flores douglasalexander683@gmail.com
  */
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
        /**
         * @method obtener_datos se encarga de guardar los datos que le enviemos de FrontEnd
         * @param datos['accion'] se encarga de identificar la accion a realizar
         */
        public function obtener_datos($usuario){
            $this->datos = json_decode($usuario, true);
            if ($this->datos['accion']=='update'){
                $this->updateUser();
            } else {
                $this->almacenar_usuario();
            }
           
        }
    
       /**
        * @method almacenar_usuario se encarga de guardar los datos del usuario cuando su cuenta esta siendo creada
        */
        private function almacenar_usuario(){
            /**
             * @param $GG recibe una respuesta, la cual usamos para validar si la cuenta ya existe
             */
            $this->db->consultas('SELECT * FROM usuarios WHERE uid = "'. $this->datos['uid'].'"');
            $GG = $this->db->obtener_datos();
            $cont = count($GG);
            if ($cont>0){
                //Si hay datos existentes retorna los datos del usuario
                return $this->respuesta = $GG;
            }
            else if($this->datos['accion']=='guardar'){
                // Si no hay datos y la accion es guardar, almacena los datos en la respectiva tabla
                $this->db->consultas('INSERT INTO usuarios (uid, displayname, email, fechanacimiento, tipocuenta, conocimiento) 
                VALUES("'.$this->datos['uid'].'", "'.$this->datos['displayname'].'", "'.$this->datos['email'].'", "'.$this->datos['fechanacimiento'].'", "'.$this->datos['tipocuenta'].'", "'.$this->datos['conoc'].'")');
                return $this->respuesta = ['guardado'];
            }
            else{
                return $this->respuesta =['sinCambios'];
            }
            
        }

        /**
         * @method updateUser se encarga de actualizar los datos del usuario cuando son modificados
         */
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