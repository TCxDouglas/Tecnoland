let contTopic=0;
let positionSelect=-1;
let positionSelectTrophy=-1;
let contTrophy=0;
var sceneVR = new Vue({
    el: '#sceneVR',
    data:{
        listTopicsRoom: [],
        dataItem:[],
        listTrophyAll: []
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
            //console.log(listCardOptions)
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
            
        },
        backTopics(){
            positionSelect = -1;
            changeColorSelect()
        },
        exitVR(){
            window.location='../../vistas/sala-study.html'
        },
        nextTrophy(){
            nextTrophy(this.listTrophyAll);
        },
        prevTrophy(){
            prevTrophy(this.listTrophyAll)
        },
        dataDetailsTrophy(item){
            console.log(item)
            positionSelectTrophy = item.srcElement.dataset.position;
            dataItem = this.listTrophyAll[positionSelectTrophy]
            console.log(positionSelectTrophy)

            let iconTrophyCategory = document.querySelector('#trophyIconCategory')
            let lblNameTrophy = document.querySelector('#lblNameTrophy')
            let lblDescripcionTrophy = document.querySelector('#lblDescripcionTrophy')
            let lblCategory = document.querySelector('#lblCategory')

            iconTrophyCategory.setAttribute('src', '#trophy' + this.listTrophyAll[positionSelectTrophy].categoria)
            lblNameTrophy.setAttribute('value', this.listTrophyAll[positionSelectTrophy].nombreLogro)
            lblDescripcionTrophy.setAttribute('value', this.listTrophyAll[positionSelectTrophy].descripcion)
            lblCategory.setAttribute('value', 'Categoria:' + this.listTrophyAll[positionSelectTrophy].categoria)

            changeColorTrophy()
        },
        welcomeEfe(){
            $.notification("LOGRO OBTENIDO", 'Sea usted Bienvenido a EFE WORLD', 'img/medalLogro.png');
        }
    },
    created: function (){
        getListTopics();
        getListTrophy();
        //console.log(this.listTrophyAll)
    }
})


function getListTopics() {
    listTopicsRoom = JSON.parse(sessionStorage.getItem('temas'));
    console.log(listTopicsRoom);
    let inicio = 0, final = 0;
    if (listTopicsRoom.length > 4) {
        final = 4;
    }
    else {

        final = listTopicsRoom.length;
    }
    getViewCard(listTopicsRoom, inicio, final);
}

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
                    position="0.37698 0.02339 0" data-position=${i} v-on:Click="dataContainerDetails"
                    proxy-event="event: click; to: a-scene, #containerCardOption, #containerDetails;  as: itemSelect">
                    <a-image id="imgIconCard" src="#${listTopicsRoom[i].idTema}" material="" geometry="height: 0.75; width: 0.75" id="imgMuseo"
                      position="-1.7 0 0.01" data-position=${i} v-on:Click="dataContainerDetails"
                      proxy-event="event: click; to: a-scene, #containerCardOption, #containerDetails;  as: itemSelect"></a-image>
                  </a-text>
                </a-entity>`;
        viewContainerCard.innerHTML += viewCardOption
    }
    contTopic=contTopic+ (final-1);
}


function getListTrophy() {
    
    firebase.database().ref('/Tecnoland/logros').on('value', function (snapshot) {
        if (snapshot.val()) {
            let listTrophy = []
            snapshot.forEach(element => {
                let aux = {
                    nombreLogro: element.val().nombreLogro,
                    descripcion: element.val().descripcion,
                    idTema: element.val().idTema,
                    categoria: element.val().categoria
                }
                listTrophy.push(aux);
            });
            sceneVR.listTrophyAll=listTrophy
            //console.log(sceneVR.listTrophyAll)
            viewListTrophy(listTrophy)
        }
    })
    
}

function viewListTrophy(listaTrofeos){
    let cardsTrophy = document.querySelectorAll('#cardTrophy');
    let cardsTitleTrophy = document.querySelectorAll('#cardTrophyTitle')
    let cardsIconTrophy = document.querySelectorAll('#cardTrophyIcon')
    let btnDetailsTrophy = document.querySelectorAll('#btnDetailsTrophy')
    
    for (let i = 0; i < 4; i++) {
        
        btnDetailsTrophy[i].dataset.position=i;
        cardsTitleTrophy[i].dataset.position=i;

        cardsTitleTrophy[i].setAttribute('value', listaTrofeos[i].nombreLogro)
        
        cardsIconTrophy[i].setAttribute('src', '#'+listaTrofeos[i].idTema)
    }
    console.log('paso por aqui')
    contTrophy=3;
    
}

function nextTrophy(listaTrofeos){
    let cardsTrophy = document.querySelectorAll('#cardTrophy');
    let cardsTitleTrophy = document.querySelectorAll('#cardTrophyTitle')
    let cardsIconTrophy = document.querySelectorAll('#cardTrophyIcon')
    let btnDetailsTrophy = document.querySelectorAll('#btnDetailsTrophy')
    
    let contListCard=0
    while (contListCard < 4) {
        if ((contTrophy + 1) >= listaTrofeos.length) {
            contListCard = 4
        } else {
            contTrophy++;
            cardsTitleTrophy[contListCard].setAttribute('value', listaTrofeos[contTrophy].nombreLogro)
            cardsIconTrophy[contListCard].setAttribute('src', '#' + listaTrofeos[contTrophy].idTema)

            btnDetailsTrophy[contListCard].dataset.position = contTrophy;
            cardsTitleTrophy[contListCard].dataset.position = contTrophy;

            contListCard++;
        }
    }
    changeColorTrophy()
}

function prevTrophy(listaTrofeos){
    let cardsTrophy = document.querySelectorAll('#cardTrophy');
    let cardsTitleTrophy = document.querySelectorAll('#cardTrophyTitle')
    let cardsIconTrophy = document.querySelectorAll('#cardTrophyIcon')
    let btnDetailsTrophy = document.querySelectorAll('#btnDetailsTrophy')

    let contListCard=4;
    
    let pos = contTrophy - 4;
    while (contListCard > 0) {
        if ((contTrophy - 1) < 3) { //Menor que 3 por que son los primeros 4 temas de la listTopicRoom
            contListCard = 0
        } else {
            contListCard--;
            cardsTitleTrophy[contListCard].setAttribute('value', listaTrofeos[pos].nombreLogro)
            cardsIconTrophy[contListCard].setAttribute('src', '#' + listaTrofeos[pos].idTema)
            

            btnDetailsTrophy[contListCard].dataset.position = pos;
            cardsTitleTrophy[contListCard].dataset.position = pos;
            contTrophy--;
            
            pos--;
        }
    }
    changeColorTrophy()
}

function changeColorTrophy(){
    let lblTitulosTrophys = document.querySelectorAll('#cardTrophyTitle');
    lblTitulosTrophys.forEach(element => {
        if (element.dataset.position == positionSelectTrophy) {
            element.setAttribute('color', '#21e828');
        } else {
            element.setAttribute('color', '#fff');
        }
    });
}
