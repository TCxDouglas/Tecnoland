/**@author Josue Isaac Aparicio Diaz */

var referencia = firebase.database().ref('Tecnoland'),
    names = [],
    emails = [],
    creador = '',
    sala = '';

var listadoEs = new Vue({
    el: '#divCabezera',
    data: {
        datosSala: {
            nombreSala: '',
            descripcion: '',
            codigoSala: '',
            uidCreador: '',
            participantes: '',
            emailUser: ''
        },
        listadoEstudiante: []
    },
    methods: {
        /**@function escribirData {Funcion que guarda en variables de Vue Js los datos de la sala a la que se accedio} */
        escribirData: function () {
            this.datosSala.nombreSala = sessionStorage.getItem('nombreSala')
            this.datosSala.codigoSala = sessionStorage.getItem('codigoSala')
            this.datosSala.uidCreador = sessionStorage.getItem('uidCreador')
            this.datosSala.emailUser = sessionStorage.getItem('email')
            getDataRoom(this.datosSala.uidCreador, this.datosSala.codigoSala)
        }
    },
    created: function () {
        this.escribirData();
    }
})


/**
 * @function colocarDatos {Funcion que pinta la lista de los estudiantes pertenecientes a la sala}
 * @param {Contiene la lista de integrantes de la sala} snapshot 
 */
function colocarDatos(snapshot, uidCreador, codigoSala) {
    let tbody = document.getElementById('tbodyLista');
    tbody.innerHTML = "";
    let cont = 0;
    creador = uidCreador
    sala = codigoSala;
    snapshot.forEach(salaSnapshot => {
        names[cont] = salaSnapshot.key;
        emails[cont] = salaSnapshot.val().email;

        let item1 = `
                    <tr >
                         <td>
                                <img src="${salaSnapshot.val().photoURL} " 
                                style="width: 30px; height: 30px; border-radius: 50%;">
                        </td>
                        <td> ${salaSnapshot.val().displayName} </td>
                        <td> ${salaSnapshot.val().email} </td>

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
                            <td> ${salaSnapshot.val().displayName} </td>
                            <td> ${salaSnapshot.val().email} </td>
                        </tr>`

        if (sessionStorage.getItem('tipoCuenta') == 'normal') {
            tbody.innerHTML += item2;
        } else {
            tbody.innerHTML += item1;

        }

        cont++;
    });
    recogerData();
}

/**
 * @function getDataRoom {Funcion que va a la BD de Firebase a traer los datos de la sala}
 * @param {Parametro que se usa para encontrar los datos de un usuario} uidCreador 
 * @param {Parametro que se usa para identificar la informacion de una sala} codigoSala 
 */
function getDataRoom(uidCreador, codigoSala) {
    referencia.child('/usuarios/' + uidCreador + '/salas/' + codigoSala).on('value', function (snapshot) {
        if (snapshot.val()) {
            let numactual = snapshot.child('integrantes').numChildren();
            listadoEs.datosSala.participantes = numactual + '/' + snapshot.val().maxParticipantes;
             colocarDatos(snapshot.child('integrantes'), uidCreador, codigoSala)
        }
    });
}

/**@function recogerData {Esta funcion detecta el evento Click a la hora de eliminar un estudiante de la sala, lo identifica por medio de 
 * un modulo de dato} */
function recogerData() {
    let botones = document.getElementsByName('eliminaciones');
    let cont = 0;
    botones.forEach(Element => {
        Element.addEventListener('click', e => {
            e.preventDefault();
            alerta(Element.dataset.modulo);
            cont++;
        })
    });
}

/**@function alerta {Alertify que se lanza cuando se quiere eliminar un estudiante, se solicita el motivo de su expulsion} */
function alerta(cont) {
    alertify.prompt('Eliminando Usuario...', 'Motivo de su eliminación', 'Escriba aquí un motivo...', function (evt, value) {
        if (value.trim() != null && value.trim().length > 5 ) {
            eliminardeFB(names[cont], sala, value.trim(), emails[cont])
        }else{
            alertify.error('Asegurese de proporcionar un motivo de expulsion valido')
        }
    }, function () {
        alertify.error('Eliminación cancelada')
    });
}

/**
 * @function eliminardeFB {Funcion de ByPass para llevar acabo la expulsion}
 * @param {Uid que identifica al estudiante} uidEst 
 * @param {Codigo de la sala al cual pertenece} codSala 
 * @param {Motivo por el cual es expulsado} motivo 
 * @param {Email del estudiante expulsado} email 
 */
function eliminardeFB(uidEst, codSala, motivo, email) {
    enviarCorreo(uidEst, codSala, motivo, email);
}

/**@function enviarCorreo {Funcion que recolecta los datos anteriores, y elimina el registro del estudiante de la sala}
 * luego de la eliminacion, este envia un correo informando el motivo de su expulsion
 */
function enviarCorreo(uidEst, codSala, motivo, email) {
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

    firebase.database().ref('Tecnoland').child('usuarios').child(creador).child('salas').child(codSala).child('integrantes').child(uidEst).remove().then(function () {
        firebase.database().ref('Tecnoland').child('usuarios').child(uidEst).child('unionSala').child(codSala).remove().then(function () {
            alertify.success('El usuario se removió de la sala');

            fetch(`../../private/PHP/salas/salas.php?proceso=recibirDatos&sala=${JSON.stringify(datos)}`).then(resp => resp.json()).then(resp => { 
                if (resp == 'error') {
                    alertify.error('Error al notificar al usuario');

                } else {
                    alertify.success('Se ha notificado al usuario');
                }
            });
        });
    });
}