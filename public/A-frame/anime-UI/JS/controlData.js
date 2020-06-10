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
        getViewCard(listTopicsRoom);
    }
})


function getViewCard(listTopicsRoom){
    
    let viewContainerCard= document.querySelector('#containerCardOption');
    listTopicsRoom.forEach(item => {
        let viewCardOption = `<a-entity id="cardOption" geometry="primitive: plane; width: 3.5" material="src: #fondoCard"
                  position="0 0 0.2" animation__mouseleave="dur: 80; from: 1.04 1.04 1.04; property: scale; startEvents: mouseleave;
                  pauseEvents: mouseenter; resumeEvents: ; to: 1 1 1" animation__scaledown="property: scale; from: 1.2 1.2 1.2; to: 1 1 1; dur: 100; autoplay: false; easing:
                  easeInOutCubic; startEvents: ; pauseEvents: ; resumeEvents: " animation__scaleup="property: scale; from: 1 1 1; to: 1.2 1.2 1.2; dur: 800; autoplay: false; easing:
                  easeInOutElastic; startEvents: ; pauseEvents: ; resumeEvents: " animation__mouseenter="dur: 80; from: 1 1 1; property: scale; startEvents: mouseenter; pauseEvents:
                  mouseleave; resumeEvents: ; to: 1.04 1.04 1.04"
                  proxy-event="event: click; to: a-scene, #containerCardOption, #containerDetails; as: itemSelect">

                  <a-text value="${item.tema}" text="align: center" id="lblTitulo" scale=""
                    position="0.37698 0.02339 0">
                    <a-image src="#${item.idTema}" material="" geometry="height: 0.75; width: 0.75" id="imgMuseo"
                      position="-1.7 0 0.01"></a-image>
                  </a-text>
                </a-entity>`;

        viewContainerCard.innerHTML+=viewCardOption;
    });
}