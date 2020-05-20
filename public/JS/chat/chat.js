
var socket = io.connect("http://localhost:3001",{'forceNew':true});
const formulario = document.querySelector('#frmEnviarMsg');
const contenido = document.querySelector('#contenidoChat');
var mensaje = document.querySelector('#inputMsg');


document.adeventlistener (DOMContentLoad, (e) =>{
    socket.emit('chatHistory');

})

socket.on('recibirMensaje',msg=>{
    console.log(msg);
    //appchat.msgs.push(msg);
});
socket.on('chatHistory',msgs=>{
   // appchat.msgs = [];
    msgs.forEach(item => {
      // appchat.msgs.push(item.msg);
    });
});
formulario.addEventListener('submit', (e) => {
    var contMsg = [];
    contMsg = {
        user: '9838hhajx87u',
        msg:  mensaje.value,
        fecha: Date.now()
    }
    e.preventDefault();
    if(!mensaje.value.trim()){
        console.log ('Caja de texto vacia');
        return
    }
    console.log(mensaje.value);
    socket.emit('enviarMensaje', contMsg);
    mensaje.value= '';
})

function traerHistorial(){

}

var  appchat = new Vue({
        el:'#frm-chat',
        data:{
            msg : '',
            msgs : []
        },
        methods:{
            enviarMensaje(){
                socket.emit('enviarMensaje', this.msg);
                this.msg = '';
            },
            limpiarChat(){
                this.msg = '';
            }
        },
        created(){
            socket.emit('chatHistory');
        }
    });
    socket.on('recibirMensaje',msg=>{
        console.log(msg);
        appchat.msgs.push(msg);
    });
    socket.on('chatHistory',msgs=>{
        appchat.msgs = [];
        msgs.forEach(item => {
            appchat.msgs.push(item.msg);
        });
    });