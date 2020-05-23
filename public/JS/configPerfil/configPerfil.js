let avatar="";

var configPerfil =new Vue({
    el: '#idContenedor',
    data: {
        avatares:[],
        perfil:{
            uid:'',
            displayName:'',
            email:'',
            photoURL:'',
            
        }
     },
    methods:{
        vistaConfigDocente: function(){
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    console.log(user);
                    configPerfil.perfil.uid = sessionStorage.getItem('uid');
                    configPerfil.perfil.displayName = sessionStorage.getItem('displayName');
                    configPerfil.perfil.email = sessionStorage.getItem('email');
                    configPerfil.perfil.photoURL = sessionStorage.getItem('photoUrl');

                    console.log(configPerfil.perfil);
                    let lblNombre = document.getElementById('lblNombre');
                    lblNombre.innerText = configPerfil.perfil.displayName;

                    let imgPerfil = document.getElementById('perfilImg');
                    imgPerfil.setAttribute("src", configPerfil.perfil.photoURL);
                } else {
                    window.location = '../../index.html'
                }
            });
            let contenedorVista = document.getElementById('idContenedor');
            fetch(`../modulos/configCuenta.html`).then(function (respuesta) {
                return respuesta.text();
            }).then(function (respuesta) {
                contenedorVista.innerHTML = respuesta;
                sessionStorage.setItem('tipoCuenta','docente');
                configPerfil.actualizarAvatar();
            })
        },
        obtenerAvatares: function(){
            fetch(`../../private/PHP/avatares/avatares.php?proceso=buscarAvatares&valor=0`).then(resp => resp.json()).then(resp=>{
                this.avatares=resp;
                
                console.log(this.avatares);
            })
        },
        actualizarAvatar: function () {
            let imgPerfil = document.getElementById('perfilImg');
            imgPerfil.setAttribute("src", this.perfil.photoURL);
            
        },
        irPerfil:function(){
            window.location.pathname='../../vistas/perfil.html';
        },
        vistaConfigEstudiante: function(){
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    console.log(user);
                    configPerfil.perfil.uid = sessionStorage.getItem('uid');
                    configPerfil.perfil.displayName = sessionStorage.getItem('displayName');
                    configPerfil.perfil.email = sessionStorage.getItem('email');
                    configPerfil.perfil.photoURL = sessionStorage.getItem('photoUrl');

                    console.log(configPerfil.perfil);
                    let lblNombre = document.getElementById('lblNombre');
                    lblNombre.innerText = configPerfil.perfil.displayName;

                    let imgPerfil = document.getElementById('perfilImg');
                    imgPerfil.setAttribute("src", configPerfil.perfil.photoURL);
                } else {
                    window.location = '../../index.html'
                }
            });
             let contenedorVista = document.getElementById('idContenedor');
             fetch(`../modulos/configCuenta.html`).then(function (respuesta) {
                 return respuesta.text();
             }).then(function (respuesta) {
                 contenedorVista.innerHTML = respuesta;
                 sessionStorage.setItem('tipoCuenta', 'normal');
                 configPerfil.actualizarAvatar();
             })
        }
    },
    created: function () {
        this.obtenerAvatares();
    }
})

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

function seleccionarAvatar(){
    let imgAvatares = document.getElementsByName('avatar');
    //console.log(imgAvatares);
    imgAvatares.forEach(element => {
        element.addEventListener('click',e=>{
            //console.log(element);
            quitarBorder();
            element.style.border = "solid #0000FF"
            avatar=element.src;
            
            //console.log(src);
        })
    });
}

function guardarAvatar(){
    configPerfil.perfil.photoURL = avatar;
    configPerfil.actualizarAvatar();
    sessionStorage.setItem('photoUrl',avatar);
}

function quitarBorder(){
    let imgAvatares = document.getElementsByName('avatar');
    imgAvatares.forEach(element => {
        element.style.border = "none"
    });
}
function irPerfil(){
    var user = firebase.auth().currentUser;
    user.updateProfile({
        photoURL: configPerfil.perfil.photoURL
     }).then(function () {
        window.location='perfil.html'
    })
    
}

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
    console.log(usuario);
    fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(usuario)}`).then(resp => resp.json()).then(resp => {
        console.log(resp)
        irPerfil();
    });
}

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
    }
    
}

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
