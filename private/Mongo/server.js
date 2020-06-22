//NOTA: Este archivo debe de ir en la carpeta de node -> C:\Program Files\nodejs
var http = require('http').Server(),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chatTecnoland';

io.on('connection',  function(socket) {

    console.log(socket.handshake.query.idsala)

    const webpush = require('web-push'),
    vapidKeys = {
        publicKey:'BCE_ynm6DB-R2_0FJg3vZar28lGWpIwiMBs3w73yrrdlGgWKsTpqmu7gs3oFIirigeaLbUS_yMMAqDeMWsFb-Gg',
        privateKey:'eVq5OD-9sMr2t1djw4TWBBhUx5kmFo2x4jZz4NeZ80c'
    };
var pushSubcriptions;//debe de almacenarse en una BD.
webpush.setVapidDetails("mailto:luishernandez@ugb.edu.sv",vapidKeys.publicKey, vapidKeys.privateKey);

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
            try {
                const dataPush = JSON.stringify({
                   title:'HIPER EFE en ' + datos.Nsala,
                    msg :datos.msg,
                    img: datos.photo

                });
                console.log( "Endpoint: ", pushSubcriptions.endpoint );
                webpush.sendNotification(pushSubcriptions,dataPush);
            } catch (error) {
                console.log("Error al intentar enviar la notificacion push", error);
            }
        });
    });

    socket.on('historial', (sala) => {
        MongoClient.connect(url, (err, client) => {
            const db = client.db(dbName);
            db.collection(sala).find({}).toArray((err, datas) => {
                console.log(datas);
                if(datas ==''){
                    console.log('no hay nada');
                } else {
                    io.emit('historial', datas);
                }
            });
            //console.log(err);
        });
    });

    socket.on("suscribirse",(subcriptions)=>{
        pushSubcriptions = JSON.parse(subcriptions);
        console.log( pushSubcriptions.endpoint );
    });
});
http.listen(3001, () => {
    console.log('Escuchando peticiones por el puerto 3001, okey');
});