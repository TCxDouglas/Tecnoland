

var socket = io.connect("http://localhost:3001",{'forceNew':true}),
mensaje = document.querySelector('#inputMsg'),
revMesg = [],   
 appchat = new Vue({
        el:'#frmChat',
        data:{

            msg : '',

        },



        methods:{
            enviarMensaje(){
              var  envMesg  =
                {
                    user: sessionStorage.getItem('displayName'),
                    msg:  document.querySelector('#inputMsg').value.trim(),
                    fecha: Date.now(),
                    photo: sessionStorage.getItem('photoUrl'),
                    uid: sessionStorage.getItem('uid')
                };
                socket.emit('enviarMensaje', envMesg);
                socket.emit('historial');
                console.log(envMesg);
                envMesg.user = '';
                envMesg.msg = '';
                envMesg.photo = '';
                envMesg.fecha = '';
                envMesg.uid = '';

                document.querySelector('#inputMsg').value = ''; 
            },

        },
        created(){
            socket.emit('historial');
        }
    });
   socket.on('recibirMensaje',msg=>{
        revMesg = msg;
        console.log(msg);
    });

    
        socket.on('historial',msgs=>{
            
            var contenido = document.querySelector('#contenidoChat');
            contenido.innerHTML='';
             revMesg = [];
             console.log(msgs);
             console.log('trae')
             console.log(contenido);
            msgs.forEach(item => {
                
                if (sessionStorage.getItem('uid')===item.uid){
                   contenido.innerHTML += `
                   <div class="env-chat">
                   <div class="env-msg">
                       
                           <p>${item.msg}</p>
                           <span class="useer">${item.user} <small class="time">${new Date(item.fecha).toDateString()}</small></span>

                   </div>
                   <div class="env-chat-img">
                       <img src="${item.photo}" >
                   </div>
               </div>`
                    
                } else{
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
                    </div>`
                }
                contenido.scrollTop = contenido.scrollHeight;
            });
        });
    
        function haber(){
            console.log(document.querySelector('#inputMsg').value.trim())
        }