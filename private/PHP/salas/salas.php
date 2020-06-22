<?php
    /**
     * @author Josue Isaac Aparicio Diaz josue9aparicio@gmail.com
     * @author Douglas Alexander Hernandez Flores douglasalexander683@gmail.com
     */
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
        /**
         * @method recibirDatos es un constructor que se encarga de recibir los datos que le enviamos desde Frontend
         */
        public function recibirDatos($sala){
            $this->datos = json_decode($sala, true);
            
            /**
             * @param datos['identificador'] se encarga de identificar la accion que se va a realizar
             */
            if ($this->datos['identificador']=='correo'){
                $this->enviarCorreo();
            }else{
                $this->almacenar_sala();

            }
        }
        
        /**
         * @method almacenar_sala se encarga de guardar las salas creadas
         * @param datos['codigoSala'] es el codigo que se le asigno a la sala
         * @param datos['uid'] es el identificador del usuario que creo la sala
         */
        private function almacenar_sala(){
            $this->db->consultas('INSERT INTO salas (uidCreador, codigoSala) 
                VALUES("'.$this->datos['uid'].'", "'.$this->datos['codigoSala'].'")');
                return $this->respuesta = ['guardado'];         
        }

        /**
         * @method buscarSala se encarga de buscar las salas que coincidan con el codigo de l sala
         */
        public function buscarSala($sala=''){
            $this->db->consultas('
            SELECT salas.uidCreador, salas.codigoSala
            FROM salas
            WHERE salas.codigoSala= "'.$sala.'"');
             return $this->respuesta=$this->db->obtener_datos();
        }

        /**
         * @method enviarCorreo se encarga de enviar un correo al usuario cuando es eliminado de una sala
         * @param $mail usa una clase PHPMailer para poder enviar correos desde localhost usando Xamp
         */
        private function enviarCorreo(){
            //CONFIGURANDO EL SERVIDOR DE PHPMAILER
            require 'PHPMailer/PHPMailerAutoload.php';
            $mail = new PHPMailer;
            
            //$mail->SMTPDebug = 3;                               // Enable verbose debug output
            
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'hiperefe.contact@gmail.com';                 // SMTP username
            $mail->Password = 'hiperEFE2020';                           // SMTP password
            $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587;                                    // TCP port to connect to
            
            $mail->setFrom('hiperefe.contact@gmail.com', 'HIPER EFE CONTACT');
            $mail->addAddress($this->datos['email'], 'Usuario de HIPER EFE');     // Add a recipient

            
            $mail->isHTML(true);                                  // Set email format to HTML
            
            $mail->Subject = 'Eliminado de una sala de estudio';
            $mail->Body    = 'Lamentamos informarle que usted ha sido eliminado de la sala de estudio '.$this->datos['sala'].'<br>Su docente ha proporcionado las siguientes causas de esta decision: <br>' .$this->datos['motivo']. ' <br><b>Le exortamos a que haga uso adecuado de nuestra plataforma para disfrutar de una mejor experiencia.</b>';
            
            if(!$mail->send()) {
                return $this->respuesta = 'error'; //. $mail->ErrorInfo;
            }else {
                return $this->respuesta = 'success';
            } 
        }

        }
?> 