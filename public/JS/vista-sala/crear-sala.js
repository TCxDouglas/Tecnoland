
let temasEscogidos=[];

var sala= new Vue({
    el: '#vista-sala',
    data:{
        temas:[],
        valor:'',
        nombreSala:'',
        descripcionSala: '',
        numeroParticipantes: '',
        codigoSala: '',
        datosUsuario: {
            uid: '',
            displayName: '',
            photoURL: ''
        }
    },
    methods:{
        obtenerTemas : function(){
            
            fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${this.valor}`).then(resp => resp.json()).then(resp => {
                console.log(resp);
                this.temas=resp;
            });
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    //console.log(user);
                    sala.datosUsuario.uid=user.uid;
                    sala.datosUsuario.displayName=user.displayName;
                    sala.datosUsuario.photoURL=user.photoURL;
                    //console.log(sala.datosUsuario);
                } else {
                    console.log('Me Cago en Java');
                }
            });
            
            //console.log(this.datosUsuario);
        },
        escogiendoTemas : function(tema){
            if(!(temasEscogidos.includes(tema)))
            temasEscogidos.push(tema);
            console.log(temasEscogidos);
        },
        eliminandoTemas : function(tema){
            temasEscogidos.splice(tema.id, 1);
            console.log(temasEscogidos);
        },
        guardarDatos : function(){
            
            firebase.database().ref('Tecnoland').child('usuarios').child(sala.datosUsuario.uid).child('salas').child(this.codigoSala).set({
                nombreSala: this.nombreSala,
                descripcion: this.descripcionSala,
                temas: temasEscogidos
            }).then(function(){
                console.log('SALA CREADA')
            }).catch(function(error){
                console.log(error.message);
            })
        },
        vistaPerfil: function(){
            window.location='perfil.html'
        }
    },
    created: function () {
        this.obtenerTemas();
    }
});
