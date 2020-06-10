var avatar = "";
var avatares = [];
var listaSalas = [];
var contPhoto = 0;
var photoRespaldo = '';


$(document).ready(function () {

    $('.toggle').click(function () {
        $('nav').toggleClass('activarMenu')
    })

    $('.traerPerfilE').click(function () {

        $(`#vista-configPerfil`).load(`configPerfilD.html`, function () {});
    })

    $('.salas').click(function () {
        var newUsername = document.querySelector("#newUsername");
        var newDateuser = document.querySelector("#newDateuser");
        if(!newDateuser.value.trim() == '' && !newUsername.value.trim() == '' && sessionStorage.getItem('newAvatar') == 'si'){
            alertify.confirm('Alerta', 'Hay cambios sin confirmar, ¿desea descartarlos?', function () {
                sessionStorage.setItem('photoUrl', sessionStorage.getItem('photoRespaldo'));
                $(`#vista-configPerfil`).load(`mis-salasD.html`, function () { });
            }, function () {
                alertify.warning('Confirme los cambios');
        
            });
        } else {
            $(`#vista-configPerfil`).load(`mis-salasD.html`, function () { });
        }
    })
})


var perfil = new Vue({
    el: '#vista-perfil',
    data: {
        usuario: {
            uid: '',
            displayName: 'User Name',
            photoURL: '',
            email: ''
        },
        salas: [],
        campo: ''
    },
    methods: {
        datosUsuario: function () {
            perfil.usuario.uid = sessionStorage.getItem('uid');
            perfil.usuario.displayName = sessionStorage.getItem('displayName');
            perfil.usuario.photoURL = sessionStorage.getItem('photoUrl');
            perfil.usuario.email = sessionStorage.getItem('email');


        },
        obtenerAvatares: function () {
            fetch(`../../private/PHP/avatares/avatares.php?proceso=buscarAvatares&valor=0`).then(resp => resp.json()).then(resp => {
                avatares = resp;

                console.log(this.avatares);
            })
        },
        actualizarAvatar: function () {
            console.log('actualizar avatar function')
            let imgPerfil = document.getElementById('imgPhotoEst');
            let imgPerfil2 = document.getElementById('imgPhotoEst2');
            imgPerfil.setAttribute("src", sessionStorage.getItem('photoUrl'));
            imgPerfil2.setAttribute("src", sessionStorage.getItem('photoUrl'));
            this.usuario.displayName = sessionStorage.getItem('displayName');
            //alertify.success('Foto cambiada exitosamente')


        },
        obtenerSalas: function () {
            firebase.database().ref('Tecnoland').child('usuarios').child(perfil.usuario.uid).child('salas').once('value').then(function (snapshot) {
                if (snapshot.val()) {

                    snapshot.forEach(salaSnapshot => {
                        //let key = salaSnapshot.key;
                        let numactual = salaSnapshot.child('integrantes').numChildren();
                        console.log(salaSnapshot.child('integrantes').numChildren());
                        let array = {
                            codigoSala: salaSnapshot.key,
                            nombreSala: salaSnapshot.val().nombreSala,
                            descripcion: salaSnapshot.val().descripcion,
                            numParticipantes: numactual + '/' + salaSnapshot.val().maxParticipantes
                        }
                        listaSalas.push(array);
                    });
                }
            });
            this.salas = listaSalas;
            console.log(this.salas);

        },
        filtrarSalas: function () {
            this.salas = []
            // console.log(this.campo.toLowerCase())
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
                     //console.log(arrayNew.nombreSala.toLowerCase())
                     sinResultados.innerHTML = ''

                 }else if (newSalas == ''){
                    // this.sala = listaSalas
                    sinResultados.innerHTML = `
                    <h1 style="color: #fff;">Sin resultados de búsqueda</h1>
                    `
                   console.log('Sin resultados de busqueda')
                 }
                 this.salas = newSalas 
 
             }
         },

        mandarDatos: function (filaSala) {
            //console.log(modalPerfil.infoSala)
            sessionStorage.setItem('codigoSala', filaSala.codigoSala)
            sessionStorage.setItem('nombreSala', filaSala.nombreSala)
            sessionStorage.setItem('uidCreador', this.usuario.uid)
            window.location = 'sala-study.html'
        }
    },
    created: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                perfil.datosUsuario();
                perfil.obtenerSalas();
                perfil.obtenerAvatares();

            } else {
                window.location = '../../index.html'
            }
        });

    }
})


function crearSala() {
    window.location = 'crear-salas.html'
}

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

            alertify.prompt('Confirmar Cambios', 'Ingrese su contraseña actual para su respectiva verificación', '', function (evt, value) {
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
    alertify.warning('Foto de peril almacenada temporalmente');

}

function quitarBorder() {
    let imgAvatares = document.getElementsByName('avatar');
    imgAvatares.forEach(element => {
        element.style.border = "none"
    });
}



function updateGeneralChanges() {

    var newUsername = document.querySelector("#newUsername");
    var newDateuser = document.querySelector("#newDateuser");

    if (!newDateuser.value.trim() == '' || !newUsername.value.trim() == '') {
        var updateSQL = updateUserSQL(newDateuser.value.trim(), newUsername.value.trim());
        console.log(updateSQL)
        if (updateSQL == 'exito') {
            console.log(updateSQL)
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
                perfil.actualizarAvatar();
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

function updateUserPassword() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var pass1 = document.querySelector('#newPassuser').value.trim(),
                pass2 = document.querySelector('#newPassuser2').value.trim();
            var secure = validar_clave(pass1.trim(), pass2.trim());

            if (secure == 'todo-naiz') {

                // User is signed in.
                console.log(user)
                usuario = user;
                user.updatePassword(pass1).then(function () {
                    // Update successful.
                    console.log('firebase dice: contra cambiada');
                    alertify.set('notifier', 'position', 'top-center');
                    alertify.success('Contraseña actualizada exitosamente ');
                    $('#modalNewPass').modal('hide')
                }).catch(function (error) {
                    // An error happened.
                    console.log('firebase dice: contra NO cambiada');
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
                    console.log('reautenticado...')
                }).catch(function (error) {
                    // An error happened.
                    alertify.error('Contraseña incorrecta')
                    console.log(error)
                });
            }, function () {
                alertify.set('notifier', 'position', 'top-center');
                alertify.error('Edición cancelada')
            }).set('type', 'password');
        } else {

        }
    });
}

function updateUserSQL(newDateuser, newUsername) {
    console.log('entre a update sql datos')

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
            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.json()).then(resp => {
                console.log(resp)
                sessionStorage.setItem('nacimiento', newDateuser);
            });
            return "exito"

        } else if (!newUsername == '' && newDateuser == '') {
            console.log('entre a la primer capa g')
            NewDataUser = {
                uid: sessionStorage.getItem('uid'),
                displayname: newUsername,
                fechanacimiento: sessionStorage.getItem('nacimiento'),
                accion: 'update'
            };

            fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(NewDataUser)}`).then(resp => resp.json()).then(resp => {
                console.log(resp)
                sessionStorage.setItem('displayName', newUsername);

            });
            return "exito"

        } else if (!newUsername == '' && !newDateuser == '') {
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
            return "exito"

        }


    }
    return "Nop"

}