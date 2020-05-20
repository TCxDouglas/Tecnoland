function init() {
    $("[class*='mostrar']").click(function (e) {
        let modulo = $(this).data("modulo"),
            form = $(this).data("form");

        $(`#vista-chat`).html(""); 
        $(`#vista-configSala`).html(""); 
        
        $(`#vista-${form}`).load(`${modulo}.html`, function () {
            $(`#btn-close-${form}`).click(() => {
                $(`#vista-${form}`).html("");
            });
            init();
        });
       
    });
}
init();