var sceneVR = new Vue({
    el: '#sceneVR',
    data:{
        listTopicsRoom: []
    },
    methods:{
        
    },
    created: function (){
        listTopicsRoom=JSON.parse(sessionStorage.getItem('temas'));
        console.log(listTopicsRoom);
    }
})