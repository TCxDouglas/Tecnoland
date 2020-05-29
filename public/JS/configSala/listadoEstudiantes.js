var referencia = firebase.database().ref('Tecnoland');

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

        escribirData:function(){
            this.datosSala.nombreSala = sessionStorage.getItem('nombreSala')
            this.datosSala.codigoSala = sessionStorage.getItem('codigoSala')
            this.datosSala.uidCreador = sessionStorage.getItem('uidCreador')
            datosFirebase(this.datosSala.uidCreador, this.datosSala.codigoSala)
        }

    },
    created: function(){
<<<<<<< HEAD
        this.escribirData();
=======
        this.datosSala.nombreSala = sessionStorage.getItem('nombreSala')
        this.datosSala.codigoSala = sessionStorage.getItem('codigoSala')
        this.datosSala.uidCreador = sessionStorage.getItem('uidCreador')
        datosFirebase(this.datosSala.uidCreador, this.datosSala.codigoSala)
        
>>>>>>> e12dbbd7499d39ed0df08174636b939fdf48dc22
    }
})


function datosFirebase(uid, codigoSala){
    referencia.child('usuarios').child(uid).child('salas').child(codigoSala).child('integrantes').on('value', function (snapshot) {
        if (snapshot.val()) {
            dataFirebase=snapshot;
            console.log('Pasa por aca')
            colocarDatos(snapshot)
        }
    })
}

function colocarDatos(snapshot){
    
    //console.log(snapshot)
    let tbody = document.getElementById('tbodyLista');
    tbody.innerHTML="";
    snapshot.forEach(salaSnapshot => {
        //let key = salaSnapshot.key;
        let item = `<tr style="overflow-y: scroll;">
                    <td>
                        <img src="${salaSnapshot.val().photoURL} " alt=""
                            style="width: 50px; height: 40px; border-radius: 50%;">
                    </td>
                    <td> ${salaSnapshot.val().displayName} </td>
                    <td> ${salaSnapshot.val().email} </td>
                </tr>`
        tbody.innerHTML += item;
        /*let array = {
            uidEstudiante: salaSnapshot.key,
            photoURL: salaSnapshot.val().photoURL,
            displayName: salaSnapshot.val().displayName,
            email: salaSnapshot.val().email,
        }*/
        //listadoEs.listadoEstudiante.push(array);
    });
}