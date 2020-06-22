if (!window.Notification) {
    window.Notification = (() => window.Notification || window.webkitNotication || window.mozNotification || window.oNotification || window.msNotification)()
}

switch (window.Notification.permission) {
    case 'default':
        window.Notification.requestPermission((permission) => {
            console.log("Permiso: ", permission);
        });
        break;
    case 'granted':
        console.log("El FBI TE VIGILA PRRO");
        break;
    case 'denied':
        console.log('aaaa prro, dame permisos');
        break;
}
(($) => {
    if (!window.Notification) {
        alert("Este navegador es incompatible con las notificaciones ");
        return;
    }


    $.notification = (titulo, msg, image) => {
        var notification = new Notification(titulo, {
            body: msg,
            icon: image,
            iconUrl: image
        });
        return notification;
    }
})(jQuery);