/**@author Douglas Alexander Hernandez Flores 
 * @param listTopicsRoom {Contiene el listado completo de los temas}
 * @param listTrophyAll {Contiene el listado completo de los logros}
 * @param contTopic {Contiene la posicion del scroll de los temas, avanza de 4 en 4}
 * @param positionSelect {Contiene la posicion seleccionada cuando se ve los detalles del tema}
 * @param positionSelectTrophy {Contiene la posicion del logro seleccionado para ver detalles}
 * @param contTrophy {Contiene la posicion del scroll de los logros, avanza de 4 en 4}
*/

var sceneVR = new Vue({
    el: '#sceneVR',
    data:{
        listTopicsRoom: [],
        listTrophyAll: [],
        dataItem: 0,
        contTopic: 0,
        positionSelect: -1,
        positionSelectTrophy: -1,
        contTrophy: 0
    },
    methods:{
        /**@function dataContainerDetails {Function que carga los detalles del tema seleccionado} 
         * @param item {Obtiene la etiqueta completa del contenedor del tema}
         * @param dataItem {Obtiene los datos especificos del tema seleccionado}
         * @param titulo {Obtiene el item del titulo para mostra los detalles}
         * @param descripcion {Obtiene el hijo apartir del titulo, ya que esa etiqueta esta dentro de la etiqueta que tiene el titulo}
        */
        dataContainerDetails: function(item){
            this.positionSelect = item.srcElement.dataset.position;
            dataItem=listTopicsRoom[this.positionSelect]

            let titulo = document.querySelector('#lblTituloItem')
            let descripcion=titulo.lastChild

            titulo.setAttribute('value',dataItem.tema)
            descripcion.setAttribute('value',dataItem.descripcion)

            changeColorSelect();
        },
        /**@function nextTopics {Function que hace de un scroll para ver todos los temas, avanza de 4 en 4} 
        */
        nextTopics: function(){
            let listCardOptions = document.querySelectorAll('#cardOption')
            let lblTitulosCard = document.querySelectorAll('#lblTituloCard');
            let imgCard = document.querySelectorAll('#imgIconCard');
            let contListCard=0; //Contador que se encarga de recorrer las 4 tarjetas que muestran los temas
            
            while (contListCard < 4) {
                /**Condicion que verifica si hay aun temas que mostrar de la lista sigue avanzando el while
                 * sino termina el while y sale
                 */
                if ((this.contTopic + 1) >= listTopicsRoom.length) {
                    contListCard = 4
                }else{
                    this.contTopic++;
                    lblTitulosCard[contListCard].setAttribute('value', listTopicsRoom[this.contTopic].tema)
                    imgCard[contListCard].setAttribute('src', '#' + listTopicsRoom[this.contTopic].idTema)
                    /**El Position es la posicion que tiene en el array el tema, se usa para identificarlo cuando se selecciona */
                    listCardOptions[contListCard].dataset.position = this.contTopic;
                    lblTitulosCard[contListCard].dataset.position = this.contTopic;
                    imgCard[contListCard].dataset.position = this.contTopic;
                    
                    contListCard++;
                } 
            }
            changeColorSelect()
        },
        testeo: function(){
            console.log('ESTOY EN MENU')
        },
        /**@function prevTopics {Function que hace retroceder los temas simulando un scroll, Avanza de 4 en 4} */
        prevTopics: function(){
            let listCardOptions = document.querySelectorAll('#cardOption')
            let lblTitulosCard = document.querySelectorAll('#lblTituloCard');
            let imgCard = document.querySelectorAll('#imgIconCard');
            let contListCard = 0; //Variable que recorre los array de las CARDS
            let pos = this.contTopic-4; //Variable que determina la posicion del array listTopicRoom
            
            while (contListCard < 4) {
                if((this.contTopic-1)<3){  //Menor que 3 por que son los primeros 4 temas de la listTopicRoom
                    contListCard=4
                }else{
                    lblTitulosCard[contListCard].setAttribute('value', listTopicsRoom[pos].tema)
                    imgCard[contListCard].setAttribute('src', '#' + listTopicsRoom[pos].idTema)
                    lblTitulosCard[contListCard].setAttribute('value', listTopicsRoom[pos].tema)
                    imgCard[contListCard].setAttribute('src', '#' + listTopicsRoom[pos].idTema)

                    listCardOptions[contListCard].dataset.position = pos;
                    lblTitulosCard[contListCard].dataset.position = pos;
                    imgCard[contListCard].dataset.position = pos;
                    this.contTopic--;
                    contListCard++;
                    pos--;
                }
            }
            changeColorSelect()
            
        },
        /**@function validateNumTopics {Funtion que si hay menos de 4 temas en la sala para mostrar, hace invisible las flechas del scroll} */
        validateNumTopics: function(){
            if(listTopicsRoom.length<=4){
                let arrow = document.getElementById('imgNext')

                arrow.setAttribute('visible', 'false')
                arrow = document.getElementById('imgPrev')
                arrow.setAttribute('visible', 'false')
            }
        },
        /**@function backTopics {Function que deselecciona el tema y regresa a la vista donde puede escoger ir al mundo o salir de la VR} */
        backTopics(){
            this.positionSelect = -1;
            changeColorSelect()
        },
        exitVR(){
            window.location='../../vistas/sala-study.html'
        },
        /**@function nextTrophy {Funcion que recorre los logros simulando un scroll} */
        nextTrophy(){
            nextTrophy(this.listTrophyAll);
        },
        /**@function prevTrophy {Funcion que recorre los logros hacia atras, simulando un scroll} */
        prevTrophy(){
            prevTrophy(this.listTrophyAll)
        },
        /**@function dataDetailsTrophy {Funcion que muestra los detalles del logro seleccionado} */
        dataDetailsTrophy(item){
            this.positionSelectTrophy = item.srcElement.dataset.position;
            dataItem = this.listTrophyAll[this.positionSelectTrophy]
            
            let iconTrophyCategory = document.querySelector('#trophyIconCategory')
            let lblNameTrophy = document.querySelector('#lblNameTrophy')
            let lblDescripcionTrophy = document.querySelector('#lblDescripcionTrophy')
            let lblCategory = document.querySelector('#lblCategory')

            iconTrophyCategory.setAttribute('src', '#trophy' + this.listTrophyAll[this.positionSelectTrophy].categoria)
            lblNameTrophy.setAttribute('value', this.listTrophyAll[this.positionSelectTrophy].nombreLogro)
            lblDescripcionTrophy.setAttribute('value', this.listTrophyAll[this.positionSelectTrophy].descripcion)
            lblCategory.setAttribute('value', 'Categoria:' + this.listTrophyAll[this.positionSelectTrophy].categoria)

            changeColorTrophy()
        },
        /**@function welcomeEfe {Salta una notificacion de logro desbloqueado} */
        welcomeEfe(){
            $.notification("LOGRO DESBLOQUEADO", 'Sea usted Bienvenido a EFE WORLD', 'img/medalLogro.png');
        },
        goMenu(){
            //console.log('Vamos al Menu')
            let camera = document.querySelector('#cameraUser')
            //console.log(camera.getAttribute('position'))
            camera.setAttribute('position', {
                x: 0,
                y: 0,
                z: -4
            });
        },
        goTrophy(){
            let camera = document.querySelector('#cameraUser')
            //console.log('Vamos a los logros')
            camera.setAttribute('position', {
                x: -3.5,
                y: 0,
                z: -4
            });
        }
    },
    created: function (){
        this.contTopic = getListTopics();
        getListTrophy(); 
    }
})

