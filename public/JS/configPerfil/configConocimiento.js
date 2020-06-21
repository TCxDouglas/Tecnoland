/**@author Douglas Alexander Hernandez Flores */

/**@function Basico, Intermedio y Avanzado 
 * Son funciones que asignan el nivel de conocimiento que el usuario cree que posse
 * Esta funcionalidad esta planeada para una Funcion mas grande a futuro
 * Que es la de recomendar temas de la plataforma en base a su conocimiento previo
*/
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