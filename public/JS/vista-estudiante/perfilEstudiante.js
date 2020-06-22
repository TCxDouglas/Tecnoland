/**@author Josue Isaac Aparicio Diaz */

var photoRespaldo = '';
var avatar = '';
var avatares = [];
var contPhoto = 0;
var listaSalas = []

$(document).ready(function () {
    $('.toggle').click(function () {
        $('nav').toggleClass('activarMenu')
    })
    $('.traerPerfilE').click(function () {
        $(`#vista-configPerfil`).load(`configPerfil.html`, function () { });
    })
    $('.salas').click(function () {
        var newUsername = document.querySelector("#newUsername");
        var newDateuser = document.querySelector("#newDateuser");
        if(!newDateuser.value.trim() == '' || !newUsername.value.trim() == '' || sessionStorage.getItem('newAvatar') == 'si'){

            alertify.confirm('Alerta', 'Hay cambios sin confirmar, ¿desea descartarlos?', function () {
                if(sessionStorage.getItem('newAvatar') == 'si'){
                    sessionStorage.setItem('photoUrl', sessionStorage.getItem('photoRespaldo'));
                }
                $(`#vista-configPerfil`).load(`mis-salasE.html`, function () { });
            }, function () {
                alertify.warning('Confirme los cambios');
            });
        } else {
            $(`#vista-configPerfil`).load(`mis-salasE.html`, function () { });
        }
    })
})

var perfilEstudiante = new Vue({
    el: '#vista-estudiante',
    data: {
        usuario: {
            uid: '',
            displayName: 'User Name',
            photoURL: '',
            email: ''
        },
        campo: '',
        sala: []
    },
    methods: {
        /**@function obtenerSalas {Obtiene todo los datos de las salas a las que estamos unidos} */
        obtenerSalas: function () {
            this.sala=[]
            listaSalas=[]
            firebase.database().ref('Tecnoland').child('usuarios').child(this.usuario.uid).child('unionSala').once('value').then(function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(salaSnapshot => {
                        let numactual = salaSnapshot.child('integrantes').numChildren();
                        
                        let arrayD = {
                            codigoSala: salaSnapshot.key,
                            nombreSala: salaSnapshot.val().nombreSala,
                            descripcion: salaSnapshot.val().descripcion,
                            uidCreador: salaSnapshot.val().creadorSala,
                            numParticipantes: numactual + '/' + salaSnapshot.val().maxParticipantes,
                            
                        }
                        perfilEstudiante.sala.push(arrayD);
                    });
                }
            })
            this.sala = listaSalas
        },
        /**@function filtrarSalas  {Este es un buscador de salas} */
        filtrarSalas: function () {
           this.sala = []
            let newSalas =[]
            let cont = 0;
            let sinResultados = document.querySelector('#sinResultados')
            for (let arrayNew of listaSalas){
                let nombre = arrayNew.nombreSala.toLowerCase()
                if(nombre.indexOf(this.campo.toLowerCase().trim()) !== -1){
                    newSalas[cont] =  {
                        codigoSala: arrayNew.codigoSala,
                        nombreSala: arrayNew.nombreSala,
                        descripcion: arrayNew.descripcion,
                        uidCreador: arrayNew.uidCreador
                    }
                    cont++;
                    sinResultados.innerHTML = ''
                }else if (newSalas ==''){
                    sinResultados.innerHTML = `
                    <h1 style="color: #fff; font-size: 15px;">Sin resultados de búsqueda <i class="fa fa-search-minus" aria-hidden="true"></i></h1>
                    <h1 style="text-align: center; align-items:center; font-size: 15px;"><i class="fa fa-search-minus" aria-hidden="true"></i></h1>
                    `
                }
                this.sala = newSalas 

            }
        },
        /**@function mandarDatos {Esta funcion obtiene los datos especificos de la sala que seleccionamos} */
        mandarDatos: function (filasala) {
            getTopics(filasala.uidCreador, filasala.codigoSala)
            sessionStorage.setItem('codigoSala', filasala.codigoSala)
            sessionStorage.setItem('nombreSala', filasala.nombreSala)
            sessionStorage.setItem('uidCreador', filasala.uidCreador)
            
        },
        /**@function actualizarAvatar {Funcion que actualiza la foto de perfil pero todavia no lo manda a Firebase} */
        actualizarAvatar: function () {
            let imgPerfil = document.getElementById('imgPhotoEst');
            let imgPerfil2 = document.getElementById('imgPhotoEst2');
            imgPerfil.setAttribute("src", sessionStorage.getItem('photoUrl'));
            imgPerfil2.setAttribute("src", sessionStorage.getItem('photoUrl'));
            this.usuario.displayName = sessionStorage.getItem('displayName');
        },
        /**@function obtenerAvatares {Obtiene todos los avatares que proporcionamos} */
        obtenerAvatares: function () {
            fetch(`../../private/PHP/avatares/avatares.php?proceso=buscarAvatares&valor=0`).then(resp => resp.json()).then(resp => {
                avatares = resp;
            })
        },
        changeData(){
            AlertaNuevosDatos()
        }

    },
    created: function () {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                perfilEstudiante.usuario.uid = sessionStorage.getItem('uid');
                perfilEstudiante.usuario.displayName = sessionStorage.getItem('displayName');
                perfilEstudiante.usuario.photoURL = sessionStorage.getItem('photoUrl');
                perfilEstudiante.usuario.email = sessionStorage.getItem('email');
                perfilEstudiante.obtenerSalas()
                perfilEstudiante.obtenerAvatares();
            } else {
                window.location = '../../index.html'
            }
        });

        /*
        var speechSynthesisUtterance = new SpeechSynthesisUtterance('¡Bienvenido!!!!!!!!, ' + sessionStorage.getItem('displayName'));

        if(!sessionStorage.getItem('displayName')==''){
            window.speechSynthesis.speak(speechSynthesisUtterance);
            console.log(speechSynthesisUtterance)
        }*/



    }
})