/**@function getListTopics {Obtiene los temas de la sala desde el session Storage} */
function getListTopics() {
    listTopicsRoom = JSON.parse(sessionStorage.getItem('temas'));
    let inicio = 0, final = 0;

    if (listTopicsRoom.length > 4) {
        final = 4;
    }
    else {
        final = listTopicsRoom.length;
    }
    let cont = getViewCard(listTopicsRoom, inicio, final);
    return cont;
}

/**@function changeColorSelect {Cambia de color el titulo del tema seleccionado} */
function changeColorSelect() {
    let lblTitulos = document.querySelectorAll('#lblTituloCard');

    lblTitulos.forEach(element => {
        if (element.dataset.position == sceneVR.positionSelect) {
            element.setAttribute('color', '#21e828');
        }
        else {
            element.setAttribute('color', '#fff');
        }
    });
}

/**@function getViewCard {Carga los primeros 4 temas de la sala en las tarjetas} */
function getViewCard(listTopicsRoom, inicio, final){
    let viewContainerCard= document.querySelector('#containerCardOption');
    viewContainerCard.innerHTML="";

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
    return (final-1);
}

/**@function getListTrophy {Funcion que obtiene de Firebase todos los logros de nuestra plataforma} */
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
            
            viewListTrophy(listTrophy)
        }
    })
    
}

