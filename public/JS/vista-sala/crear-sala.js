document.addEventListener('DOMContentLoaded',e=>{

    crearSala();
})

function crearSala() {
    //let tbodyTema = document.getElementById('tbodyTema');
    //let valor = document.getElementById('txtBuscar').value;

    let valor="";
    fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${valor}`).then(resp => resp.text()).then(resp => {
        console.log(resp);
        
    });
    
}