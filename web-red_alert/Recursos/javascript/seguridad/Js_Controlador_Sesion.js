$(document).on('ready', function () {
    $.sessionTimeout({
        keepAliveUrl: '../../KeepSessionAlive.ashx',
        keepAlive: true,
        keepAliveInterval: 600000,//(10 seconds)
        warnAfter: 3300000,//Aviso a los 55 minutos de que la sesión esta por terminar (milliseconds ).
        redirAfter: 3600000,//Aviso a los 60 minutos que la sesión ha caducado (milliseconds ).
        onWarn: function () {
            _mostrar_mensaje('<i class="fa fa-exclamation-triangle"></i>&nbsp;Información', 'Su sesión está a punto de caducar');
        },
        onRedir: function () {
            $.ajax({
                url: '../../Paginas/Paginas_Generales/controllers/Autentificacion_Controller.asmx/cerrar_sesion',
                type: 'POST',
                cache: false,
                async: false,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    bootbox.dialog({
                        message: 'Su sesión ha caducado',
                        title: '<i class="fa fa-exclamation-triangle"></i>&nbsp;Información',
                        locale: 'es',
                        closeButton: false,
                        buttons: [{
                            label: 'Cerrar',
                            className: 'btn-default',
                            callback: function () { window.location.href = "../Paginas_Generales/Frm_Apl_Login.html"; }
                        }]
                    });
                }
            });
        }
    });
});

function _mostrar_mensaje(Titulo, Mensaje) {
    bootbox.dialog({
        message: Mensaje,
        title: Titulo,
        locale: 'en',
        closeButton: false,
        buttons: [{
            label: 'Cerrar',
            className: 'btn-default',
            callback: function () { }
        }]
    });
}