/**@function getTopicsSnapshot {Esta funcion obtiene el listado de salas y los ordena en un array} */
function getTopicsSnapshot(snapshot) {
    let topics = []
    
    for (let i = 0; i < snapshot.numChildren(); i++) {
        let items = {
            descripcion: snapshot.child(i).val().descripcion,
            idTema: snapshot.child(i).val().idTema,
            tema: snapshot.child(i).val().tema
        }
        //console.log(items)
        topics.push(items)
    }
    sessionStorage.setItem('temas', JSON.stringify(topics))
    window.location = 'sala-study.html'
}

/**@function getTopics {Funcion que va a Firebase y trae los temas disponibles de la sala} */
function getTopics(uidCreador,codigoSala){
    firebase.database().ref('Tecnoland').child('usuarios').child(uidCreador).child('salas').child(codigoSala).child('temas').once('value').then(function (snapshot) {
        if (snapshot.val()) {
            let topics= getTopicsSnapshot(snapshot)
            return topics;
        }else{
            return ;
        }
    });
}

/**@function alertaNewSala {Funcion que levanta un alertify y solicita el codigo de la sala para unirse} */
function alertaNewSala() {
    alertify.prompt('Uniendose a una nueva sala...', 'Ingrese el codigo de la sala', 'Escriba aquí el codigo...', function (evt, value) {
        if (value.trim() != "") {
            //cambioVista(true)
            fetch(`../../private/PHP/salas/salas.php?proceso=buscarSala&sala=${value.trim()}`).then(resp => resp.json()).then(resp => {
                
                if (resp != "") {
                    array = resp;
                    validateNumMenbersRoom(array[0].uidCreador, value.trim())
                } else {
                    
                    alertify.error('La sala no existe');
                }
            });

        } else {
            console.log('Campo Vacio')
        }

    }, function () {
        alertify.error('Accion cancelada')
    }).set('type', 'text');
}

/**@function validateNumMenbersRoom {Esta funcion valida que la sala no este a su maxima capacidad} */
function validateNumMenbersRoom(uidCreador, codigoSala) {
    firebase.database().ref('Tecnoland').child('usuarios').child(uidCreador).child('salas').child(codigoSala).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            let maxMenbers=snapshot.val().maxParticipantes
            let menbersActive = snapshot.child('integrantes').numChildren()

            if(menbersActive<maxMenbers){
                agregarIntegrante(uidCreador, codigoSala)
                alertify.set('notifier', 'position', 'top-center');
                alertify.success('Se ha unido a la sala exitosamente')
            } else {
                 alertify.set('notifier', 'position', 'top-center');
                alertify.error('Sala completa, consulte con su docente')
            }
        }
    })
}

