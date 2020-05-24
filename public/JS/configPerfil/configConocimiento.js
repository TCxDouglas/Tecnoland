var conocimientoEstudiante = new Vue({
    el: '#contConocimiento',
    data: {
        conocimiento: ''
    },
    methods: {
        basico: function () {
            this.conocimiento = 'basico'
            this.alerta()
        },
        intermedio: function () {
            this.conocimiento = 'intermedio'
            this.alerta()
        },
        avanzado() {
            this.conocimiento = 'avanzando'
            this.alerta()
        },
        alerta: function () {
            console.log(this.conocimiento)
        }
    },
    created: function(){
        console.log('Se crea')
    }
})