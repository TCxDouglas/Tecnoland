

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
                    uid: sessionStorage.getItem('uid')
                };
                socket.emit('enviarMensaje', envMesg);
                socket.emit('historial');
                console.log(envMesg);
                envMesg.user = '';
                envMesg.msg = '';
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

               <div class="d-flex justify-content-end" style="margin-top: 5px;">
                   <span class="badge badge-pill badge-info">${item.msg}</span>
               </div>`
                    
                } else{
                    contenido.innerHTML += `
                    <div class="d-flex justify-content-start">
                    <small class="text-muted"style="margin-top: 5px;">${item.user}:</small>
                </div>
                <div class="d-flex justify-content-start">
                    <span class="badge badge-pill badge-secondary">${item.msg}</span>
                </div>`
                }
                contenido.scrollTop = contenido.scrollHeight;
            });
        });
    