/**@function agregarIntegrante {Agrega el estudiante a listado de integrantes de la sala} */
function agregarIntegrante(uidCreador, codigoSala) {
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

/**@function agregarRegistro {Agrega en el registro de estudiante la sala a la que se unio} */
function agregarRegistro(uidCreador, codigoSala, nombreSala, descripcion) {
    firebase.database().ref('Tecnoland').child('usuarios').child(sessionStorage.getItem('uid')).child('unionSala').child(codigoSala).set({
        creadorSala: uidCreador,
        codigoSala: codigoSala,
        nombreSala: nombreSala,
        descripcion: descripcion
    }).then(function () {
        console.log('Registro añadido')
        perfilEstudiante.obtenerSalas()
        $('#staticBackdrop').modal('hide')
        //window.location = 'sala-study.html'
    }).catch(function (error) {
        console.log(error.message)
    })
}

/**@function obtenerDatosSala {Obtiene los datos de la sala a la que nos estamos uniendo} */
function obtenerDatosSala(uidCreador, codigoSala) {
    firebase.database().ref('Tecnoland').child('usuarios').child(uidCreador).child('salas').child(codigoSala).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            let nombreSala = snapshot.val().nombreSala
            let descripcion = snapshot.val().descripcion
            agregarRegistro(uidCreador, codigoSala, nombreSala, descripcion)
        }
    });
}

/**@function cerrarSesion {Cierra la sesion y lo devuelve a la pagina principal} */
function cerrarSesion() {

    alertify.confirm('Alerta', '¿Está seguro de cerrar esta sesión?', function () {
        sessionStorage.clear()
        window.location = '../../index.html'
    }, function () {
        alertify.error('Cancelado');

    });

}


/**@function AlertaNuevosDatos {Alerta que solicita reautentificarse antes de hacer modificaciones del perfil} */
function AlertaNuevosDatos() { 
    var usuario, credential;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            usuario = user;

            alertify.prompt('Confirmar Cambios', 'Ingrese su contraseña actual para su respectiva verificación', '', function (evt, value) {
                // Prompt the user to re-provide their sign-in credentials
                credential = firebase.auth.EmailAuthProvider.credential(usuario.email, value.trim())
                usuario.reauthenticateWithCredential(credential).then(function () {
                    // User re-authenticated.
                    updateGeneralChanges()
                }).catch(function (error) {
                    // An error happened.
                    alertify.error('Contraseña incorrecta')
                    
                });
            }, function () {
                alertify.error('Edición cancelada')
            }).set('type', 'password');
        } else {
            // No user is signed in.
            alertify.error('Sin usuario')
        }
    });
}

/**@function colocarAvatares {Coloca los avatares para poderlos seleccionar} */
function colocarAvatares() {
    let contenedor = document.getElementById('contenedorAvatares');
    contenedor.innerHTML = "";
    avatares.forEach(element => {
        let item = `<div class="col">
                            <img name = "avatar" class = "imgAvatar" src = ${element.urlAvatar} >
                    </div>`;
        contenedor.innerHTML += item;
    });
    seleccionarAvatar();
}

function seleccionarAvatar() {
    let imgAvatares = document.getElementsByName('avatar');
    imgAvatares.forEach(element => {
        element.addEventListener('click', e => {
            quitarBorder();
            element.style.border = "solid #0000FF"
            avatar = element.src;
        })
    });
}

function guardarAvatar() {
    if (contPhoto === 0)
    {
        sessionStorage.setItem('photoRespaldo', sessionStorage.getItem('photoUrl')); //respaldo por si decide no guardar los cambios
    }
    contPhoto++;
    sessionStorage.setItem('photoUrl', avatar);
    let imgPerfil2 = document.getElementById('imgPhotoEst2');
    imgPerfil2.setAttribute("src", avatar);
    sessionStorage.setItem('newAvatar', 'si');
    alertify.set('notifier', 'position', 'top-center');
    alertify.warning('Foto de perfil almacenada teporalmente');
}

function quitarBorder() {
    let imgAvatares = document.getElementsByName('avatar');
    imgAvatares.forEach(element => {
        element.style.border = "none"
    });
}

/**@function updateGeneralChanges {Funcion que actualiza los datos del perfil} */
function updateGeneralChanges() {
    var newUsername = document.querySelector("#newUsername");
    var newDateuser = document.querySelector("#newDateuser");

    if (!newDateuser.value.trim() == '' || !newUsername.value.trim() == '') {
        var updateSQL = updateUserSQL(newDateuser.value.trim(), newUsername.value.trim());
        if (updateSQL == 'exito') {
            updateFirebase()
            newUsername.value = '';
            newDateuser.value = '';
        }
    } else if (sessionStorage.getItem('newAvatar') == 'si'){
        updateFirebase()
    }
    
    else if (newDateuser.value.trim() == '' && newUsername.value.trim() == '' && sessionStorage.getItem('newAvatar') == 'no') {
        alertify.set('notifier', 'position', 'top-center');
        alertify.error('No hay nada por actualizar');
    }

}

