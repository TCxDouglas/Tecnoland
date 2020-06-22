/**@author Josue Isaac Aparicio */
//NOTA: Este archivo debe de ir en la carpeta de node -> C:\Program Files\nodejs
var http = require('http').Server(),
    io = require('socket.io')(http),
    MongoClient = require('mongodb').MongoClient,
    url = 'mongodb://localhost:27017',
    dbName = 'chatTecnoland';

const webpush = require('web-push'),
    vapidKeys = {
        publicKey: 'BMdDUnI_FZb06jamPiShmB8G6_pdN_n-xlB5FLUrbWdSJP5mdULwDYJ6bawLHVZxDb6ns401v6BsN9lRkZSfLNo',
        privateKey: '6w85kqTxZ7HNQJgCBKr04T5D93GlkvIfYM9MGMqNhGc'
    };
var pushSubcriptions; //debe de almacenarse en una BD.
webpush.setVapidDetails("mailto:hiperefe.contact@gmail.com", vapidKeys.publicKey, vapidKeys.privateKey);


io.on('connection', function (socket) {

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
                    title: 'HIPER EFE en ',
                    pmsg: {
                        'user': datos.user,
                        'msg': datos.msg,
                        'fecha': datos.fecha,
                        'photo': datos.photo,
                        'uid': datos.uid,
                        'sala': datos.Nsala
                    }

                });
                console.log("Endpoint: ", pushSubcriptions.endpoint);
                webpush.sendNotification(pushSubcriptions, dataPush);
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
                if (datas == '') {
                    console.log('no hay nada');
                } else {
                    io.emit('historial', datas);
                }
            });
            //console.log(err);
        });
    });

    socket.on("suscribirse", (subcriptions) => {
        pushSubcriptions = JSON.parse(subcriptions);
        console.log(pushSubcriptions.endpoint);
    });
});
http.listen(3001, () => {
    console.log('Escuchando peticiones por el puerto 3001, okey');
});