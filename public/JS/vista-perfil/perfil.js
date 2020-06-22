var avatar = "";
var avatares = [];
var listaSalas = [];
var contPhoto = 0;
var photoRespaldo = '';
var temasEscogidos = [];
var respaldoTemas = [];
var temas = [];

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
        console.log(newDateuser.value.trim(), newUsername.value.trim(), sessionStorage.getItem('newAvatar'))
        if (!newDateuser.value.trim() == '' || !newUsername.value.trim() == '' || sessionStorage.getItem('newAvatar') == 'si') {
            alertify.confirm('Alerta', 'Hay cambios sin confirmar, ¿desea descartarlos?', function () {
                if (sessionStorage.getItem('newAvatar') == 'si') {
                    sessionStorage.setItem('photoUrl', sessionStorage.getItem('photoRespaldo'));
                }
                $(`#vista-configPerfil`).load(`mis-salasD.html`, function () {});
            }, function () {
                alertify.warning('Confirme los cambios');

            });
        } else {
            $(`#vista-configPerfil`).load(`mis-salasD.html`, function () {});
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
            this.salas = []
            listaSalas = []
            firebase.database().ref('Tecnoland').child('usuarios').child(perfil.usuario.uid).child('salas').once('value').then(function (snapshot) {
                if (snapshot.val()) {

                    snapshot.forEach(salaSnapshot => {
                        //let key = salaSnapshot.key;
                        let numactual = salaSnapshot.child('integrantes').numChildren();
                        let temas = getTopicsSnapshot(salaSnapshot.child('temas'));
                        //  console.log(temas);
                        let array = {
                            codigoSala: salaSnapshot.key,
                            nombreSala: salaSnapshot.val().nombreSala,
                            descripcion: salaSnapshot.val().descripcion,
                            numParticipantes: numactual + '/' + salaSnapshot.val().maxParticipantes,
                            listaTemas: JSON.stringify(temas)
                        }
                        listaSalas.push(array);
                    });
                }
            });
            this.salas = listaSalas;

        },
        filtrarSalas: function () {
            this.salas = []
            // console.log(this.campo.toLowerCase())
            let newSalas = []
            let cont = 0;
            let sinResultados = document.querySelector('#sinResultados')
            for (let arrayNew of listaSalas) {
                let nombre = arrayNew.nombreSala.toLowerCase()
                if (nombre.indexOf(this.campo.toLowerCase().trim()) !== -1) {
                    newSalas[cont] = {
                        codigoSala: arrayNew.codigoSala,
                        nombreSala: arrayNew.nombreSala,
                        descripcion: arrayNew.descripcion,
                        uidCreador: arrayNew.uidCreador,
                        numParticipantes: arrayNew.numParticipantes
                    }
                    cont++;
                    //console.log(arrayNew.nombreSala.toLowerCase())
                    sinResultados.innerHTML = ''

                } else if (newSalas == '') {
                    // this.sala = listaSalas
                    sinResultados.innerHTML = `
                    <h1 style="color: #fff; font-size: 15px;">Sin resultados de búsqueda <i class="fa fa-search-minus" aria-hidden="true"></i></h1>
                    <h1 style="text-align: center; align-items:center; font-size: 15px;"><i class="fa fa-search-minus" aria-hidden="true"></i></h1>

                    `
                }
                this.salas = newSalas

            }
        },
        mandarDatos: function (filaSala) {
            //console.log(modalPerfil.infoSala)
            sessionStorage.setItem('codigoSala', filaSala.codigoSala)
            sessionStorage.setItem('nombreSala', filaSala.nombreSala)
            sessionStorage.setItem('uidCreador', this.usuario.uid)
            sessionStorage.setItem('temas', filaSala.listaTemas)
            window.location = 'sala-study.html'
        },
        traerTemas: function(){
            obtenerTemas();

        },
        changeData(){
            AlertaNuevosDatos()
        }
    },
    created: function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                perfil.datosUsuario();
                perfil.obtenerSalas();
                perfil.obtenerAvatares();
                perfil.traerTemas()
            } else {
                window.location = '../../index.html'
            }
        });

    }
})

