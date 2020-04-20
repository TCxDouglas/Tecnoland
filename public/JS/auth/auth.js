
document.addEventListener('DOMContentLoaded',e=>{
    document.getElementById('btnRegistrarse').addEventListener('click',e=>{
        let email = document.getElementById('txtEmail').value
        let pass = document.getElementById('txtPass').value
        crearCuenta(email,pass);
    })
});

function crearCuenta(email,pass){
    firebase.auth().createUserWithEmailAndPassword(email, pass).then(function(resp){
        console.log(resp);

    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}

function iniciarSesion(){
    let email = document.getElementById('txtEmail').value
    let pass = document.getElementById('txtPass').value

    firebase.auth().signInWithEmailAndPassword(email, pass).then(function(resp){
        console.log(resp);
        window.location='crear-salas.html'
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);        
        // ...
    });
}

function dataUser() {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;

        document.getElementById('userlogin').innerText = email;
    }
}

function signInGoogle(a) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // Esto le proporciona un token de acceso de Google.Puede usarlo para acceder a la API de Google.
        var token = result.credential.accessToken;
        // La información de usuario que ha iniciado sesión.
        var user = result.user;
        console.log(user)
        if(a==a){
            window.location = 'public/vistas/crear-salas.html';
        }else{
            window.location = 'crear-salas.html';
        }

        document.getElementById('userlogin').innerText = user.displayName;
        document.getElementById('fotoPerfil').src = user.photoURL;
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

}

function signFacebook(direccion) {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;

        console.log(user);
        window.location = direccion;

        document.getElementById('userlogin').innerText = user.displayName;
        document.getElementById('fotoPerfil').src = user.photoURL;
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
}