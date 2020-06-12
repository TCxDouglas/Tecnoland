let contTopic=0;
let positionSelect=-1;
var sceneVR = new Vue({
    el: '#sceneVR',
    data:{
        listTopicsRoom: [],
        dataItem:[]
    },
    methods:{
        dataContainerDetails: function(item){
            //console.log('FUNCIONA ESTA COSA')
            //console.log(item)
            
            positionSelect = item.srcElement.dataset.position;
            dataItem=listTopicsRoom[positionSelect]
            //console.log(positionSelect)

            let titulo = document.querySelector('#lblTituloItem')
            
            let descripcion=titulo.lastChild
            titulo.setAttribute('value',dataItem.tema)
            descripcion.setAttribute('value',dataItem.descripcion)
            //console.log(titulo.lastChild)

            changeColorSelect();
        },
        nextTopics: function(){
            let listCardOptions = document.querySelectorAll('#cardOption')
            let lblTitulosCard = document.querySelectorAll('#lblTituloCard');
            let imgCard = document.querySelectorAll('#imgIconCard');
            //console.log(listCardOptions)
            let contListCard=0;
            
            while (contListCard < 4) {
                if ((contTopic + 1) >= listTopicsRoom.length) {
                    contListCard = 4
                }else{
                    contTopic++;
                    lblTitulosCard[contListCard].setAttribute('value', listTopicsRoom[contTopic].tema)
                    imgCard[contListCard].setAttribute('src', '#' + listTopicsRoom[contTopic].idTema)

                    listCardOptions[contListCard].dataset.position = contTopic;
                    lblTitulosCard[contListCard].dataset.position = contTopic;
                    imgCard[contListCard].dataset.position = contTopic;
                    
                    contListCard++;
                } 
            }
            changeColorSelect()
            //console.log(contTopic)
        },
        prevTopics: function(){
            let listCardOptions = document.querySelectorAll('#cardOption')
            let lblTitulosCard = document.querySelectorAll('#lblTituloCard');
            let imgCard = document.querySelectorAll('#imgIconCard');
            console.log(listCardOptions)
            let contListCard = 0; //Variable que recorre los array de las CARDS
            let pos=contTopic-4; //Variable que determina la posicion del array listTopicRoom
            
            
            while (contListCard < 4) {
                if((contTopic-1)<3){  //Menor que 3 por que son los primeros 4 temas de la listTopicRoom
                    contListCard=4
                }else{
                    lblTitulosCard[contListCard].setAttribute('value', listTopicsRoom[pos].tema)
                    imgCard[contListCard].setAttribute('src', '#' + listTopicsRoom[pos].idTema)
                    lblTitulosCard[contListCard].setAttribute('value', listTopicsRoom[pos].tema)
                    imgCard[contListCard].setAttribute('src', '#' + listTopicsRoom[pos].idTema)

                    listCardOptions[contListCard].dataset.position = pos;
                    lblTitulosCard[contListCard].dataset.position = pos;
                    imgCard[contListCard].dataset.position = pos;
                    contTopic--;
                    contListCard++;
                    pos--;
                }
            }
            changeColorSelect()
            //console.log(contTopic)
        },
        validateNumTopics: function(){
            if(listTopicsRoom.length<=4){
                let arrow = document.getElementById('imgNext')
                console.log(arrow)
                arrow.setAttribute('visible', 'false')
                arrow = document.getElementById('imgPrev')
                arrow.setAttribute('visible', 'false')
            }
            
        }
    },
    created: function (){
        listTopicsRoom=JSON.parse(sessionStorage.getItem('temas'));
        console.log(listTopicsRoom);
        let inicio=0, final=0;
        if(listTopicsRoom.length>4){
            final=4
        }else{
            
            final=listTopicsRoom.length
        }
        getViewCard(listTopicsRoom, inicio, final)
    }
})


function changeColorSelect() {
    let lblTitulos = document.querySelectorAll('#lblTituloCard');
    lblTitulos.forEach(element => {
        if (element.dataset.position == positionSelect) {
            element.setAttribute('color', '#21e828');
        }
        else {
            element.setAttribute('color', '#fff');
        }
    });
}

function getViewCard(listTopicsRoom, inicio, final){
    
    let viewContainerCard= document.querySelector('#containerCardOption');
    viewContainerCard.innerHTML="";
    console.log(listTopicsRoom.length)
    //let cont=0
    //let contContainer=1;
    /*while (listTopicsRoom.length>cont) {
        console.log(contContainer);
        console.log(cont);
        cont=cont+4;
        contContainer++;
    }*/

    for (let i = inicio; i < final; i++) {
        let viewCardOption = `
        <a-entity id="cardOption" geometry="primitive: plane; width: 3.5" material="src: #fondoCard"
                  position="0 0 0.2" 
                  animation__mouseleave="dur: 80; from: 1.04 1.04 1.04; property: scale; startEvents: mouseleave;
                  pauseEvents: mouseenter; resumeEvents: ; to: 1 1 1" 
                  animation__scaledown="property: scale; from: 1.2 1.2 1.2; to: 1 1 1; dur: 100; autoplay: false; easing:
                  easeInOutCubic; startEvents: ; pauseEvents: ; resumeEvents: " 
                  animation__scaleup="property: scale; from: 1 1 1; to: 1.2 1.2 1.2; dur: 800; autoplay: false; easing:
                  easeInOutElastic; startEvents: ; pauseEvents: ; resumeEvents: " 
                  animation__mouseenter="dur: 80; from: 1 1 1; property: scale; startEvents: mouseenter; pauseEvents:
                  mouseleave; resumeEvents: ; to: 1.04 1.04 1.04"
                  
                  proxy-event="event: click; to: a-scene, #containerCardOption, #containerDetails;  as: itemSelect"
                  data-position=${i} v-on:Click="dataContainerDetails">

                  <a-text value="${listTopicsRoom[i].tema}" text="align: center" id="lblTituloCard" scale=""
                    position="0.37698 0.02339 0" data-position=${i}
                    proxy-event="event: click; to: a-scene, #containerCardOption, #containerDetails;  as: itemSelect">
                    <a-image id="imgIconCard" src="#${listTopicsRoom[i].idTema}" material="" geometry="height: 0.75; width: 0.75" id="imgMuseo"
                      position="-1.7 0 0.01" data-position=${i}
                      proxy-event="event: click; to: a-scene, #containerCardOption, #containerDetails;  as: itemSelect"></a-image>
                  </a-text>
                </a-entity>`;
        viewContainerCard.innerHTML += viewCardOption
    }
    contTopic=contTopic+ (final-1);
}

