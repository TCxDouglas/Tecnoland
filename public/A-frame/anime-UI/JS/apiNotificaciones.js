/**
 * @author Douglas Alexander Hernandez Flores
 */

 /**Condicion que verifica que el navegador tenga la funciones de notificaciones disponibles */
if (!window.Notification) {
    window.Notification = (() => window.Notification || window.webkitNotication || window.mozNotification || window.oNotification || window.msNotification)()
}

/**Switch que se encarga de verificar si tenemos permisos de enviar notificaciones */
switch (window.Notification.permission) {
    case 'default':
        /**Preguntamos si nos da permiso el usuario de enviarle notificaciones */
        window.Notification.requestPermission((permission) => {
            console.log("Permiso: ", permission);
        });
        break;
    case 'granted':
        console.log("Permiso concedido");
        break;
    case 'denied':
        console.log('Permisos denegados');
        break;
}
(($) => { 
    /**Si no tiene las notificaciones disponibles en el navegador, le solicitamos que actualize su navegador o use otro */
    if (!window.Notification) {
        alert("Por favor actualizate o pasata a chrome, Notificaciones NO soportadas");
        return;
    }

    /**
     * @param {Recibe el titulo de la notificacion} titulo 
     * @param {Recibe el mensaje que mostrara la notificacion} msg 
     * @param {Recibe una imagen ya sea un recurso o una URL que mostrar la notificacion} image 
     */
    $.notification = (titulo, msg, image) => {
        var notification = new Notification(titulo, {
            body: msg,
            icon: image,
            iconUrl: image
        });
        return notification;
    }
})(jQuery);