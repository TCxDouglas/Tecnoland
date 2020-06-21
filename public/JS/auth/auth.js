/**
 * @author Josue Isaac Aparicio Diaz
 * @author Douglas Alexander Hernandez
 */

var autentificacion = new Vue({
    el: '#vista-registro',
    data: {
        displayName: '',
        photoURL: '',
        email: '',
        pass: '',
        passRepit: ''
    },
    methods: {
        /**@function signInGoogle {Funcion encargada de iniciar sesion usando la api de Google} 
        */
        signInGoogle: function () {
            validSignGoogle();
        },
        /**@function signFacebook {Funcion encargada de iniciar sesion con Facebook}
         * Actualmente descontinuada debido que para tener la api completa se necesita tener el sitio en dominio propio
         */
        signFacebook: function () {
            var provider = new firebase.auth.FacebookAuthProvider();

            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;

                //console.log(window.location)
                let usuario = {
                    displayname: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    fechanacimiento: '2000-05-09',
                    tipocuenta: 'docente'
                }

                guardarDatosSQL(usuario);
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        },
        /**@function crearCuenta {Funcion Encargada de crear la nueva cuenta del usuario}
         * Primero Valida las password con funciones aparte para que sea segura
         */
        crearCuenta: function () {
            let msg = "Parece que su contraseña no es del todo segura! <br/><br/>" +
                "Pruebe agregando 8 o más caracteres entre mayusculas, minusculas y números";
            let estado = validar_clave(this.pass, this.passRepit);
            
            if (estado === 'todo-naiz') {
                alertify.success('Espere un momento')
                createdUserFirebase(this.email, this.pass);
            } else if (estado === 'contra-invalida') {
                errorAlert(msg);
            } else {
                msg = "Parece que las contraseñas no coiciden! <br/><br/>" +
                    "Asegurese de escribir exactamente la misma contraseña en sus respectivos campos"
                errorAlert(msg);
            }
        },
        /**@function iniciarSesion {Funcion que inicia sesion con dos paremetros que son el correo y contraseña} */
        iniciarSesion: function () {
            let cargando = document.getElementById('Verificando');
            cargando.style.display = 'block';
            firebase.auth().signInWithEmailAndPassword(this.email, this.pass).then(function (user) {
                autentificacion.guardarSession()
            }).catch(function (error) {
                let cargando = document.getElementById('Verificando');
                cargando.style.display = 'none';
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/wrong-password') {
                    alertify.error('Correo o contraseña invalida, revise que este bien escrito')
                } else if (errorCode == 'auth/too-many-requests') {
                    alertify.error('Ha excedido el limite de intentos, por favor intente mas tarde')
                }
            });
        },
        /**@function guardarSession {Funcion que guarda los datos del usuario logeado en el session Storage}
         * Proximamente cambiara esta manera de mantener los datos para mayor seguridad de la plataforma
         */
        guardarSession: function () {
            var user = firebase.auth().currentUser;
            sessionStorage.setItem('displayName', user.displayName);
            sessionStorage.setItem('email', user.email);
            sessionStorage.setItem('uid', user.uid);
            sessionStorage.setItem('photoUrl', user.photoURL);
            obtenerDatosMYSQL(sessionStorage.getItem('uid'))

        },
        /**@function actualizarUsuario {Funcion que va acompañada de crearCuenta, esta actualiza el nombre de usuario y 
         * coloca una foto de perfil por default} */
        actualizarUsuario: function () {
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: this.displayName,
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/defaultUser.svg?alt=media&token=c7c055ed-ce69-4911-9999-efa329bc6ee4'
            }).then(function () {
                sessionStorage.setItem('displayName', user.displayName);
                sessionStorage.setItem('email', user.email);
                sessionStorage.setItem('uid', user.uid);
                sessionStorage.setItem('nacimiento', document.getElementById('inputFechanacimiento').value);
                sessionStorage.setItem('photoUrl', user.photoURL);

                let usuario = {
                    uid: user.uid,
                    accion: 'verificar'
                }
                guardarDatosSQL(usuario);
            })
        },
        /**@function termCondiciones {Muestra al usuario una alerta con las condiciones de uso de nuestra plataforma} */
        termCondiciones: function () {
            terminosYcondiciones();
        },
        /**@function seguridad {Valida la seguridad de la password} */
        seguridad: function () {
            validarSeguridad()
        },
        /**@function igualdad {Valida que la segunda password sea igual} */
        igualdad: function () {
            validarIgualdad();
        },
        /**@function recoverPass {Function que se usa para restablecer la contraseña de mi cuenta} */
        recoverPass: function () {
            var auth = firebase.auth();
            obtenerCorreo();
        }
    }
});