function getTopicsSnapshot(snapshot){
    let topics=[]
    for (let i = 0; i < snapshot.numChildren(); i++) {
        let items={
            descripcion: snapshot.child(i).val().descripcion,
            idTema: snapshot.child(i).val().idTema,
            tema: snapshot.child(i).val().tema
        }
        topics.push(items)
    }
    return topics;
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
    if (contPhoto == 0) {
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
    } else if (sessionStorage.getItem('newAvatar') == 'si') {
        updateFirebase()
    } else if (newDateuser.value.trim() == '' && newUsername.value.trim() == '' && sessionStorage.getItem('newAvatar') == 'no') {
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

//TODO: hola este es un comentario

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

function verificarusuario() {
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

//Creando nuevas salas..

var sala = new Vue({
    el: '#vista-nueva-sala',
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
        Obtemas:function(){
           // obtenerTemas();

        }
    }
});

function clearModalNewSala() {
    $("[name='checkLista']").prop('checked', false);
    var nomSala = document.querySelector('#nomSala')
    var descSala = document.querySelector('#descSala')
    nomSala.value = ''
    descSala.value = ''
}

function guardarSala() {
    let uid = ''
    let codigoSala = ''
    let identificador = 'kk';
    let nomUsuario = ''
    var nomSala = document.querySelector('#nomSala').value.trim()
    var descSala = document.querySelector('#descSala').value.trim()
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            uid = user.uid;
            nomUsuario = user.displayName

            codigoSala = nomUsuario.substring(0, 2).toLowerCase() + uid.substring(0, 2).toLowerCase() + generarNumero(1000, 9999);
            let salaPHP = {
                uid,
                codigoSala,
                identificador
            };
            fetch(`../../private/PHP/salas/salas.php?proceso=recibirDatos&sala=${JSON.stringify(salaPHP)}`).then(resp => resp.text()).then(resp => {
                console.log(resp);
            });

            let maxParticipantes = document.getElementById('selMax').value;
            console.log(maxParticipantes);
            firebase.database().ref('Tecnoland').child('usuarios').child(uid).child('salas').child(codigoSala).set({
                nombreSala: nomSala,
                descripcion: descSala,
                maxParticipantes: maxParticipantes,
                temas: temasEscogidos
            }).then(function () {
                listaSalas = [];
                perfil.obtenerSalas();
                alertify.success('Se creó la sala');
                clearModalNewSala();
                $('#newSalaModal').modal('hide');
        
            }).catch(function (error) {
                console.log(error.message);
            });

            //console.log(sala.datosUsuario);
        } else {
            window.location = '../../index.html'
        }
    });



}

function eslegirTemas( ) {
    temasEscogidos = [];
    var nomSala = document.querySelector('#nomSala').value.trim()
    var descSala = document.querySelector('#descSala').value.trim()
    var listaCheckbox = document.getElementsByName('checkLista');
    var contCheck = 0;
    for (let i = 0; i < sala.temas.length; i++) {
        if (listaCheckbox[i].checked) {
            contCheck++;
            temasEscogidos.push(sala.temas[i]);

        }
    }
    if (nomSala == '' || descSala == '') {
        alertify.set('notifier', 'position', 'top-center');
        alertify.error('Complete los campos solicitados');

    }
    else if (contCheck == 0) {
        alertify.set('notifier', 'position', 'top-center');
        alertify.error('Sin temas agregados');
    }
    else {
        alertify.confirm('Alerta', '¿Está seguro de crear la sala con los temas seleccionados?', function () {
            guardarSala();

        }, function () {
            // alertify.error('Cancelado');
        });

    }
}

function generarNumero(minimo, maximo) {
    return Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
}

function obtenerTemas(kk){
    //var valor = document.querySelector('#txtBuscarSala').value.trim()
    //console.log(valor);
    var valor = $(kk).val()
    
    if (valor ==undefined){
        valor = ''
    }
    var sinResultadosTemas = document.querySelector('#sinResultadosTemas')
    fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${valor.trim()}`).then(resp => resp.json()).then(resp => {
        sala.temas = []
        respaldoTemas = []
        respaldoTemas = resp;
        sala.temas = respaldoTemas;
        if (sala.temas == '') {

            sinResultadosTemas.innerHTML = `
            <h1 style="font-size: 15px;   text-align: center;">Sin resultados de búsqueda</h1>
            <h1 style="text-align: center; align-items:center; font-size: 15px;"><i class="fa fa-search-minus" aria-hidden="true"></i></h1>
            `
        } else if (sala.temas !==''){
            sinResultadosTemas.innerHTML = ''
        }
    });

 }