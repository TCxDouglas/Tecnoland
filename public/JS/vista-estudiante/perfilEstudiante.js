let array=[]
var perfilEstudiante=new Vue({
    el: '#vista-estudiante',
    data:{
        usuario: {
            uid: '',
            displayName: 'Douglas Hernandez',
            photoURL: ''
        }
    },
    methods: {
        
    },
    created: function() {
        this.usuario.uid = sessionStorage.getItem('uid');
        this.usuario.displayName = sessionStorage.getItem('displayName');
        this.usuario.photoURL = sessionStorage.getItem('photoUrl');
    }
})

var modalEstudiante = new Vue({
    el: '#contenedorModal',
    data:{
        codigoSala:'',
        uid: '',
        datos:[]
    },
    methods: {
        verificarSala: function () {
            //console.log(this.codigoSala)
            if(this.codigoSala!=""){
                //cambioVista(true)
                fetch(`../../private/PHP/salas/salas.php?proceso=buscarSala&sala=${this.codigoSala}`).then(resp => resp.json()).then(resp => {
                    array=resp;
                    console.log(modalEstudiante.datos)
                    //let id = modalEstudiante.datos.uidCreador;
                    console.log(resp)
                    console.log(array)
                    console.log(array[0].uidCreador)
                    console.log(modalEstudiante.codigoSala)
                    agregarIntegrante(array[0].uidCreador, modalEstudiante.codigoSala)
                });
                
            }else{
                console.log('Campo Vacio')
            }
            //console.log(this.datos.uidCreador);
        },
        cancelar: function(){
            cambioVista(false)
            this.codigoSala='';
        }
    }
})


function cambioVista(validar){
    let bodyModal = document.querySelector('#cargando');
    if(validar){
        fetch(`../modulos/verificandoSala.html`).then(function (respuesta) {
            return respuesta.text();
        }).then(function (respuesta) {
            bodyModal.innerHTML = respuesta;
        })
    }else{
        bodyModal.innerHTML="";
    }
    
    
}

function agregarIntegrante(uid,codigoSala){
    firebase.database().ref('Tecnoland').child('usuarios').child(uid).child('salas').child(codigoSala).child('integrantes').child(perfilEstudiante.usuario.uid).set({
        displayName: perfilEstudiante.usuario.displayName,
        photoURL: perfilEstudiante.usuario.photoURL
    }).then(function () {
        console.log('Añadido a la sala')
        //window.location = '../../vistas/sala-study.html'
    }).catch(function (error) {
        console.log(error.message);
    })
}