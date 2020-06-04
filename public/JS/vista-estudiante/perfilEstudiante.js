$(document).ready(function () {


    $('.toggle').click(function () {
        $('nav').toggleClass('activarMenu')
    })

    $('.traerPerfilE').click(function () {

        $(`#vista-configPerfil`).load(`configPerfil.html`, function () {
            $(`#btn-close-configPerfil`).click(() => {
                $(`#vista-configPerfil`).html("");
            }).draggable();
        });
    })

    $('.salas').click(function () {

        $(`#vista-configPerfil`).load(`mis-salasE.html`, function () {

        });
    })

})
var avatar = "";
var avatares = [];
var perfilEstudiante = new Vue({
    el: '#vista-estudiante',
    data: {
        usuario: {
            uid: '',
            displayName: 'Douglas Hernandez',
            photoURL: '',
            email: ''
        },
        campo: '',
        sala: []
    },
    methods: {
        obtenerSalas: function () {
            let listaSalas = []
            firebase.database().ref('Tecnoland').child('usuarios').child(this.usuario.uid).child('unionSala').once('value').then(function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(salaSnapshot => {
                        //let key = salaSnapshot.key;
                        let arrayD = {
                            codigoSala: salaSnapshot.key,
                            nombreSala: salaSnapshot.val().nombreSala,
                            descripcion: salaSnapshot.val().descripcion,
                            uidCreador: salaSnapshot.val().creadorSala
                        }


                        listaSalas.push(arrayD);
                    });
                }
            })

            if (!this.campo == '') {
                listaSalas = listaSalas.filter(function (a) {
                    return a.nombreSala == this.campo;
                })
                this.sala = listaSalas;

            } else {
                this.sala = listaSalas;
            }
        },

        filtro: function (array, key, value) {
            return array.filter(function (el) {
                return el[key] == value;
                //return el.toLowerCase().indexOf(query.toLowerCase()) > -1;

            })
        },
        mandarDatos: function (filasala) {
            sessionStorage.setItem('codigoSala', filasala.codigoSala)
            sessionStorage.setItem('nombreSala', filasala.nombreSala)
            sessionStorage.setItem('uidCreador', filasala.uidCreador)
            window.location = 'sala-study.html'
        },
        actualizarAvatar: function () {
            console.log('actualizar avatar function')
            let imgPerfil = document.getElementById('imgPhotoEst');
            let imgPerfil2 = document.getElementById('imgPhotoEst2');
            let username = document.querySelector("#userName");
            let useremail = document.querySelector("#userEmail");
            imgPerfil.setAttribute("src", sessionStorage.getItem('photoUrl'));
            imgPerfil2.setAttribute("src", sessionStorage.getItem('photoUrl'));
            username.innerHTML = sessionStorage.getItem('displayName');


        },
        obtenerAvatares: function () {
            fetch(`../../private/PHP/avatares/avatares.php?proceso=buscarAvatares&valor=0`).then(resp => resp.json()).then(resp => {
                avatares = resp;

                console.log(this.avatares);
            })
        }
    },
    created: function () {

        this.usuario.uid = sessionStorage.getItem('uid');
        this.usuario.displayName = sessionStorage.getItem('displayName');
        this.usuario.photoURL = sessionStorage.getItem('photoUrl');
        this.usuario.email = sessionStorage.getItem('email');
        this.obtenerSalas()
        this.obtenerAvatares();

    }
})


