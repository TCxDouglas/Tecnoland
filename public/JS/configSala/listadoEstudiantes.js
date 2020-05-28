
var listadoEs = new Vue({
    el: '#listadoEstudiante',
    data: {
        datosSala: {
            nombreSala: '',
            descripcion: '',
            codigoSala : '',
            uidCreador: ''
        },
        listadoEstudiante:[]
    },
    methods : {

    },
    created: function(){
        this.datosSala.nombreSala = sessionStorage.getItem('nombreSala')
        this.datosSala.codigoSala = sessionStorage.getItem('codigoSala')
        this.datosSala.uidCreador = sessionStorage.getItem('uidCreador')
        datosFirebase(this.datosSala.uidCreador, this.datosSala.codigoSala)
    }
})

function datosFirebase(uid, codigoSala){
    firebase.database().ref('Tecnoland').child('usuarios').child(uid).child('salas').child(codigoSala).child('integrantes').on('value', function (snapshot) {
        if (snapshot.val()) {
            listadoEs.listadoEstudiante = []
            snapshot.forEach(salaSnapshot => {
                //let key = salaSnapshot.key;
                let array = {
                    uidEstudiante: salaSnapshot.key,
                    photoURL: salaSnapshot.val().photoURL,
                    displayName: salaSnapshot.val().displayName,
                    email: salaSnapshot.val().email,
                }
                listadoEs.listadoEstudiante.push(array);
            });
        }
    })
}