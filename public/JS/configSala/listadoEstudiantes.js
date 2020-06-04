var referencia = firebase.database().ref('Tecnoland'),
names = [],
emails =[],
creador = '',
sala = '';

var listadoEs = new Vue({
    el: '#divCabezera',
    data: {
        datosSala: {
            nombreSala: '',
            descripcion: '',
            codigoSala : '',
            uidCreador: '',
            participantes: '',
            emailUser : ''
        },
        listadoEstudiante:[]
    },
    methods : {

        escribirData:function(){
            this.datosSala.nombreSala = sessionStorage.getItem('nombreSala')
            this.datosSala.codigoSala = sessionStorage.getItem('codigoSala')
            this.datosSala.uidCreador = sessionStorage.getItem('uidCreador')
            this.datosSala.emailUser = sessionStorage.getItem('email')
            datosFirebase(this.datosSala.uidCreador, this.datosSala.codigoSala)
        }

    },
    created: function(){

        this.escribirData();

        this.datosSala.nombreSala = sessionStorage.getItem('nombreSala')
        this.datosSala.codigoSala = sessionStorage.getItem('codigoSala')
        this.datosSala.uidCreador = sessionStorage.getItem('uidCreador')
        this.datosSala.emailUser = sessionStorage.getItem('email')
        datosFirebase(this.datosSala.uidCreador, this.datosSala.codigoSala)
        
        

    }
})


function datosFirebase(uid, codigoSala){
    referencia.child('usuarios').child(uid).child('salas').child(codigoSala).child('integrantes').on('value', function (snapshot) {
        if (snapshot.val()) {
            dataFirebase=snapshot;
            console.log('Pasa por aca')
            colocarDatos(snapshot, uid, codigoSala)
        }
    })
}

function colocarDatos(snapshot, uidCreador, codigoSala){
    referencia.child('usuarios').child(uidCreador).child('salas').child(codigoSala).on('value', function (snapshot){
        if(snapshot.val()){
          let numactual = snapshot.child('integrantes').numChildren();
           listadoEs.datosSala.participantes = numactual+'/'+snapshot.val().maxParticipantes;
        }
    })
    //console.log(snapshot)
    let tbody = document.getElementById('tbodyLista');
    tbody.innerHTML="";
    let cont = 0;
    snapshot.forEach(salaSnapshot => {

        names [cont] = salaSnapshot.key;
        emails [cont] = salaSnapshot.val().email;
        creador = uidCreador
        sala = codigoSala;
        
                 let item1 = `
                    <tr >
                         <td>
                                <img src="${salaSnapshot.val().photoURL} " 
                                style="width: 30px; height: 30px; border-radius: 50%;">
                        </td>
                        <td style="font-size:12px !important;"> ${salaSnapshot.val().displayName} </td>
                        <td style="font-size:12px !important;"> ${salaSnapshot.val().email} </td>

                        <td>
                            <button  class="btn btn-outline-danger text-white" name="eliminaciones" data-modulo="${cont}" > <i class="fa fa-trash-o" aria-hidden="true"></i> </button>
                        </td>
                    </tr>`

                    let item2 = `
                         <tr >
                            <td>
                                <img src="${salaSnapshot.val().photoURL} " 
                                style="width: 30px; height: 30px; border-radius: 50%;">
                            </td>
                            <td style="font-size:12px !important;"> ${salaSnapshot.val().displayName} </td>
                            <td style="font-size:12px !important;"> ${salaSnapshot.val().email} </td>
                        </tr>`

    if (sessionStorage.getItem('tipoCuenta')== 'normal'){
        tbody.innerHTML += item2;
    }
    else{
        tbody.innerHTML += item1;

    }
        
        cont++;

        
        /*let array = {
            uidEstudiante: salaSnapshot.key,
            photoURL: salaSnapshot.val().photoURL,
            displayName: salaSnapshot.val().displayName,
            email: salaSnapshot.val().email,
        }*/
        //listadoEs.listadoEstudiante.push(array);
    });
    console.log(names);
    console.log(emails);
    recogerData();
}

function recogerData(){

    let botones = document.getElementsByName('eliminaciones');
    console.log(botones)
    let cont = 0;
    botones.forEach(Element =>{
        Element.addEventListener('click', e => {
            e.preventDefault();
            //console.log(cont);
            console.log(Element.dataset.modulo);
            alerta(Element.dataset.modulo);
            cont++;
        
        })
        console.log(names[cont]);

    });
}

function alerta(cont){
    alertify.prompt( 'Eliminando Usuario...', 'Motivo de su eliminación', 'Escriba aquí un motivo...'
               , function(evt, value) {
                   console.log(emails[cont]);
                    eliminardeFB(names[cont],  sala, value.trim(), emails[cont]) }
               , function() { alertify.error('Eliminación cancelada') }
               );
}

function eliminardeFB(uidEst,  codSala, motivo, email){
           enviarCorreo( uidEst,  codSala, motivo, email);
}

function enviarCorreo( uidEst,  codSala, motivo, email){
let sala = sessionStorage.getItem('nombreSala');
let identificador = 'correo';
    let datos = {
            uidEst,
            sala, 
            codSala,
            motivo,
            email,
            identificador

    }
    console.log(datos);
        firebase.database().ref('Tecnoland').child('usuarios').child(creador).child('salas').child(codSala).child('integrantes').child(uidEst).remove().then(function(){

            firebase.database().ref('Tecnoland') .child('usuarios').child(uidEst).child('unionSala').child(codSala).remove().then (function(){
                alertify.success('El usuario se removió de la sala');

                fetch(`../../private/PHP/salas/salas.php?proceso=recibirDatos&sala=${JSON.stringify(datos)}`).then(resp => resp.json()).then(resp => {
                    console.log(resp)
                    if(resp=='error')
                    {
                        alertify.error('Error al notificar al usuario');

                    }else{
                        alertify.success('Se ha notificado al usuario');
                    }

                });
            });


        });
   


}

