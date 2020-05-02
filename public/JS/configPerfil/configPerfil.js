var configPerfil =new Vue({
    el: '#idContenedor',
    data: {
        avatares:[],
        perfil:{
            uid:'',
            displayName:'',
            email:'',
            photoURL:''
        }
     },
    methods:{
        vistaConfig: function(){

            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    console.log(user);
                    configPerfil.perfil.uid = user.uid;
                    configPerfil.perfil.displayName = user.displayName;
                    configPerfil.perfil.email = user.email;
                    configPerfil.perfil.photoURL = user.photoURL;
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
            let src=element.src;
            configPerfil.perfil.photoURL=src;
            configPerfil.actualizarAvatar();
            //console.log(src);
        })
    });
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
        window.location = "perfil.html";
    })
    
}
