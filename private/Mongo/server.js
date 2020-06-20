//NOTA: Este archivo debe de ir en la carpeta de node -> C:\Program Files\nodejs
var http = require('http').Server(),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chatTecnoland';

io.on('connection', socket => {
    socket.on('enviarMensaje', (datos) => {
        MongoClient.connect(url, (err, client) => {
            const db = client.db(dbName);
            db.collection(datos.sala).insertOne({
                'user': datos.user,
                'msg': datos.msg,
                'fecha': datos.fecha,
                'photo': datos.photo,
                'uid': datos.uid,
                'sala': datos.sala
            });
            io.emit('recibirMensaje', datos);
        });
    });
    socket.on('historial', (sala) => {
        MongoClient.connect(url, (err, client) => {
            const db = client.db(dbName);
            db.collection(sala).find({}).toArray((err, datas) => {
                io.emit('historial', datas);
            });
            //console.log(err);
        });
    });
});
http.listen(3001, () => {
    console.log('Escuchando peticiones por el puerto 3001, okey');
});