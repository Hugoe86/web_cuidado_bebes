
$(document).on('ready', function () {

    $('#username').val('admin');
    $('#passwd').val('1');

    jQuery.validator.setDefaults({
        debug: true,
        success: "valid"
    });
        
    $("form#login").validate({
        
        submitHandler: function (form) {

            var opts = {
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-top-full-width",
                "onclick": null,
                "showDuration": "1000",
                "hideDuration": "1500",
                "timeOut": "7500",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            };

                if ($('#username').val() == "") {
                    toastr.error("Por favor, ingrese su nombre de usuario", 'Información', opts);
                    return;
                }
                if ($('#passwd').val() == "") {
                    toastr.error("Por favor, ingrese la contraseña", 'Información', opts);
                    return;
                }
                var $parametros = new Object();
                $parametros.Usuario = $(form).find('#username').val();
                $parametros.Password = $(form).find('#passwd').val();

                var $data = JSON.stringify({ 'jsonObject': JSON.stringify($parametros) });

                show_loading_bar({
                    wait: 0,
                    delay: 0.5,
                    pct: 100,
                    finish: function () {
                        $.ajax({
                            url: 'controllers/Autentificacion_Controller.asmx/autentificacion',
                            data: $data,
                            type: 'POST',
                            cache: false,
                            async: false,
                            contentType: 'application/json; charset=UTF-8',
                            dataType: 'json',
                            success: function (resul) {
                                var $resultado = JSON.parse(resul.d);

                                if ($resultado.Estatus === 'success') {
                                    if ($("#remember").is(':checked')) {
                                        var username = $(form).find('#username').val();
                                        var password = $(form).find('#passwd').val();
                                        // set cookies to expire in 14 days
                                        $.cookie('username', username, { expires: 14 });
                                        $.cookie('password', password, { expires: 14 });
                                        $.cookie('remember', true, { expires: 14 });
                                    } else {
                                        // reset cookies
                                        $.cookie('username', null);
                                        $.cookie('password', null);
                                        $.cookie('remember', null);
                                    }
                                    hide_loading_bar();
                                    window.location.href = '../Paginas_Generales/Frm_Apl_Principal.aspx';
                                } else {
                                    hide_loading_bar();
                                    toastr.error("Verifique su nombre de usuario y contraseña, por favor intente de nuevo.", "¡Acceso incorrecto!", opts);
                                    $(form).find('#passwd').val('');
                                    $(form).find('#passwd').focus();
                                }
                            }
                        });
                    }
                });
        }

    });
    $("form#login .form-group:has(.form-control):first .form-control").focus();
    $('#btn_enviar_email').on('click', function (e) {
        e.preventDefault();
        _send_email();
    });
    setTimeout(function () { $(".fade-in-effect").addClass('in'); }, 1);

    //Validar el tipo de usuario

});
function _send_email() {
    var Usuario = null;

    show_loading_bar({
        pct: 78,
        wait: .5,
        delay: .5,
        finish: function (pct) {

            Usuario = new Object();
            Usuario.Email = $('#emailInput').val();

            var $_data = JSON.stringify({ 'jsonObject': JSON.stringify(Usuario) });

            $.ajax({
                type: 'POST',
                url: 'controllers/Autentificacion_Controller.asmx/recuperar_password',
                data: $_data,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                cache: false,
                success: function (result) {
                    var $_datos = JSON.parse(result.d);

                    if ($_datos !== null && $_datos !== undefined) {
                        if ($_datos.Estatus === 'success') {
                            hide_loading_bar();
                            $('#emailInput').val('');
                            _mostrar_mensaje($_datos.Titulo, $_datos.Mensaje);
                        } else {
                            _mostrar_mensaje('Información', 'Problemas para cambiar tu contraseña.');
                        }
                    } else {
                        _mostrar_mensaje('Información', 'Problemas para cambiar tu contraseña.');
                    }
                }
            });
        }
    });
}
function _mostrar_mensaje(Titulo, Mensaje) {
    bootbox.dialog({
        message: Mensaje,
        title: Titulo,
        locale: 'en',
        closeButton: true,
        buttons: [{
            label: 'Cerrar',
            className: 'btn-primary',
            callback: function () { }
        }]
    });
}

