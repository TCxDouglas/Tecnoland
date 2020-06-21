/**
 * @author Douglas Alexander Hernandez Flores
 */

var configPerfil =new Vue({
    el: '#idContenedor',
    data: {
        avatares:[],
        perfil:{
            uid:'',
            displayName:'',
            email:'',
            photoURL:'',
        },
        avatar: ''
     },
    methods:{
        /**@function vistaConfigDocente {Esta funcion se usa cuando se elige el tipo de cuenta de docente} */
        vistaConfigDocente: function(){
            sessionStorage.setItem('tipoCuenta','docente');
            loadViewConfigCuenta()
        },
        /**@function obtenerAvatares {Esta funcion se usa para traer los avatares que el usuario puede escoger para 
         * personalizar su perfil} */
        obtenerAvatares: function(){
            fetch(`../../private/PHP/avatares/avatares.php?proceso=buscarAvatares&valor=0`).then(resp => resp.json()).then(resp=>{
                this.avatares=resp;
            })
        },
        /**@function actualizarAvatar {Esta funcion actualiza el avatar el usuario pero de manera local, todavia no se envia a Firebase} */
        actualizarAvatar: function () {
            let imgPerfil = document.getElementById('perfilImg');
            imgPerfil.setAttribute("src", this.perfil.photoURL);
            
        },
        /**@function irPerfil {Esta funcion se ejecuta si no hay ninguna cuenta logeada, este lo devuelve al inicio} */
        irPerfil:function(){
            window.location.pathname='../../vistas/perfil.html';
        },
        /**@function vistaConfigEstudiante {Se lanza cuando se escoge el tipo de cuenta de estudiante} */
        vistaConfigEstudiante: function(){
             sessionStorage.setItem('tipoCuenta', 'normal');
             loadViewConfigCuenta();
        }
    },
    created: function () {
        firebase.auth().onAuthStateChanged(function (user){
            if(!user){
                window.location = '../../index.html'
            }
        })
        this.obtenerAvatares();
    }
})

/**@function loadViewConfigCuenta {Funcion que carga la siguiente vista de configurar cuenta}
 * esto sin salir de la pagina actual no recargar la pagina
 */
function loadViewConfigCuenta() {
    let contenedorVista = document.getElementById('idContenedor');
    fetch(`../modulos/configCuenta.html`).then(function (respuesta) {
        return respuesta.text();
    }).then(function (respuesta) {
        contenedorVista.innerHTML = respuesta;
        configPerfil.actualizarAvatar();
        loadDataUser()
    });
}

/**@function colocarAvatares {Esta funcion se llama cuando se levanta un modal para escoger un avatar de los que tenemos 
 * disponibles} */
function colocarAvatares(){
    let contenedor = document.getElementById('contenedorAvatares');
    contenedor.innerHTML = "";
    configPerfil.avatares.forEach(element => {
        let item = `<div class="col">
                            <img name = "avatar" class = "imgAvatar" src = ${element.urlAvatar} >
                    </div>`;
        contenedor.innerHTML+=item;
    });
    seleccionarAvatar();
}

/**@function seleccionarAvatar {Esta funcion encierra en un circulo el avatar que escogamos, indicando que lo tenemos seleccionado} */
function seleccionarAvatar(){
    let imgAvatares = document.getElementsByName('avatar');

    imgAvatares.forEach(element => {
        element.addEventListener('click',e=>{
            quitarBorder(imgAvatares);
            element.style.border = "solid #0000FF"
            configPerfil.avatar = element.src;
        })
    });
}

/**@function guardarAvatar {Funcion que guarda el avatar en la variable global de Vue y tambien en el session Storage} */
function guardarAvatar(){
    configPerfil.perfil.photoURL = configPerfil.avatar;
    configPerfil.actualizarAvatar();
    sessionStorage.setItem('photoUrl', configPerfil.avatar);
}

/**@function quitarBorder {Esta funcion le quita la selecion a los avatares, asi solo hay uno seleccionado} 
 * @param imgAvatares {Recibe este array con los img que contienen los avatares}
*/
function quitarBorder(imgAvatares){
    imgAvatares.forEach(element => {
        element.style.border = "none"
    });
}

/**@function irPerfil {Funcion que se ejecuta luego que ya ha finalizado el proceso de configuracion de cuenta}
 * Dependiendo del tipo de cuenta lo envia a una vista o a otra
 */
function irPerfil(){
    var user = firebase.auth().currentUser;
    user.updateProfile({
        photoURL: configPerfil.perfil.photoURL
     }).then(function () {
         if(sessionStorage.getItem('tipoCuenta')=='normal'){
             window.location='perfilEstudiante.html'
         }else{
            window.location = 'perfil.html'
         }
        
    })
    
}

/**@function guardaDatos {Funcion que se ejecuta justo antes de enviarlo a otra vista, lo que hace es enviar a 
 * la BD de MYSQL los datos del usuario y los actualize} */
function guardaDatos(){
    let usuario = {
        displayname: sessionStorage.getItem('displayName'),
        email: sessionStorage.getItem('email'),
        uid: sessionStorage.getItem('uid'),
        fechanacimiento: sessionStorage.getItem('nacimiento'),
        tipocuenta: sessionStorage.getItem('tipoCuenta'),
        conoc: sessionStorage.getItem('conocimiento'),
        accion: 'guardar'
    }
    fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(usuario)}`).then(resp => resp.json()).then(resp => {
        console.log(resp)
        irPerfil();
    });
}

/** @function vistaConocimiento {Funcion que carga si el tipo de cuenta que se eligio es de tipo estudiante} */
function vistaConocimiento(){
    if (sessionStorage.getItem('tipoCuenta') == 'normal'){
        let contenedorVista = document.getElementById('idContenedor');
        fetch(`../modulos/conPrevioEstudiante.html`).then(function (respuesta) {
            return respuesta.text();
        }).then(function (respuesta) {
            contenedorVista.innerHTML = respuesta;
        })
    }else{
        window.location='perfil.html'
        guardaDatos()
    }
    
}

/**@function basico, intermedio y avazando {Son funciones que obtienen el nivel de conocimiento que se considera el usuario}
 * Funcionalidad aun en planes de desarrollo, se usara para recomendar temas en base a su conocimiento
 */
function basico(){
    sessionStorage.setItem('conocimiento','basico');
    guardaDatos()
}

function intermedio(){
    sessionStorage.setItem('conocimiento','intermedio');
    guardaDatos()
} 

function avanzado(){
    sessionStorage.setItem('conocimiento','avanzado');
    guardaDatos()
}

/**@function loadDataUser {Funcion que verifica que haya un usuario logeado, sino lo devulve a la pantalla de inicio} */
function loadDataUser(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            configPerfil.perfil.uid = sessionStorage.getItem('uid');
            configPerfil.perfil.displayName = sessionStorage.getItem('displayName');
            configPerfil.perfil.email = sessionStorage.getItem('email');
            configPerfil.perfil.photoURL = sessionStorage.getItem('photoUrl');

            let lblNombre = document.getElementById('lblNombre');
            
            lblNombre.innerText = configPerfil.perfil.displayName;

            let imgPerfil = document.getElementById('perfilImg');
            imgPerfil.setAttribute("src", configPerfil.perfil.photoURL);
        } else {
            window.location = '../../index.html'
        }
    });
}