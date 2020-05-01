<?php
/**CLASE PRINCIPAL DE CONEXION A LA BASE DE DATOS DESDE PHP -> MYSQL */

class BD 
{
   private $conexion, $result;
   
   public function BD($server, $user, $pass, $db){
       $this->conexion=mysqli_connect($server, $user, $pass, $db) or die(mysqli_error('No se pudo Conectar al server de BD'));
   }

   public function consultas($sql){
       $this->result = mysqli_query($this->conexion, $sql) or die(mysqli_error());
   }

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