/**@function updateFirebase {Funcion que actualiza los datos de perfil en Firebase} */
function updateFirebase() {
    userGG = document.querySelector('#userName');
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            user.updateProfile({
                displayName: sessionStorage.getItem('displayName'),
                photoURL: sessionStorage.getItem('photoUrl')
            }).then(function () {
                // Update successful.
                sessionStorage.setItem('newAvatar', 'no');
                perfilEstudiante.actualizarAvatar();
                contPhoto = 0;
                userGG.innerHTML = sessionStorage.getItem('displayName');
                alertify.success('Sus datos se actualizaron exitosamente')
            }).catch(function (error) {
                // An error happened.
                alertify.error('Ha ocurrido algo inesperado, intentalo de nuevo');
            });
        } else {
            // No user is signed in.
        }
    });
}

function validar_clave(contraseña, contraseña2) {
    if (contraseña == contraseña2) {

        if (contraseña.length >= 8) {
            var mayuscula = false;
            var minuscula = false;
            var numero = false;

            for (var i = 0; i < contraseña.length; i++) {
                if (contraseña.charCodeAt(i) >= 65 && contraseña.charCodeAt(i) <= 90) {
                    mayuscula = true;
                } else if (contraseña.charCodeAt(i) >= 97 && contraseña.charCodeAt(i) <= 122) {
                    minuscula = true;
                } else if (contraseña.charCodeAt(i) >= 48 && contraseña.charCodeAt(i) <= 57) {
                    numero = true;
                }

            }
            if (mayuscula == true && minuscula == true && numero == true) {

                return "todo-naiz";
            }
        }
        return "contra-invalida";
    }
    return "contras-no-coinciden";
}

/**@function updatePassword {Cambia la password de tu cuenta} */
function updateUserPassword() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var pass1 = document.querySelector('#newPassuser').value.trim(),
                pass2 = document.querySelector('#newPassuser2').value.trim();
            var secure = validar_clave(pass1.trim(), pass2.trim());

            if (secure == 'todo-naiz') {
                // User is signed in.
                usuario = user;
                user.updatePassword(pass1).then(function () {
                    // Update successful.
                    console.log('firebase dice: contra cambiada');
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.success('Contraseña actualizada exitosamente ');
                    $('#modalNewPass').modal('hide')
                }).catch(function (error) {
                    // An error happened.
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.error('Ha ocurrido un error inesperado, intentalo de nuevo');


                });

            } else if (secure == 'contra-invalida') {
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('La contraseña no es segura, intentalo de nuevo');


            } else if (secure == 'contras-no-coinciden') {
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('Las contraseñas no coiciden, intentalo de nuevo');
            }

        } else {
            // No user is signed in.
        }
    });

}

function verificarusuario(){
    var credential;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            alertify.prompt('Verificando Usuario...', 'Ingrese su contraseña actual para su respectiva verificacion', '', function (evt, value) {
                // Prompt the user to re-provide their sign-in credentials
                credential = firebase.auth.EmailAuthProvider.credential(user.email, value.trim())
                user.reauthenticateWithCredential(credential).then(function () {
                    // User re-authenticated.
                    $('#modalNewPass').modal('show')
                    alertify.success('Verificado')
                }).catch(function (error) {
                    // An error happened.
                    alertify.error('Contraseña incorrecta')
                    
                });
            }, function () {
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('Edición cancelada')
            }).set('type', 'password');
        } else {

        }
    });
}

/**@function updateUserSQLSQL {Funcion que actualiza los datos del usuario en la BD de MYSQL} */
function updateUserSQL(newDateuser, newUsername) {

    if (!newDateuser == '' || !newUsername == '') {
        var NewDataUser = [];
        if (newUsername == '' && !newDateuser == '') {
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: sessionStorage.getItem('displayName'),
                fechanacimiento: newDateuser,
                accion: 'update'
            };
            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.json()).then(resp => {
                
                sessionStorage.setItem('nacimiento', newDateuser);
            });
            return "exito"

        } else if (!newUsername == '' && newDateuser == '') {
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: newUsername,
                fechanacimiento: sessionStorage.getItem('nacimiento'),
                accion: 'update'
            };

            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.json()).then(resp => {
              
                sessionStorage.setItem('displayName', newUsername);

            });
            return "exito"

        } else if (!newUsername == '' && !newDateuser == '') {
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: newUsername,
                fechanacimiento: newDateuser,
                accion: 'update'
            };

            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.json()).then(resp => {
                sessionStorage.setItem('displayName', newUsername);
                sessionStorage.setItem('nacimiento', newDateuser);
            });
            return "exito"

        }


    }
    return "Nop"

}