/**@function viewListTrophy {Muestra los primeros 4 logros de la lista en las 4 tarjetas que contienen los logros} */
function viewListTrophy(listaTrofeos){
    let cardsTitleTrophy = document.querySelectorAll('#cardTrophyTitle')
    let cardsIconTrophy = document.querySelectorAll('#cardTrophyIcon')
    let btnDetailsTrophy = document.querySelectorAll('#btnDetailsTrophy')
    
    for (let i = 0; i < 4; i++) {
        btnDetailsTrophy[i].dataset.position=i;
        cardsTitleTrophy[i].dataset.position=i;

        cardsTitleTrophy[i].setAttribute('value', listaTrofeos[i].nombreLogro)
        cardsIconTrophy[i].setAttribute('src', '#'+listaTrofeos[i].idTema)
    }
    sceneVR.contTrophy = 3;
}

/**
 * @function nextTrophy {Funcion que recorre los logros simulando un scroll}
 * @param {Array que contiene todos los logros de la plataforma} listaTrofeos 
 */
function nextTrophy(listaTrofeos){
    let cardsTitleTrophy = document.querySelectorAll('#cardTrophyTitle')
    let cardsIconTrophy = document.querySelectorAll('#cardTrophyIcon')
    let btnDetailsTrophy = document.querySelectorAll('#btnDetailsTrophy')
    let contListCard=0
    
    while (contListCard < 4) {
        if ((sceneVR.contTrophy + 1) >= listaTrofeos.length) {
            contListCard = 4
        } else {
            sceneVR.contTrophy++;
            cardsTitleTrophy[contListCard].setAttribute('value', listaTrofeos[sceneVR.contTrophy].nombreLogro)
            cardsIconTrophy[contListCard].setAttribute('src', '#' + listaTrofeos[sceneVR.contTrophy].idTema)

            btnDetailsTrophy[contListCard].dataset.position = sceneVR.contTrophy;
            cardsTitleTrophy[contListCard].dataset.position = sceneVR.contTrophy;

            contListCard++;
        }
    }
    changeColorTrophy()
}

function prevTrophy(listaTrofeos){
    let cardsTitleTrophy = document.querySelectorAll('#cardTrophyTitle')
    let cardsIconTrophy = document.querySelectorAll('#cardTrophyIcon')
    let btnDetailsTrophy = document.querySelectorAll('#btnDetailsTrophy')
    let contListCard=4;
    
    let pos = sceneVR.contTrophy - 4;
    while (contListCard > 0) {
        if ((sceneVR.contTrophy - 1) < 3) { //Menor que 3 por que son los primeros 4 temas de la listTopicRoom
            contListCard = 0
        } else {
            contListCard--;
            cardsTitleTrophy[contListCard].setAttribute('value', listaTrofeos[pos].nombreLogro)
            cardsIconTrophy[contListCard].setAttribute('src', '#' + listaTrofeos[pos].idTema)

            btnDetailsTrophy[contListCard].dataset.position = pos;
            cardsTitleTrophy[contListCard].dataset.position = pos;
            sceneVR.contTrophy--;
            pos--;
        }
    }
    changeColorTrophy()
}

/**@function changeColorTrophy {Funcion que cambia de color del titulo del logro seleccionado } */
function changeColorTrophy(){
    let lblTitulosTrophys = document.querySelectorAll('#cardTrophyTitle');

    lblTitulosTrophys.forEach(element => {
        if (element.dataset.position == sceneVR.positionSelectTrophy) {
            element.setAttribute('color', '#21e828');
        } else {
            element.setAttribute('color', '#fff');
        }
    });
}

function fuseTeleport(){
    console.log('FUSING FUNCIONA')
    //
}