/**@function createdUserFirebase {Usa la api de firebase para crear una cuenta y administrarla}
 */
function createdUserFirebase(email, pass) {
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (user) {
        autentificacion.actualizarUsuario();

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode == "auth/email-already-in-use") {
            let msg = "El correo ya esta registrado en nuestra plataforma! <br/><br/>" +
                "Prueba iniciando sesion con tus credenciales";
            errorAlert(msg);
        }
        console.log(errorCode);
        console.log(errorMessage);
        console.log(error);

    });
}

/**@function validSignGoogle {Se encarga de iniciar sesion con la cuenta de google que el usuario escoga} 
 * Levanta un popup para obtener las cuentas que tenga iniciada sesion en el navegador
*/
function validSignGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // Esto le proporciona un token de acceso de Google.Puede usarlo para acceder a la API de Google.
        var token = result.credential.accessToken;
        // La información de usuario que ha iniciado sesión.
        var user = result.user;

        let usuario = {
            uid: user.uid,
            accion: 'verificar'
        };
        sessionStorage.setItem('displayName', user.displayName);
        sessionStorage.setItem('email', user.email);
        sessionStorage.setItem('uid', user.uid);
        sessionStorage.setItem('nacimiento', '2000-02-10');
        sessionStorage.setItem('photoUrl', user.photoURL);
        guardarDatosSQL(usuario);

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });
}

/**@function guardarDatosSQL {Se encarga de obtener los datos extra del usuario como la fecha de nacimiento y
 * tipo de cuenta que posee.} */
