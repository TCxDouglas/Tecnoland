
let auxiliar="";
function init() {
    $("[class*='mostrar']").click(function (e) {
        let modulo = $(this).data("modulo"),
            form = $(this).data("form");
        
        if(auxiliar==modulo){

        }else{
            $(`#vista-chat`).html("");
            $(`#vista-configSala`).html("");
            $(`#vista-${form}`).load(`${modulo}.html`)
            auxiliar=modulo;

            if (auxiliar == "configSala"){
                if(sessionStorage.getItem('validar')==1){
                    sessionStorage.setItem('validar',2);
                }else{
                    sessionStorage.setItem('validar', 1)
                }
            }
        }
        
       
    });
}
init();