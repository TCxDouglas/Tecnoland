/**@author Douglas Alexander Hernandez Flores */

var vistaPass=new Vue({
    el: '#contenedor',
    data:{
        pass:'',
        passRepit:''
    },
    methods:{
        recoverPass: function(){
            let estado = validar_clave(this.pass, this.passRepit);
            if (estado == 'correcto'){
                obteniendoParametros()
            }else{
                
            }
            
        },
        validatePassEquals: function () {
            validarIgualdad()
        },
        validatePassSecurity: function() {
            validarSeguridad()
        }
    },
    created: function(){
        
    }
})


/**@function validarSeguridad {Valida que la contraseña cumpla con las reglas de seguridad} */
function validarSeguridad() {
    var contra = document.getElementById('pass1').value;
    var msg = document.getElementById('msgPass1');
    let form = document.getElementById('formPass')

    var mayuscula = false;
    var minuscula = false;
    var numero = false;
    var tamaño = false;

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
        form.classList.add("valid")
        form.classList.remove("invalid")
        msg.style.color = "#00ff00";
        msg.innerText = " Contraseña Segura ";

    } else if (contra === "") {
        form.classList.remove("valid")
        form.classList.remove("invalid")
        msg.style.color = "#00ff00";
        msg.innerText = "";
    } else {
        form.classList.remove("valid")
        form.classList.add("invalid")
        msg.style.color = "#ff0000";
        msg.innerText = " Contraseña insegura ";

    }
    return "contra-invalida";
}

/**@function validarIgualdad {Valida que la contraseña de confirmacion sea igual} */
function validarIgualdad() {
    var contra = document.getElementById('pass1').value;
    var contra2 = document.getElementById('pass2').value;
    var msg = document.getElementById('msgPass2');
    let form = document.getElementById('formPass2')

    if (contra === contra2) {
        form.classList.add("valid")
        form.classList.remove("invalid")
        msg.style.color = "#00ff00";
        msg.innerHTML = "Contraseña coinciden"
    } else if (contra2 === "") {
        form.classList.remove("valid")
        form.classList.remove("invalid")
        msg.style.color = "#00ff00";
        msg.innerText = "";
    } else {
        form.classList.remove("valid")
        form.classList.add("invalid")
        msg.style.color = "#ff0000";
        msg.innerHTML = "Contraseñas no coinciden"
    }
}

/**@function obteniendoParametros {Obtiene los parametros que nos envia la API de Firebase para restablecer contraseña} */
function obteniendoParametros(){
    
    var mode = getParameterByName('mode');

    var actionCode = getParameterByName('oobCode');

    console.log(mode)
    console.log(actionCode)
    verificandoTarea(mode,actionCode)
}

/**@function verificandoTarea {Esta funcion verifica la accion que hay que realizar}
 * Esto lo hacemos por si mas adelante añadimos la funcionalidad de cambiar de correo
 */
function verificandoTarea(mode, actionCode){
    var auth = firebase.auth();

    switch (mode) {
        case 'resetPassword':
            cambiandoContraseña(auth, actionCode);
            //console.log(vistaPass.pass)
            break;
        case 'recoverEmail':
            handleRecoverEmail(auth, actionCode, lang);
            break;
        case 'verifyEmail':
            handleVerifyEmail(auth, actionCode, continueUrl, lang);
            break;
        default:
    }
}

/**@function cambiandoContraseña {Funcion que resetea la password} */
function cambiandoContraseña(auth, actionCode){
    var accountEmail;
    
    auth.verifyPasswordResetCode(actionCode).then(function (email) {
        var accountEmail = email;

        auth.confirmPasswordReset(actionCode, vistaPass.pass).then(function (resp) {
            alertify.success('Cambio de contraseña hecho con exito, vuelva a intentar iniciar sesion');
            alertify.success('Ya puede cerrar esta ventana');
        }).catch(function (error) {
            alertify.error('Tiempo de peticion caduco, intente mas tarde');
        });
    }).catch(function (error) {
        alertify.error('Tiempo de peticion caduco, intente mas tarde Tontito');
    });
}

/**@function getParameterByName {Funcion la cual retorna informacion que viene puesta en la URL}
 * @param name {Parametro que recibe la URL de donde extreeremos los datos}
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null){
        return "";
    }else{
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }  
}

/**@function validar_clave {Funcion que verifica la contraseña este dentro de los parametros de seguridad} */
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

                return "correcto";
            }
        }
        return "contra-invalida";
    }
    return "contras-no-coinciden";
}
