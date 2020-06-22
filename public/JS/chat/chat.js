/**@author Josue Isaac Aparicio Diaz */
var socket = io.connect("http://localhost:3001", {
        'forceNew': true
    }),
    mensaje = document.querySelector('#inputMsg'),
    nomSala = document.querySelector('#nombreSala'),
    msgComplete = [],
    appchat = new Vue({
        el: '#frmChat',
        data: {

            msg: '',

        },
        methods: {
            enviarMensaje() {
                if (!document.querySelector('#inputMsg').value.trim() == '') {
                    var envMesg = {
                        user: sessionStorage.getItem('displayName'),
                        msg: document.querySelector('#inputMsg').value.trim(),
                        fecha: Date.now(),
                        photo: sessionStorage.getItem('photoUrl'),
                        uid: sessionStorage.getItem('uid'),
                        sala: sessionStorage.getItem('codigoSala'),
                        Nsala: sessionStorage.getItem('nombreSala')
                    };
                    socket.emit('enviarMensaje', envMesg);
                    envMesg.user = '';
                    envMesg.msg = '';
                    envMesg.photo = '';
                    envMesg.fecha = '';
                    envMesg.uid = '';
                    envMesg.sala = '';
                    envMesg.Nsala = '';
                    document.querySelector('#inputMsg').value = '';
                }

            },

        },
        created() {
            socket.emit('historial', sessionStorage.getItem('codigoSala'));
            nomSala.innerHTML = sessionStorage.getItem('nombreSala');
        }
    });
socket.on('recibirMensaje', msg => {
    if (sessionStorage.getItem('codigoSala') === msg.sala){
        msgComplete.push(msg);
        if (sessionStorage.getItem('uid') === msg.uid) {
            getMsgSend(msg)
        }else{
            $.notification("HIPER EFE en " + sessionStorage.getItem('nombreSala'), msg.user + ': ' + msg.msg, '../imagenes/ficon.png');
            getMsgEntry(msg)
        }
    }
    
});

socket.on('historial', msgs => {
    console.log(msgs[0].sala)

    if (msgs[0].sala != '') {

        if (msgs[0].sala == sessionStorage.getItem('codigoSala')) {
            msgComplete = msgs;
            getHistoryMsg(msgs);
        } else {
            //console.log('No perteneces aqui')
        }
    }
});


function getHistoryMsg(msgs) {
    var contenido = document.querySelector('#contenidoChat');
    contenido.innerHTML = '';
    
    //console.log(msgs);
    //console.log('trae');
    //console.log(contenido);
    msgs.forEach(item => {

        if (sessionStorage.getItem('uid') === item.uid) {
            contenido.innerHTML += `
                   <div class="env-chat">
                   <div class="env-msg">
                       
                           <p>${item.msg}</p>
                           <span class="useer">${item.user} <small class="time">${new Date(item.fecha).toDateString()}</small></span>

                   </div>
                   <div class="env-chat-img">
                       <img src="${item.photo}" >
                   </div>
               </div>`;

        } else {
            contenido.innerHTML += `
                    <div class="reciv-chat">
                    <div class="reciv-chat-img">
                        <img src="${item.photo}" >
                    </div>
                    <div class="reciv-msg">
                        <div class="reciv-msginbox">
                            <p class="p">${item.msg}</p>
                            <span class="useer">${item.user} <small class="time">${new Date(item.fecha).toDateString()} </small></span>

                        </div>
                    </div>
                    </div>`;
        }
        contenido.scrollTop = contenido.scrollHeight;
    });
}

function getMsgEntry(message){
    var contenido = document.querySelector('#contenidoChat');

    contenido.innerHTML += `
                    <div class="reciv-chat">
                    <div class="reciv-chat-img">
                        <img src="${message.photo}" >
                    </div>
                    <div class="reciv-msg">
                        <div class="reciv-msginbox">
                            <p class="p">${message.msg}</p>
                            <span class="useer">${message.user} <small class="time">${new Date(message.fecha).toDateString()} </small></span>

                        </div>
                    </div>
                    </div>`;
    contenido.scrollTop = contenido.scrollHeight;
}

function getMsgSend(message){
    var contenido = document.querySelector('#contenidoChat');

    contenido.innerHTML += `
                   <div class="env-chat">
                   <div class="env-msg">
                       
                           <p>${message.msg}</p>
                           <span class="useer">${message.user} <small class="time">${new Date(message.fecha).toDateString()}</small></span>

                   </div>
                   <div class="env-chat-img">
                       <img src="${message.photo}" >
                   </div>
               </div>`;
    contenido.scrollTop = contenido.scrollHeight;
}