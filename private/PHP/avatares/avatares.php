<?php
/*
*@autor Douglas Alexander Hernandez douglasalexander683@gmail.com
*/
include('../config/config.php');
$avatares= new avatares($conexion);

$proceso='';

if(isset($_GET['proceso']) && strlen($_GET['proceso'])>0){
    $proceso=$_GET['proceso'];
}

$avatares->$proceso($_GET['valor']);

print_r(json_encode($avatares->respuesta));

/*
 * @class avatares
*/
class avatares{
    
    public $respuesta=['msg'=>'correcto'];

    public function __construct($bd){
        $this->bd=$bd;
    }
    /*
    *@function buscarAvatares se encarga de traer las URL de los avatares que el usuario puede escoger
    *Estos avatares son con los que puede personalizar su foto de perfil
    */
    public function buscarAvatares(){
        $this->bd->consultas('
        SELECT avatares.idAvatar, avatares.nombreAvatar, avatares.urlAvatar
        FROM avatares
        ');
        return $this->respuesta=$this->bd->obtener_datos();
    }
}
?>