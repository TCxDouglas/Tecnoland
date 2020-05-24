var listaSalas = [];
var perfil = new Vue({
    el: '#vista-perfil',
    data: {
        usuario: {
            uid: '',
            displayName: 'Douglas Hernandez',
            photoURL: ''
        },
        salas: []
    },
    methods: {
        datosUsuario: function () {
            perfil.usuario.uid = sessionStorage.getItem('uid');
            perfil.usuario.displayName = sessionStorage.getItem('displayName');
            perfil.usuario.photoURL = sessionStorage.getItem('photoUrl');

        },
        obtenerSalas: function () {
            firebase.database().ref('Tecnoland').child('usuarios').child(perfil.usuario.uid).child('salas').once('value').then(function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(salaSnapshot => {
                        let key = salaSnapshot.key;
                        let array = {
                            codigoSala: salaSnapshot.key,
                            nombreSala: salaSnapshot.val().nombreSala,
                            descripcion: salaSnapshot.val().descripcion,
                            numParticipantes: 0
                        }
                        listaSalas.push(array);
                    });
                }
            });
            this.salas = listaSalas;
            console.log(this.salas);

        },
        crearSala: function () {
            window.location = 'crear-salas.html'
        },
        mandarDatos: function (filaSala) {

            console.log(modalPerfil.infoSala)
            sessionStorage.setItem('codigoSala', filaSala.codigoSala)
            sessionStorage.getItem('nombreSala', filaSala.nombreSala)
            sessionStorage.setItem('uidCreador',this.usuario.uid)
            window.location = 'sala-study.html'
        },
        cerrarSesion: function () {
            sessionStorage.removeItem('displayName');
            sessionStorage.removeItem('photoUrl');
            sessionStorage.removeItem('uid');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('nacimiento');
            sessionStorage.removeItem('tipoCuenta');
            window.location = '../../index.html'
        }
    },
    created: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                perfil.datosUsuario();
                perfil.obtenerSalas();
            } else {
                window.location = '../../index.html'
            }
        });
        
    }
})

var modalPerfil = new Vue({
    el: '#modalLista',
    data: {
        infoSala: {
            nombreSala: '',
            codigoSala: '',
            descripcion: ''
        }
    },
    methods: {
        colocarDatos: function () {

        }
    }
})