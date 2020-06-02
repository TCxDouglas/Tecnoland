var controlMenu = new Vue({
    el: '#menuStudyRoom',
    data: {

    },
    methods: {
        changeView: function () {
            let accountType = sessionStorage.getItem('tipoCuenta');
            if (accountType == 'docente') {
                window.location = 'perfil.html'
            } else {
                window.location = 'perfilEstudiante.html'
            }
        }
    }
})