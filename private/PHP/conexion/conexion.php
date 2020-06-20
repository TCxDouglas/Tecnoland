<?php
/**CLASE PRINCIPAL DE CONEXION A LA BASE DE DATOS DESDE PHP -> MYSQL */

class BD 
{
   private $conexion, $result;
   public function BD($server, $user, $pass, $db){
       $this->conexion=mysqli_connect($server, $user, $pass, $db) or die(mysqli_error('No se pudo Conectar al server de BD'));
   }

   /**@function consultas se encarga de ejecutar la consulta SQL que le enviemos
    * @param $sql Recibe la consulta SQL como string
    */
   public function consultas($sql){
       $this->result = mysqli_query($this->conexion, $sql) or die(mysqli_error());
   }

   /*
   *@function obtener_datos se encarga de traer la respuesta de la consulta que ejeucto la @function consultas 
   */
   public function obtener_datos(){
       return $this->result->fetch_all(MYSQLI_ASSOC);
   }

   public function obtener_respuesta(){
       return $this->result;
   }

   public function id(){
       return $this->result->id();
   }
}
?>