var autentificacion= new Vue({
    el:'#vista-registro',
    data: {
        displayName: '',
        photoURL: '',
        email:'',
        pass:'',
        
    },
    methods: {
        signInGoogle : function() {
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

            firebase.auth().signInWithPopup(provider).then(function (result) {
                // Esto le proporciona un token de acceso de Google.Puede usarlo para acceder a la API de Google.
                var token = result.credential.accessToken;
                // La información de usuario que ha iniciado sesión.
                var user = result.user;
                

                console.log(user);

                console.log(window.location)
                if (window.location.pathname == '/Tecnoland/') {
                    window.location = 'public/vistas/crear-salas.html';
                } else {
                    window.location = 'crear-salas.html';
                }
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
        signFacebook: function(){
            var provider = new firebase.auth.FacebookAuthProvider();

            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;

                //console.log(window.location)
                if (window.location.pathname == "/Tecnoland/") {
                    window.location = 'public/vistas/perfil.html';
                } else {
                    window.location = 'perfil.html';
                }
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
        crearCuenta: function(){
            //console.log(this.displayName);
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
        },
        iniciarSesion: function(){
            firebase.auth().signInWithEmailAndPassword(this.email, this.pass).then(function (resp) {
                console.log(resp);
                window.location = 'crear-salas.html'
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                console.log(errorCode);
                // ...
            });
        },
        actualizarUsuario : function(){
            //console.log(this.displayName);
            var user = firebase.auth().currentUser;
            user.updateProfile({
                displayName: this.displayName,
                photoURL: 'https://firebasestorage.googleapis.com/v0/b/virtual-city-eb37f.appspot.com/o/defaultUser.svg?alt=media&token=c7c055ed-ce69-4911-9999-efa329bc6ee4'
            }).then(function () {
                console.log(user);
                window.location = 'public/vistas/perfil.html';

            })
        }
    }
});

