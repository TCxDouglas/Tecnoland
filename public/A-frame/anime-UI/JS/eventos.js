AFRAME.registerComponent('cursor-listener',{
    init: function(){
        this.el.addEventListener('click', function(e){
            let containerBtn = document.querySelector('#conteinerbtn');
            let menu = document.querySelector('#contentMenu');
            menu.setAttribute('visible',true);
            containerBtn.setAttribute('visible',false);
        });
    }
});