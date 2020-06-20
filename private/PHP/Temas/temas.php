<?php
/**
 * @author Douglas Alexander Hernandez Flores douglasalexander683@gmail.com
 */

include('../config/config.php');
$tema= new tema($conexion);

$proceso='';

if(isset($_GET['proceso']) && strlen($_GET['proceso'])>0){
    $proceso=$_GET['proceso'];
}

$tema->$proceso($_GET['valor']);

print_r(json_encode($tema->respuesta));

class tema{
    
    public $respuesta=['msg'=>'correcto'];

    public function __construct($bd){
        $this->bd=$bd;
    }
    /**
     * @method buscarTemas obtiene el listado de temas disponibles en nuestra plataforma y a su vez se encarga de filtrarlos
     */
    public function buscarTemas($valor=''){
        $this->bd->consultas('
        SELECT temas.idTema, temas.tema, temas.descripcion
        FROM temas
        WHERE temas.tema LIKE "%'.$valor.'%"
        ');
        return $this->respuesta=$this->bd->obtener_datos();
    }
}
?>