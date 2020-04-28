let temasEscogidos = [];

var sala = new Vue({
    el: '#vista-sala',
    data: {
        temas: [],
        valor: '',
        nombreSala: '',
        descripcionSala: '',
        numeroParticipantes: '',
        codigoSala: '',
        datosUsuario: {
            uid: '',
            displayName: '',
            photoURL: ''
        }
    },
    methods: {
        obtenerTemas: function () {

            fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${this.valor}`).then(resp => resp.json()).then(resp => {
                console.log(resp);
                this.temas = resp;
            });
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log(user);
                    sala.datosUsuario.uid = user.uid;
                    sala.datosUsuario.displayName = user.displayName;
                    sala.datosUsuario.photoURL = user.photoURL;
                    //console.log(sala.datosUsuario);
                } else {
                    console.log('Me Cago en Java');
                }
            });
            //console.log(this.datosUsuario);
        },
        escogiendoTemas: function () {

            alertify.confirm('Alerta', '¿Está seguro de crear la sala con los temas seleccionados?', function () {
                let listaCheckbox = document.getElementsByName('checkLista');
                for (let i = 0; i < sala.temas.length; i++) {
                    if (listaCheckbox[i].checked) {
                        console.log('es verdadero')
                        temasEscogidos.push(sala.temas[i]);
                    } else {
                        console.log('es falso')
                    }
                }
                sala.guardarDatos();
                console.log(temasEscogidos)
            }, function () {
                alertify.error('Cancelado');

            });

            
        },
        guardarDatos: function () {
            document.getElementById('Verificando').style.display='block';
            firebase.database().ref('Tecnoland').child('usuarios').child(sala.datosUsuario.uid).child('salas').child(this.codigoSala).set({
                nombreSala: this.nombreSala,
                descripcion: this.descripcionSala,
                temas: temasEscogidos
            }).then(function () {
                console.log('SALA CREADA')
                window.location='perfil.html'
            }).catch(function (error) {
                console.log(error.message);
            })
        },
        vistaPerfil: function () {
            window.location = 'perfil.html'
        }
    },
    created: function () {
        this.obtenerTemas();
    }
});