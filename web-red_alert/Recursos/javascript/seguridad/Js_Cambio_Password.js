$(document).on('ready', function () {
    _limpiar_controles();
    _eventos();
       
});

function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('#txt_password_id').val('');
    $('#txt_nuevo_password').val('');
    $('#txt_confirmar_password').val('');
    $('#txt_actual_password').val('');
    //_validation_sumary(null);
    _clear_all_class_error();
}

function _eventos() {
    try {
        $('#btn_guardar').click(function (e) {
            var pass1 = $('#txt_nuevo_password').val();
            var pass2 = $('#txt_confirmar_password').val();
            var pass_actual = $('#txt_actual_password').val();
            var validacion = _validacion();
            if (validacion.Estatus != false) {
                if (_validar_password(pass_actual, pass1, pass2)) {
                    if (!_guardar_datos())
                        _mostrar_mensaje("Validation", "Error changing password");
                    else
                        _mostrar_mensaje("Validation", "Successful password change.");

                }
            } else {
                _mostrar_mensaje("Validation", validacion.Mensaje);
            }
        });

        $('#btn_cancelar').on('click', function (e) {
            e.preventDefault(); window.location.href = '../Paginas_Generales/Frm_Apl_Principal.aspx';
        });

        $('input[type=password]').each(function (index, element) {
            $(this).on('focus', function () {
                _remove_class_error('#' + $(this).attr('id'));
            });
        });

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}


function _guardar_datos() {
    
    var password = null;
    var isComplete = false;

    try {

        password = new Object();

        password.Password = $('#txt_nuevo_password').val();
        password.Password_Actual = $('#txt_actual_password').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(password) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Cambio_Password_Controller.asmx/Modificar',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var Resultado = JSON.parse(result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        isComplete = true;
                        _limpiar_controles();
                    } else if (Resultado.Estatus == 'error') {
                        //_validation_sumary(Resultado);
                    }
                } else {
                    //_validation_sumary(Resultado);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
   
}

function _validar_pass_anterior() {
    var password = null;
    var isComplete = false;

    try {

        password = new Object();

        password.Password = $('#txt_nuevo_password').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(password) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Cambio_Password_Controller.asmx/validar_pass',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var Resultado = JSON.parse(result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        isComplete = true;
                    } else if (Resultado.Estatus == 'error') {
                        //_validation_sumary(Resultado);
                    }
                } else {
                    //_validation_sumary(Resultado);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
}

function _validar_pass_actual() {
    var password = null;
    var isComplete = false;

    try {

        password = new Object();

        password.Password = $('#txt_actual_password').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(password) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Cambio_Password_Controller.asmx/validar_pass_actual',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var Resultado = JSON.parse(result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        isComplete = true;
                    } else if (Resultado.Estatus == 'error') {
                        isComplete = false;
                    }
                } else {
                    isComplete = false;
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
}

function _validacion() {
    var _output = new Object();

    _output.Estatus = true;
    _output.Mensaje = '';

    if (!$('#txt_actual_password').parsley().isValid()) {
        _add_class_error('#txt_actual_password');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The current password is a required data.<br />';
    }


    if (!$('#txt_nuevo_password').parsley().isValid()) {
        _add_class_error('#txt_nuevo_password');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The new password is a required data.<br />';
    }

    if (!$('#txt_confirmar_password').parsley().isValid()) {
        _add_class_error('#txt_confirmar_password');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Confirmation of password is required.<br />';
    }

    return _output;
}

function _mostrar_mensaje(Titulo, Mensaje) {
    bootbox.dialog({
        message: Mensaje,
        title: Titulo,
        locale: 'en',
        closeButton: true,
        buttons: [{
            label: 'Cerrar',
            className: 'btn-default',
            callback: function () { }
        }]
    });
}

function _validar_password(pass_actual, pass1, pass2) {
    var espacios = false;
    var cont = 0;

    while (!espacios && (cont < pass1.length)) {
        if (pass1.charAt(cont) == " ")
            espacios = true;
        cont++;
    }

    if (espacios) {
        _mostrar_mensaje("Validation", "Password can not contain spaces");
        return false;
    }

    if (pass1.length == 0 || pass2.length == 0 || pass_actual.length == 0) {
        _mostrar_mensaje("Validation", "Password fields can not be empty");
        return false;
    }
    //if (pass1.length < 8 || pass2.length < 8) {
    //    _mostrar_mensaje("Validación", "Minimo 8 caracteres");
    //    return false;
    //}

    //re = /[0-9]/;
    //if (!re.test(pass1)) {
    //    _mostrar_mensaje("Validación", "Contraseña debe tener al menos un numero (0-9)");
    //    pass1.focus();
    //    return false;
    //}

    //re = /[a-z]/;
    //if (!re.test(pass1)) {
    //    _mostrar_mensaje("Validación", "Contraseña debe tener al menos una letra minuscula (a-z)!");
    //    pass1.focus();
    //    return false;
    //}

    //re = /[A-Z]/;
    //if (!re.test(pass1)) {
    //    _mostrar_mensaje("Validación", "Error: Contraseña debe tener al menos una letra mayuscula (A-Z)!");
    //    pass1.focus();
    //    return false;
    //}

    if (!_validar_pass_actual()) {
        _mostrar_mensaje("Validation", "Current password does not match");
        return false;
    }

    if (pass1 != pass2) {
        _mostrar_mensaje("Validation", "Passwords do not match");
        return false;
    } else if (pass_actual == pass1) {
        _mostrar_mensaje("Validation", "The new password can not be the same as the current password");
        return false;
    }
    else if (!_validar_pass_anterior()) {
        _mostrar_mensaje("Validation", "The new password has already been used previously");
        return false;
    } else {
        return true;
    }
}

function _add_class_error(selector) {
    $(selector).addClass('alert-danger');
}

function _remove_class_error(selector) {
    $(selector).removeClass('alert-danger');
}

function _clear_all_class_error() {
    $('input[type=text]').each(function (index, element) {
        _remove_class_error('#' + $(this).attr('id'));
    });
}

