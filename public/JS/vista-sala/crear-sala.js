let sala= new Vue({
    el: '#vista-sala',
    data:{
        temas:[]
    },
    methods:{
        crearSala : function(){
            let valor="";
            fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${valor}`).then(resp => resp.json()).then(resp => {
                console.log(resp);
                this.temas=resp;
            });
        }
    },
    created: function () {
        this.crearSala();
    }
});