function guardarDatosSQL(usuario) {
    fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(usuario)}`).then(resp => resp.json()).then(resp => {
        if (resp != "sinCambios") {
            sessionStorage.setItem('tipoCuenta', resp[0].tipocuenta)
            sessionStorage.setItem('nacimiento', resp[0].fechanacimiento)
            if (resp[0].tipocuenta == 'normal') {
                window.location = 'perfilEstudiante.html'
            } else {
                window.location = 'perfil.html'
            }
        } else {
            window.location = 'configCuenta.html';
        }
    });
}

/**@function validar_clave {Se encarga de validar que las contraseñas cumplan con los requisistos de seguridad}
 * Mayor de 8 caracteres, tenga mayusculas y minisculas y que incluya numeros
 */
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

/**@function errorAlert {Funcion que manda un alertify con un mensaje que nosotros le pasemos como parametro}
 * @param msg {Mensaje que queremos enviar como error}
 */
function errorAlert(msg) {
    if (!alertify.errorAlert) {
        alertify.dialog('errorAlert', function factory() {
            return {
                build: function () {
                    var errorHeader = '<span class="fa fa-times-circle fa-2x" ' +
                        'style="vertical-align:middle;color:#e10000;">' +
                        '</span> UPS!';
                    this.setHeader(errorHeader);
                }
            };
        }, true, 'alert');
    }
    alertify.errorAlert('' + msg);
}

/**@function terminosYcondiciones {Construye el Alertify con las condiciones de uso de nuestra plataforma} */
function terminosYcondiciones() {
    var pre = document.createElement('pre');
    //custom style.
    pre.style.maxHeight = "400px";
    pre.style.margin = "0";
    pre.style.padding = "50px";
    pre.style.whiteSpace = "pre-line";
    pre.style.textAlign = "justify";
    pre.appendChild(document.createTextNode($('#terminos').text()));
    //show as confirm
    alertify.confirm(pre, function () {

        alertify.success('Terminos y condiciones aceptados');
        document.getElementById('checkTerminos').checked = true;
    }, function () {
        alertify.error('Terminos y condiciones no aceptados');
        document.getElementById('checkTerminos').checked = false;
    }).set({
        labels: {
            ok: 'ACEPTO',
            cancel: 'NO ACEPTO'
        },
        padding: false
    });
}

/**@function validarSeguridad {Se lanza esta funcion cada ves que va escribiendo una letra en la caja de texto} 
 * Siempre valida que sea mayor a 8 caracteres, mayusculas, minusculas y contega numeros
*/
function validarSeguridad() {
    var contra = document.getElementById('txtPass').value;
    var msg = document.getElementById('msgContra');

    if (contra.length >= 8){
        var mayuscula = false;
        var minuscula = false;
        var numero = false;
        var tamaño = false;
    }  
    for (var i = 0; i < contra.length; i++) {
        if (contra.charCodeAt(i) >= 65 && contra.charCodeAt(i) <= 90) {
            mayuscula = true;
        } else if (contra.charCodeAt(i) >= 97 && contra.charCodeAt(i) <= 122) {
            minuscula = true;
        } else if (contra.charCodeAt(i) >= 48 && contra.charCodeAt(i) <= 57) {
            numero = true;
        }
        if (contra.length >= 8) {
            tamaño = true;
        }
    }
    if (mayuscula == true && minuscula == true && numero == true && tamaño === true) {
        msg.style.color = "#15E603";
        msg.innerText = " Segura ";

    } else if (contra === "") {
        msg.style.color = "#fff";
        msg.innerText = "*";
    } else {
        msg.style.color = "red";
        msg.innerText = " Insegura ";
    }
    return "contra-invalida";
}

/**@function validarIgualdad {Validad que las contraseñas dadas sean iguales, sino se lo dice como advertencia} */
function validarIgualdad() {
    var contra = document.getElementById('txtPass').value;
    var contra2 = document.getElementById('txtPassRepit').value;
    var msg = document.getElementById('msg==');

    if (contra === contra2) {
        msg.style.color = "#15E603";
        msg.innerHTML = "Coinciden"
    } else if (contra2 === "") {
        msg.style.color = "#fff";
        msg.innerText = "*";
    } else {
        msg.style.color = "red";
        msg.innerHTML = " No coinciden"
    }
}

/**@function obtenerDatosMYSQL {Se usa en el login, y lo que hace es solicitar los datos del usuario y con el 
 * tipo de cuenta valida a que vista debe enviarlo, si a vista docente o vista Estudiante} */
function obtenerDatosMYSQL(usuario) {
    let datos = {
        uid: usuario,
        accion: ''
    }
    fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(datos)}`).then(resp => resp.json()).then(resp => {
        sessionStorage.setItem('tipoCuenta', resp[0].tipocuenta)
        sessionStorage.setItem('nacimiento', resp[0].fechanacimiento)

        if (resp[0].tipocuenta == 'normal') {
            window.location = 'perfilEstudiante.html'
        } else {
            window.location = 'perfil.html'
        }
    })
}

/**@function buscandoSala {Se lanza cuando el tipo de cuenta es de estudiante}
 * funcion descontinuada...
 */
/*function buscandoSala(uid) {
    firebase.database().ref('Tecnoland/usuarios/' + uid + '/unionSala').once('value').then(function (snapshot) {
        if (snapshot.val()) {
            sessionStorage.setItem('uidCreador', snapshot.val().creadorSala)
            sessionStorage.setItem('codigoSala', snapshot.val().codigoSala)
            
        }
    });
}*/

/**@function obtenerCorreo {Se lanza cuando se da click en recuperar contraseña, abre un alertify donde solicita el correo} 
 * Y esta funcion se encarga de obtener el correo que escriba el usuario
*/
function obtenerCorreo() {
    alertify.prompt('Ingrese el correo', 'ejemplo@ejemplo.com', function (evt, value) {
        //console.log(value)
        validarEmail(value),
            function () {
                alertify.error('Eliminación cancelada')
            }
    }).setHeader('<em> Restableciendo Contraseña </em> ');
}

/**@function validarEmail {Funcion que validad si el correo que escribio es valido} */
function validarEmail(email) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
        sendEmailPass(email)
    } else {
        alertify.error('La direccion de correo electronico que ha escrito es invalida')
    }
}

/**@function sendEmailPass {Funcion que se lanza si el email esta correcto, usando la api de Firebase manda un correo con un enlace
 * para restablecer la contraseña}
 */
function sendEmailPass(email) {
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(email).then(function () {
        alertify.success('Se le ha enviado un correo para restablecer su contraseña, revise su bandeja de entrada')
    }).catch(function (error) {
        alertify.error('Correo no registrado, verifique que el correo este bien escrito')
    });
}