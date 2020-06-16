var containerTrophy = new Vue({
    el: '#sceneVR',
    data:{
        listTrophy : []
    },
    methods: {

    },
    created: function(){
        getListTrophy()
    }

})

function getListTrophy(){
    firebase.database().ref('/Tecnoland/logros').on('value',function(snapshot) {
        if (snapshot.val()) {
            let listTrophy=[]
            snapshot.forEach(element => {
                let aux={
                    nombreLogro: element.val().nombreLogro,
                    descripcion: element.val().descripcion,
                    idTema: element.val().idTema,
                    categoria: element.val().categoria
                }
                listTrophy.push(aux);
            });
            console.log(listTrophy)
        }
    })   
    
}