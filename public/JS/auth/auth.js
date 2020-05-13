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
        signInGoogle: function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

            firebase.auth().signInWithPopup(provider).then(function (result) {
                // Esto le proporciona un token de acceso de Google.Puede usarlo para acceder a la API de Google.
                var token = result.credential.accessToken;
                // La información de usuario que ha iniciado sesión.
                var user = result.user;
                //console.log(user);

                let usuario = {
                    displayname: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    fechanacimiento: '2000-05-09',
                    tipocuenta: 'docente'
                }

                guardarSql(usuario);
 
                // ...
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode)
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
        },
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

                guardarSql(usuario);
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
        crearCuenta: function () {
            
            //console.log(this.displayName);
            let msg = "Parece que su contraseña no es del todo segura! <br/><br/>" +
            "Pruebe agregando 8 o más caracteres entre mayusculas, minusculas y números";

            let estado = validar_clave(this.pass, this.passRepit);
            console.log(estado);
            if (estado === 'todo-naiz'){
                firebase.auth().createUserWithEmailAndPassword(this.email, this.pass).then(function (user) {
                    autentificacion.actualizarUsuario();
        
                        //dataUser(user);
                    }).catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorCode);
                        console.log(errorMessage);
                        // ...
                    });       
            } else if (estado === 'contra-invalida'){
                errorAlert(msg);
            } else{
                msg = "Parece que las contraseñas no coiciden! <br/><br/>" +
                "Asegurese de escribir exactamente la misma contraseña en sus respectivos campos"
                errorAlert(msg);

            }


        },
        iniciarSesion: function () {
            let cargando = document.getElementById('Verificando');
            cargando.style.display = 'block';
            firebase.auth().signInWithEmailAndPassword(this.email, this.pass).then(function (resp) {
                console.log(resp);
                window.location = 'perfil.html'
            }).catch(function (error) {
                // Handle Errors here.
                let cargando = document.getElementById('Verificando');
                cargando.style.display = 'none';
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);
                // ...
            });
        },
        actualizarUsuario: function () {
            //console.log(this.displayName);
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: this.displayName,
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/defaultUser.svg?alt=media&token=c7c055ed-ce69-4911-9999-efa329bc6ee4'
            }).then(function () {
                console.log(user);

                let usuario = {
                    displayname: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    fechanacimiento: document.getElementById('inputFechanacimiento').value,
                    tipocuenta: 'docente'
                }

                guardarSql(usuario);

            })
        },

        termCondiciones: function(){
         
                terminosYcondiciones();
           
        },
        
        seguridad: function(){
            validarSeguridad()
        }
    }
});

function guardarSql(usuario){

    if (window.location.pathname == '/Tecnoland/crearCuenta.html'){
        fetch(`private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(usuario)}`).then( resp=>resp.text() ).then(resp=>{
            console.log(resp);
    
           console.log(window.location)
            if (window.location.pathname == '/Tecnoland/' || window.location.pathname == '/Tecnoland/crearCuenta.html') {
               window.location = 'public/vistas/perfil.html';
            } else {
                window.location = 'perfil.html';
            }
         });   
    }

    else {
        fetch(`../../private/PHP/usuarios/usuario.php?proceso=obtener_datos&usuario=${JSON.stringify(usuario)}`).then( resp=>resp.text() ).then(resp=>{
            console.log(resp);
    
           console.log(window.location)
            if (window.location.pathname == '/Tecnoland/' || window.location.pathname == '/Tecnoland/crearCuenta.html') {
               window.location = 'public/vistas/perfil.html';
            } else {
                window.location = 'perfil.html';
            }
         });
    }

}
    
function validar_clave(contraseña, contraseña2){

    
    if(contraseña==contraseña2){

        if(contraseña.length >= 8)
        {		
            var mayuscula = false;
            var minuscula = false;
            var numero = false;
            
            for(var i = 0;i<contraseña.length;i++)
            {
                if(contraseña.charCodeAt(i) >= 65 && contraseña.charCodeAt(i) <= 90)
                {
                    mayuscula = true;
                }
                else if(contraseña.charCodeAt(i) >= 97 && contraseña.charCodeAt(i) <= 122)
                {
                    minuscula = true;
                }
                else if(contraseña.charCodeAt(i) >= 48 && contraseña.charCodeAt(i) <= 57)
                {
                    numero = true;
                }
    
            }
            if(mayuscula == true && minuscula == true  && numero == true)
            {
               
                return "todo-naiz";
            }
        
        }
  
       
        return "contra-invalida";
    }
    return "contras-no-coinciden";
}

function validarSeguridad(){  
 var contra = document.getElementById('txtPass').value;
 var msg = document.getElementById('msgContra');

        if(contra.length >= 8)
        		
            var mayuscula = false;
            var minuscula = false;
            var numero = false;
            var tamaño = false;
            
            for(var i = 0;i<contra.length;i++)
            {
                if(contra.charCodeAt(i) >= 65 && contra.charCodeAt(i) <= 90  )
                {
                    mayuscula = true;
                }
                else if(contra.charCodeAt(i) >= 97 && contra.charCodeAt(i) <= 122)
                {
                    minuscula = true;
                }
                else if(contra.charCodeAt(i) >= 48 && contra.charCodeAt(i) <= 57)
                {
                    numero = true;
                }

                if(contra.length >= 8){
                    tamaño = true;
                }
    
            }
            if(mayuscula == true && minuscula == true  && numero == true && tamaño === true)
            {
             
               msg.style.color ="#15E603";
               msg.innerText = " Segura ";
                
            } else if (contra ===""){
                msg.innerText = "*";
            }
            
            else{
                
                msg.style.color ="red";
                msg.innerText = " Insegura ";

            }
        
        
  
       
        return "contra-invalida";

}

function errorAlert (msg){
    // Extend existing 'alert' dialog
if(!alertify.errorAlert){
    //define a new errorAlert base on alert
    alertify.dialog('errorAlert',function factory(){
      return{
              build:function(){
                  var errorHeader = '<span class="fa fa-times-circle fa-2x" '
                  +    'style="vertical-align:middle;color:#e10000;">'
                  + '</span> UPS!';
                  this.setHeader(errorHeader);
              }
          };
      },true,'alert');
  }
  //launch it.
  // since this was transient, we can launch another instance at the same time.
  alertify.errorAlert(''+msg);
}

function terminosYcondiciones(){
        var pre = document.createElement('pre');
        //custom style.
        pre.style.setHeader = 'HOLA'
        pre.style.maxHeight = "400px";
        pre.style.margin = "0";
        pre.style.padding = "50px";
        pre.style.whiteSpace = "pre-line";
        pre.style.textAlign = "justify";
        pre.appendChild(document.createTextNode($('#terminos').text()));
        //show as confirm
        alertify.confirm(pre, function(){
        
                alertify.success('Terminos y condiciones aceptados');
                document.getElementById('checkTerminos').checked = true;
        
        
            },function(){
        
                alertify.error('Terminos y condiciones no aceptados');
                document.getElementById('checkTerminos').checked = false;
            }).set({labels:{ok:'ACEPTO', cancel: 'NO ACEPTO'}, padding: false});
    

}