
const contenido = document.querySelector('#contenidoChat');
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
                    user: sessionStorage.getItem('uid'),
                    msg:  document.querySelector('#inputMsg').value.trim(),
                    fecha: Date.now()
                };
                socket.emit('enviarMensaje', envMesg);
                console.log(envMesg);
                envMesg.user = '';
                envMesg.msg = '';
                envMesg.fecha = '';
            },

        },
        created(){
            socket.emit('chatHistory');
        }
    });
    socket.on('recibirMensaje',msg=>{
        revMesg = msg;
        document.querySelector('#msgg').innerHTML =''+ msg.msg;
        console.log(msg);
    });
    socket.on('chatHistory',msgs=>{
         revMesg = [];
        msgs.forEach(item => {
            if (sessionStorage.getItem('uid')==item.user){
                contenido.innerHTML += `
                <div class="d-flex justify-content-end">
                <span class="badge badge-pill badge-light" style="margin-top: 5px;">${item.msg}</span>
            </div>`
                
            } else{
                contenido.innerHTML += `
                <div class="d-flex justify-content-start">
                <span class="badge badge-pill badge-secondary" id="msgg" style="margin-top: 5px;">${item.msg}</span>
            </div>`
            }
             console.log(item.msg);
        });
    });
