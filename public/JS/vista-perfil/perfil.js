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
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log(user);
                    perfil.usuario.uid = user.uid;
                    perfil.usuario.displayName = user.displayName;
                    perfil.usuario.photoURL = user.photoURL;
                    //console.log(sala.datosUsuario);
                    console.log(perfil.usuario);
                    perfil.obtenerSalas();
                } else {
                    window.location = '../../index.html'
                }
            });
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
            
            modalPerfil.infoSala.nombreSala=filaSala.nombreSala;
            modalPerfil.infoSala.codigoSala = filaSala.codigoSala;
            modalPerfil.infoSala.descripcion = filaSala.descripcion;
            console.log(modalPerfil.infoSala)
        }
    },
    created: function () {
        this.datosUsuario();
    }
})

var modalPerfil=new Vue({
    el: '#modalLista',
    data:{
        infoSala:{
            nombreSala:'',
            codigoSala:'',
            descripcion:''
        }
    },
    methods:{
        colocarDatos: function(){

        }
    }
})