function alertaNewSala() {
    alertify.prompt('Uniendose a una nueva sala...', 'Ingrese el codigo de la sala', 'Escriba aquí el codigo...', function (evt, value) {
        if (value.trim() != "") {
            //cambioVista(true)
            fetch(`../../private/PHP/salas/salas.php?proceso=buscarSala&sala=${value.trim()}`).then(resp => resp.json()).then(resp => {
                console.log(resp)
                if (resp != "") {
                    array = resp;
                    //let id = modalEstudiante.datos.uidCreador;
                    agregarIntegrante(array[0].uidCreador, value.trim())
                } else {
                    console.log('La sala no existe')
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

function cambioVista(validar) {
    let bodyModal = document.querySelector('#cargando');
    if (validar) {
        fetch(`../modulos/verificandoSala.html`).then(function (respuesta) {
            return respuesta.text();
        }).then(function (respuesta) {
            bodyModal.innerHTML = respuesta;
        })
    } else {
        bodyModal.innerHTML = "";
    }
}

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

function obtenerDatosSala(uidCreador, codigoSala) {
    firebase.database().ref('Tecnoland').child('usuarios').child(uidCreador).child('salas').child(codigoSala).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            let nombreSala = snapshot.val().nombreSala
            let descripcion = snapshot.val().descripcion
            agregarRegistro(uidCreador, codigoSala, nombreSala, descripcion)
        }
    });
}
//TODO: la tasca tiene que arreglar sus parches de este js
function cerrarSesion() {

    alertify.confirm('Alerta', '¿Está seguro de cerrar esta sesión?', function () {
        sessionStorage.clear()
        window.location = '../../index.html'
    }, function () {
        alertify.error('Cancelado');

    });

}


function AlertaNuevosDatos() {
    var usuario, credential;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log(user)
            usuario = user;

            alertify.prompt('Confirmar Cambios', 'Ingrese su contraseña actual', '', function (evt, value) {
                // Prompt the user to re-provide their sign-in credentials
                credential = firebase.auth.EmailAuthProvider.credential(usuario.email, value.trim())
                usuario.reauthenticateWithCredential(credential).then(function () {
                    // User re-authenticated.
                    updateGeneralChanges()
                    console.log('reautenticado...')
                }).catch(function (error) {
                    // An error happened.
                    alertify.error('Contraseña incorrecta')
                    console.log(error)
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

function updateUserSQL() {
    console.log('entre a update sql datos')
    let newUsername = document.querySelector("#newUsername").value.trim(),
        newDateuser = document.querySelector("#newDateuser").value.trim();

    if (!newDateuser == '' || !newUsername == '') {
        console.log('entre a la primer capa')
        var NewDataUser = [];
        if (newUsername == '' && !newDateuser == '') {
            console.log('entre a la primer capa f')
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: sessionStorage.getItem('displayName'),
                fechanacimiento: newDateuser,
                accion: 'update'
            };
            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.text()).then(resp => {
                console.log(resp)
                sessionStorage.setItem('nacimiento', newDateuser);
            });
        }
       else if (!newUsername == '' && newDateuser == '') {
            console.log('entre a la primer capa g')
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: newUsername,
                fechanacimiento: sessionStorage.getItem('nacimiento'),
                accion: 'update'
            };
     
            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.text()).then(resp => {
                console.log(resp)
                sessionStorage.setItem('displayName', newUsername);
            });
        }
       else if(!newUsername ==''&& !newDateuser==''){
            console.log('entre a la primer capa h')
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: newUsername,
                fechanacimiento: newDateuser,
                accion: 'update'
            };

            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.json()).then(resp => {
                console.log(resp)
                sessionStorage.setItem('displayName', newUsername);
                sessionStorage.setItem('nacimiento', newDateuser);
            });
        }


    }

}

function updateUserPassword() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var pass1 = document.querySelector('#').value.trim(),
                pass2 = document.querySelector('#').value.trim();
            var secure = validar_clave(pass1, pass2);

            if(secure =='todo-naiz'){
                user.updatePassword(secure).then(function () {
                    // Update successful.
                    console.log('firebase dice: contra cambiada');
                    alertify.success('Contraseña actualizada exitosamente')
                }).catch(function (error) {
                    // An error happened.
                    console.log('firebase dice: contra NO cambiada');
                    alertify.error('Fallo al actualizar su contraseña')
    
    
                });
            } else if (secure=='contra-invalida'){
                alertify.error('Su contraseña no es segura')

            } else if (secure == 'contras-no-coinciden')
            {
                alertify.error('Las contraseñas no coiciden')
            }

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

function colocarAvatares() {
    console.log('hola me llamaron')
    let contenedor = document.getElementById('contenedorAvatares');
    console.log(contenedor)
    contenedor.innerHTML = "";
    avatares.forEach(element => {
        let item = `<div class="col">
                            <img name = "avatar" class = "imgAvatar" src = ${element.urlAvatar} >
                    </div>`;
        contenedor.innerHTML += item;
    });
    console.log(contenedor)
    seleccionarAvatar();
}

function seleccionarAvatar() {
    let imgAvatares = document.getElementsByName('avatar');
    //console.log(imgAvatares);
    imgAvatares.forEach(element => {
        element.addEventListener('click', e => {
            //console.log(element);
            quitarBorder();
            element.style.border = "solid #0000FF"
            avatar = element.src;

            //console.log(src);
        })
    });
}

function guardarAvatar() {
    //perfilEstudiante.usuario.photoURL = avatar;
    //perfilEstudiante.actualizarAvatar();
    sessionStorage.setItem('photoUrl', avatar);
}

function quitarBorder() {
    let imgAvatares = document.getElementsByName('avatar');
    imgAvatares.forEach(element => {
        element.style.border = "none"
    });
}

function updateGeneralChanges(){

    let newUsername = document.querySelector("#newUsername").value.trim(),
        newDateuser = document.querySelector("#newDateuser").value.trim();

    if (!newDateuser == '' || !newUsername == '') {
        updateUserSQL();
    }

    var pass1 = document.querySelector('#newPassuser').value.trim();

        if (!pass1 == '') {
            updateUserPassword()
        }

    perfilEstudiante.actualizarAvatar();

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            user.updateProfile({
                displayName: sessionStorage.getItem('displayName'),
                photoURL: sessionStorage.getItem('photoUrl')
            }).then(function () {
                // Update successful.
                alertify.success('Datos Actualizados correctamente')
            }).catch(function (error) {
                // An error happened.
            });
        } else {
            // No user is signed in.
        }
    });
}