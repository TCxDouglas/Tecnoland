const mongo =require('mongodb').MongoClient;
const client= require('socket.io').listen(4000).sockets

//Conexion al MangoRolo
mongo.connect('mongodb://127.0.0.1/Tecnoland', function(error, db){
    if(error){
        
    }
    console.log('Conexion a MangoRolo')
})