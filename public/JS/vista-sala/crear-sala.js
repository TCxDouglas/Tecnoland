let temasEscogidos=[];
let sala= new Vue({
    el: '#vista-sala',
    data:{
        temas:[],
        valor:''
    },
    methods:{
        obtenerTemas : function(){
            
            fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${this.valor}`).then(resp => resp.json()).then(resp => {
                console.log(resp);
                this.temas=resp;
            });
        },
        escogiendoTemas : function(tema){

            if(!(temasEscogidos.includes(tema)))
            temasEscogidos.push(tema);
            console.log(temasEscogidos);
        },
        eliminandoTemas : function(tema){
            temasEscogidos.splice(tema.id, 1);
            console.log(temasEscogidos);
        }
    },
    created: function () {
        this.obtenerTemas();
    }
});
