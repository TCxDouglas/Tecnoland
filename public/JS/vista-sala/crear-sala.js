document.addEventListener('DOMContentLoaded',e=>{

    crearSala();
})

function crearSala() {
    let tbodyTema = document.getElementById('tbodyTemas');
    //let valor = document.getElementById('txtBuscar').value;

    let valor="";
    fetch(`../../private/PHP/Temas/temas.php?proceso=buscarTemas&valor=${valor}`).then(resp => resp.json()).then(resp => {
        console.log(resp);

        resp.forEach(element => {
            let fila = `<tr>
                <td>` + element.tema + ` </td>
                <td>` + element.descripcion + ` </td>
            </tr>`
            tbodyTema.innerHTML+=fila;
        });
    });
    
}