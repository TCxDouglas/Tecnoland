<?php
include('../config/config.php');
$avatares= new tema($conexion);

$proceso='';

if(isset($_GET['proceso']) && strlen($_GET['proceso'])>0){
    $proceso=$_GET['proceso'];
}

$avatares->$proceso($_GET['valor']);

print_r(json_encode($avatares->respuesta));

class tema{
    
    public $respuesta=['msg'=>'correcto'];

    public function __construct($bd){
        $this->bd=$bd;
    }

    public function buscarAvatares(){
        $this->bd->consultas('
        SELECT avatares.idAvatar, avatares.nombreAvatar, avatares.urlAvatar
        FROM avatares
        ');
        return $this->respuesta=$this->bd->obtener_datos();
    }
}
?>