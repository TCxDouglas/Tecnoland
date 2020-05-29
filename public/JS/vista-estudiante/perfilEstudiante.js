

var perfilEstudiante=new Vue({
    el: '#vista-estudiante',
    data:{
        usuario: {
            uid: '',
            displayName: 'Douglas Hernandez',
            photoURL: '',
            email: ''
        },
        sala: []
    },
    methods: {
        obtenerSalas: function(){
            let listaSalas = []
            firebase.database().ref('Tecnoland').child('usuarios').child(this.usuario.uid).child('unionSala').once('value').then(function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(salaSnapshot => {
                        //let key = salaSnapshot.key;
                        let array = {
                            codigoSala: salaSnapshot.key,
                            nombreSala: salaSnapshot.val().nombreSala,
                            descripcion: salaSnapshot.val().descripcion,
                            uidCreador: salaSnapshot.val().creadorSala
                        }
                        listaSalas.push(array);
                    });
                }
            })
            this.sala = listaSalas;
        },
        mandarDatos: function (filasala) {
            sessionStorage.setItem('codigoSala',filasala.codigoSala)
            sessionStorage.setItem('nombreSala', filasala.nombreSala)
            sessionStorage.setItem('uidCreador', filasala.uidCreador)
            window.location='sala-study.html'
        },
        cerrarSesion: function () {
            sessionStorage.clear()
            window.location = '../../index.html'
        }
    },
    created: function() {
        this.usuario.uid = sessionStorage.getItem('uid');
        this.usuario.displayName = sessionStorage.getItem('displayName');
        this.usuario.photoURL = sessionStorage.getItem('photoUrl');
        this.usuario.email = sessionStorage.getItem('email');
        this.obtenerSalas()
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
                    console.log(resp)
                    if(resp!=""){
                        array = resp;
                        console.log(modalEstudiante.datos)
                        //let id = modalEstudiante.datos.uidCreador;
                        agregarIntegrante(array[0].uidCreador, modalEstudiante.codigoSala)
                    }else{
                        console.log('La sala no existe')
                        alertify.error('La sala no existe');
                    }
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

function agregarIntegrante(uidCreador,codigoSala){
    firebase.database().ref('Tecnoland').child('usuarios').child(uidCreador).child('salas').child(codigoSala).child('integrantes').child(perfilEstudiante.usuario.uid).set({
        displayName: perfilEstudiante.usuario.displayName,
        email: perfilEstudiante.usuario.email,
        photoURL: perfilEstudiante.usuario.photoURL
    }).then(function () {
        console.log('Añadido a la sala')
        obtenerDatosSala(uidCreador, codigoSala)
    }).catch(function (error) {
        console.log(error.message);
    })
}

function agregarRegistro(uidCreador, codigoSala, nombreSala, descripcion){
    firebase.database().ref('Tecnoland').child('usuarios').child(sessionStorage.getItem('uid')).child('unionSala').child(codigoSala).set({
        creadorSala: uidCreador,
        codigoSala: codigoSala,
        nombreSala: nombreSala,
        descripcion: descripcion
    }).then(function(){
        console.log('Registro añadido')
        perfilEstudiante.obtenerSalas()
        $('#staticBackdrop').modal('hide')
        //window.location = 'sala-study.html'
    }).catch(function(error){
        console.log(error.message)
    })
}

function obtenerDatosSala(uidCreador, codigoSala){
    firebase.database().ref('Tecnoland').child('usuarios').child(uidCreador).child('salas').child(codigoSala).once('value').then(function (snapshot) {
        if (snapshot.val()) {  
            let nombreSala= snapshot.val().nombreSala
            let descripcion= snapshot.val().descripcion
            agregarRegistro(uidCreador, codigoSala, nombreSala, descripcion)
        }
    });
}