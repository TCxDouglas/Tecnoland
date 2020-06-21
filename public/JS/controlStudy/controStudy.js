/**@author Douglas Alexander Hernandez Flores */

var controlMenu = new Vue({
    el: '#menuStudyRoom',
    data: {

    },
    methods: {
        /**@function changeView {Funcion que cambia de pagina, lo devuelve al listado de sala
         * depediendo del tipo de cuenta que tenga} */
        changeView: function () {
            let accountType = sessionStorage.getItem('tipoCuenta');
            if (accountType == 'docente') {
                window.location = 'perfil.html'
            } else {
                window.location = 'perfilEstudiante.html'
            }
        }
    },
    created: function(){
        firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                window.location = '../../index.html'
            }
        })
    }
})