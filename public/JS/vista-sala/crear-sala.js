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
                    console.log(user);
                    sala.datosUsuario.uid = user.uid;
                    sala.datosUsuario.displayName = user.displayName;
                    sala.datosUsuario.photoURL = user.photoURL;
                    //console.log(sala.datosUsuario);
                } else {
                    window.location='../../index.html'
                }
            });
            //console.log(this.datosUsuario);
        },
        escogiendoTemas: function () {

            alertify.confirm('Alerta', '¿Está seguro de crear la sala con los temas seleccionados?', function () {
                let listaCheckbox = document.getElementsByName('checkLista');
                for (let i = 0; i < sala.temas.length; i++) {
                    if (listaCheckbox[i].checked) {
                        //console.log('es verdadero');
                        temasEscogidos.push(sala.temas[i]);
                    }
                }
                sala.guardarDatos();
                console.log(temasEscogidos)
            }, function () {
                alertify.error('Cancelado');

            });

            
        },
        guardarDatos: function () {
            this.codigoSala =this.datosUsuario.displayName.substring(0,2).toLowerCase() + this.datosUsuario.uid.substring(0,2).toLowerCase() + generarNumero(1000, 9999);
            
            let uid=this.datosUsuario.uid;
            let codigoSala= this.codigoSala;
            let identificador = 'kk';
            let salaPHP={
                uid,
                codigoSala,
                identificador
            }
            document.getElementById('Verificando').style.display='block';

            fetch(`../../private/PHP/salas/salas.php?proceso=recibirDatos&sala=${JSON.stringify(salaPHP)}`).then(resp => resp.text()).then(resp =>{
                console.log(resp)
            })

            let maxParticipantes = document.getElementById('selMax').value;
            console.log(maxParticipantes);
            firebase.database().ref('Tecnoland').child('usuarios').child(sala.datosUsuario.uid).child('salas').child(this.codigoSala).set({
                nombreSala: this.nombreSala,
                descripcion: this.descripcionSala,
                maxParticipantes: maxParticipantes,
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


function generarNumero(minimo,maximo){
    return Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
}