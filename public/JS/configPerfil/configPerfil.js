var configPerfil =new Vue({
    el: '#idContenedor',
    data: {
        avatares:[],
        photoURL: 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/defaultUser.svg?alt=media&token=c7c055ed-ce69-4911-9999-efa329bc6ee4'
     },
    methods:{
        vistaConfig: function(){
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
            imgPerfil.setAttribute("src", this.photoURL)
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
    seleccionarAvatar()
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
            configPerfil.photoURL=src;
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
    window.location="perfil.html";
}
