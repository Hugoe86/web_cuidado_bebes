var closeModal = true;
var estatusActivo = '';

$(document).on('ready', function () {
    _inicializar_pagina();
});

function _inicializar_pagina() {
    try {
        _filtroEstatus();
        _habilitar_controles('Inicio');
        _limpiar_controles();
        _cargar_tabla();        
        _modal();
        _load_estatus();
        _load_tipo_usuario();
        _load_rol();
        _eventos_textbox();
        _eventos();
        _enter_keypress_modal();
        _set_location_toolbar();
        _search();

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _estado_inicial() {
    try {
        _habilitar_controles('Inicio');
        _limpiar_controles();
        $('#tbl_usuarios').bootstrapTable('refresh', 'controllers/Usuarios_Controller.asmx/Consultar_Usuarios_Por_Filtros');
        _set_location_toolbar();
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _habilitar_controles(opcion) {
    var Estatus = false;

    switch (opcion) {
        case "Nuevo":
            Estatus = true;
            $('#cmb_estatus').val(2);
            $('#cmb_estatus').attr({ disabled: Estatus });           
            break;
        case "Modificar":
            Estatus = true;
            $('#cmb_estatus').attr({ disabled: !Estatus });
            break;
        case "Inicio":
            break;
    }


    $('#txt_usuario').attr({ disabled: !Estatus });
    $('#txt_login').attr({ disabled: !Estatus });
    $('#txt_password').attr({ disabled: !Estatus });
    $('#txt_email').attr({ disabled: !Estatus });
    $('#cmb_tipo_usuario').attr({ disabled: !Estatus })
    $('#cmb_rol').attr({ disabled: !Estatus });

}

function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(estatusActivo); });
    $('#cmb_estatusfiltro').val('');
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_password').val('');
    $('#txt_usuario_id').val('');
    $('#txt_rel_id').val('');
    $('#cmb_rol').val('');
    $('#cmb_tipo_usuario').val('');
    $('#txt_login').val('');
    
    _validation_sumary(null);
    _clear_all_class_error();
}

function _eventos() {
    try {
        $('#modal_datos').on('hidden.bs.modal', function () {
            if (!closeModal)
                $(this).modal('show');
        });
        $('#btn_nuevo').click(function (e) {
            _limpiar_controles();
            _habilitar_controles('Nuevo');
            _launch_modal('<i class="fa fa-floppy-o" style="font-size: 25px;"></i>&nbsp;&nbsp;Datos a insertar');
        });
        $('.cancelar').each(function (index, element) {
            $(this).on('click', function (e) {
                e.preventDefault();
                _estado_inicial();
            });
        });
        $('#btn_salir').on('click', function (e) { e.preventDefault(); window.location.href = '../Paginas_Generales/Frm_Apl_Principal.aspx'; });
        $('#btn_busqueda').on('click', function (e) {
            e.preventDefault();
            _search();
        });
        $('#modal_datos input[type=text]').each(function (index, element) {
            $(this).on('focus', function () {
                _remove_class_error('#' + $(this).attr('id'));
            });
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _eventos_textbox() {
    /*$('#txt_usuario').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });*/
    $('#txt_login').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });

    $('#txt_email').on('blur', function () {
        $(this).val(this.value.match(/^(([\w-]+\.)+[\w-]+|([a-zA-Z]{1}|[\w-]{2,}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|([a-zA-Z]+[\w-]+\.)+[a-zA-Z]{2,4})$/) ? $(this).val() : _add_class_error('#txt_email'));
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
            className: 'btn-default',
            callback: function () { }
        }]
    });
}

function _cargar_tabla() {

    try {
        $('#tbl_usuarios').bootstrapTable('destroy');
        $('#tbl_usuarios').bootstrapTable({
            cache: false,
            width: 900,
            height: 400,
            striped: true,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            search: true,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            clickToSelect: true,
            columns: [
                { field: 'Usuario_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Usuario', title: 'Usuario', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Password', title: 'Password', width: 100, align: 'left', valign: 'bottom', sortable: true, visible: false },
                { field: 'Rol_ID', title: 'Rol_ID', width: 100, align: 'letf', valign: 'bottom', sortable: true, visible: false },
                { field: 'Email', title: 'Email', width: 200, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Empresa_ID', title: '', width: 200, align: 'left', valign: 'bottom', sortable: true, visible: false },
                { field: 'Estatus_ID', title: '', width: 200, align: 'left', valign: 'bottom', sortable: true, visible: false },
                { field: 'Tipo_Usuario_ID', title: '', width: 200, align: 'left', valign: 'bottom', sortable: true, visible: false },
                { field: 'Rel_Usuarios_Rol_ID', title: '',  width: 200, align: 'left', valign: 'bottom', sortable: true, visible: false},
                {
                    field: 'Usuario_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Usuario_ID + '" href="javascript:void(0)" data-usuario=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Usuario_ID + '" href="javascript:void(0)" data-usuario=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _alta_usuarios() {
    var usuarios = null;
    var rol = null;
    var isComplete = false;

    try {

        usuarios = new Object();

        usuarios.Usuario = $('#txt_usuario').val();
        usuarios.Estatus_ID = parseInt($('#cmb_estatus').val());
        usuarios.Tipo_Usuario_ID = parseInt($('#cmb_tipo_usuario').val());
        usuarios.Password = $('#txt_password').val();
        usuarios.Email = $('#txt_email').val();
        usuarios.Rol_ID = parseInt($('#cmb_rol').val());
        usuarios.Usuario_login = $('#txt_login').val();
        

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(usuarios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/Alta',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var Resultado = JSON.parse(result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        _search();
                        isComplete = true;
                    } else if (Resultado.Estatus == 'error') {
                        _validation_sumary(Resultado);
                    }
                } else {
                    _validation_sumary(Resultado);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
}

function _modificar_usuarios() {
    var usuarios = null;
  
    var isComplete = false;

    try {
        usuarios = new Object();
        usuarios.Usuario_ID = parseInt($('#txt_usuario_id').val());
        usuarios.Rel_Usuarios_Rol_ID = parseInt($('#txt_rel_id').val());
        usuarios.Usuario = $('#txt_usuario').val();
        usuarios.Password = $('#txt_password').val();
        usuarios.Email = $('#txt_email').val();
        usuarios.Estatus_ID = parseInt($('#cmb_estatus').val());
        usuarios.Tipo_Usuario_ID = parseInt($('#cmb_tipo_usuario').val());
        usuarios.Rol_ID = parseInt($('#cmb_rol').val());
        usuarios.Usuario_login = $('#txt_login').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(usuarios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/Actualizar',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var Resultado = JSON.parse(result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        _search();
                        isComplete = true;
                    } else if (Resultado.Estatus == 'error') {
                        _validation_sumary(Resultado);
                    }
                } else {
                    _validation_sumary(Resultado);
                }
            }
        });

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
}

function _eliminar_usuarios(usuario_id) {
    var usuarios = null;
  

    try {
        usuarios = new Object();
        usuarios.Usuario_ID = parseInt(usuario_id);
        usuarios.Rel_Usuarios_Rol_ID = parseInt(usuario_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(usuarios) });


        $.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/Eliminar',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                var Resultado = JSON.parse(result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        _search();
                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje); }
            }
        });

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _modal() {
    var tags = '';
    try {
        tags += '<div class="modal fade" id="modal_datos" name="modal_datos" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">';
        tags += '<div class="modal-dialog modal-lg">';
        tags += '<div class="modal-content">';

        tags += '<div class="modal-header">';
        tags += '<button type="button" class="close cancelar" data-dismiss="modal" aria-label="Close" onclick="_set_close_modal(true);"><i class="fa fa-times"></i></button>';
        tags += '<h4 class="modal-title" id="myModalLabel">';
        tags += '<label id="lbl_titulo"></label>';
        tags += '</h4>';
        tags += '</div>';

        tags += '<div class="modal-body">';

        tags += '<div class="row">' +
            ' <div class="col-md-6" >' +
            '            <label class="fuente_lbl_controles">(*) Nombre</label>' +
            '        <input type="text" id="txt_usuario" name="txt_usuario" class="form-control input-sm" disabled="disabled" placeholder="Nombre" data-parsley-required="true" maxlength="50" required /> ' +
            '        <input type="hidden" id="txt_usuario_id"/>' +
            '        <input type="hidden" id="txt_rel_id"/>' +
            '    </div>' +
            ' <div class="col-md-6">' +
            '    </div>' +
            '</div>' +
            '<div class="row">' +
            ' <div class="col-md-6">' +
            '            <label class="fuente_lbl_controles">(*) Usuario</label>' +
            '        <input type="text" id="txt_login" name="txt_login" class="form-control input-sm" disabled="disabled" placeholder="Usuario" data-parsley-required="true" maxlength="100" required /> ' +
            '    </div>' +
            '    <div class="col-sm-6">' +
            '         <label class="fuente_lbl_controles">(*) Password</label>' +
            '        <input type="password" id="txt_password" name="txt_password" class="form-control input-sm" disabled="disabled" placeholder="Password" data-parsley-required="true" maxlength="100" required /> ' +
            '    </div>' +
            '</div>' +
            '<div class="row">' +
            ' <div class="col-md-6">' +
            '            <label class="fuente_lbl_controles">(*) Email</label>' +
            '        <input type="text" id="txt_email" name="txt_email" class="form-control input-sm" disabled="disabled" placeholder="Email" data-parsley-required="true" maxlength="100" onkeypress="return _validar_caracteres_email(event);" required /> ' +
            '    </div>' +
            '    <div class="col-sm-6">' +
            '      <label class="fuente_lbl_controles">(*) Tipo de usuario</label>' +
            '    <select id="cmb_tipo_usuario" name="cmb_tipo_usuario" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required ></select> ' +
            '    </div>' +
            '</div>' +

            '<div class="row">' +
            '    <div class="col-sm-6">' +
            '      <label class="fuente_lbl_controles">(*) Estatus</label>' +
            '       <select id="cmb_estatus" name="cmb_estatus" class="form-control input-sm"  data-parsley-required="true" required ></select> ' +
            '    </div>' +
            '    <div class="col-sm-6">' +
            '       <label class="fuente_lbl_controles">(*) Rol</label>' +
            '       <select id="cmb_rol" name="cmb_rol" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required ></select> ' +
            '    </div>' +
            '</div>';

        tags += '</div>';

        tags += '<div class="modal-footer">';
        tags += '<div class="row">';

        tags += '<div class="col-md-7">';
        tags += '<div id="sumary_error" class="alert alert-danger text-left" style="width: 277.78px !important; display:none;">';
        tags += '<label id="lbl_msg_error"/>';
        tags += '</div>';
        tags += '</div>';

        tags += '<div class="col-md-5">';
        tags += '<div class="form-inline">';
        tags += '<button type="submit" class="btn btn-info btn-icon btn-icon-standalone btn-xs" id="btn_guardar_datos" title="Save"><i class="fa fa-check"></i><span>Save</span></button>';
        tags += '<button type="button" class="btn btn-danger btn-icon btn-icon-standalone btn-xs cancelar" data-dismiss="modal" id="btn_cancelar" aria-label="Close" onclick="_set_close_modal(true);" title="Cancel operation"><i class="fa fa-remove"></i><span>Cancel</span></button>';
        tags += '</div>';
        tags += '</div>';

        tags += '</div>';
        tags += '</div>';

        tags += '</div>';
        tags += '</div>';
        tags += '</div>';

        $(tags).appendTo('body');

        $('#btn_guardar_datos').bind('click', function (e) {
            e.preventDefault();

            if ($('#txt_usuario_id').val() != null && $('#txt_usuario_id').val() != undefined && $('#txt_usuario_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_usuarios()) {
                        _estado_inicial();
                        _set_close_modal(true);
                        jQuery('#modal_datos').modal('hide');
                    }
                } else {
                    _set_close_modal(false);
                }
            } else {
                var _output = _validation('alta');
                if (_output.Estatus) {
                    if (_alta_usuarios()) {
                        _estado_inicial();
                        _set_close_modal(true);
                        jQuery('#modal_datos').modal('hide');
                    }
                } else {
                    _set_close_modal(false);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _set_close_modal(state) {
    closeModal = state;
}

function btn_editar_click(usuario) {
    var row = $(usuario).data('usuario');

    $('#txt_usuario_id').val(row.Usuario_ID);
    $('#txt_usuario').val(row.Usuario);
    $('#txt_password').val(row.Password);
    $('#txt_email').val(row.Email);
    $('#cmb_estatus').val(row.Estatus_ID);
    $('#cmb_tipo_usuario').val(row.Tipo_Usuario_ID);
    $('#cmb_rol').val(row.Rol_ID);
    $('#txt_rel_id').val(row.Rel_Usuarios_Rol_ID);
    $('#txt_login').val(row.Usuario_login);
    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Datos a actualizar');
}

function btn_eliminar_click(usuario) {
    var row = $(usuario).data('usuario');

    bootbox.confirm({
        title: 'Remove data',
        message: 'Are you sure to delete the selected record?',
        callback: function (result) {
            if (result) {
                _eliminar_usuarios(row.Usuario_ID);
            }
            _estado_inicial();
        }
    });
}

function _set_location_toolbar() {
    $('#toolbar').parent().removeClass("pull-left");
    $('#toolbar').parent().addClass("pull-right");
}

function _set_title_modal(Titulo) {
    $("#lbl_titulo").html(Titulo);
}

function _search() {
    var filtros = null;
    try {
        show_loading_bar({
            pct: 78,
            wait: .5,
            delay: .5,
            finish: function (pct) {
                filtros = new Object();

                filtros.Usuario = $('#txt_busqueda_por_usuario').val() === '' ? '' : $('#txt_busqueda_por_usuario').val();
                filtros.Estatus_ID = $('#cmb_estatusfiltro').val() === null ? 0 : parseInt($('#cmb_estatusfiltro').val());                
                

                var $data = JSON.stringify({ 'json_object': JSON.stringify(filtros) });

                jQuery.ajax({
                    type: 'POST',
                    url: 'controllers/Usuarios_Controller.asmx/Consultar_Usuarios_Por_Filtros_Ayudante',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            
                            $('#tbl_usuarios').bootstrapTable('load', JSON.parse(datos.d));
                            hide_loading_bar();
                        }
                    }
                });
            }
        });
    } catch (e) {

    }
}

function _validation(opcion) {
    var _output = new Object();

    _output.Estatus = true;
    _output.Mensaje = '';

    if (!$('#txt_usuario').parsley().isValid()) {
        _add_class_error('#txt_usuario');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The name is a required data.<br />';
    } else {

        if ($('#txt_usuario').val().length <= 4) {

            _add_class_error('#txt_usuario');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The name is too short<br />';
        }


        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_usuario').val(), null, 'usuario') :
            _validate_fields($('#txt_usuario').val(), $('#txt_usuario_id').val(), 'usuario');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_usuario');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }        
    }
    

    if (!$('#txt_login').parsley().isValid()) {
        _add_class_error('#txt_login');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The user is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_login').val(), null, 'usuario_login') :
            _validate_fields($('#txt_login').val(), $('#txt_usuario_id').val(), 'usuario_login');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_login');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#txt_password').parsley().isValid()) {
        _add_class_error('#txt_password');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The password is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_password').val(), null, 'password') :
            _validate_fields($('#txt_password').val(), $('#txt_usuario_id').val(), 'password');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_password');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#txt_email').parsley().isValid()) {
        _add_class_error('#txt_email');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The email is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_email').val(), null, 'email') :
            _validate_fields($('#txt_email').val(), $('#txt_usuario_id').val(), 'email');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_email');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#cmb_estatus').parsley().isValid()) {
        _add_class_error('#cmb_estatus');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The status is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#cmb_estatus').val(), null, 'estatus') :
            _validate_fields($('#cmb_estatus').val(), $('#txt_usuario_id').val(), 'estatus');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#cmb_estatus');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#cmb_tipo_usuario').parsley().isValid()) {
        _add_class_error('#cmb_tipo_usuario');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The user type is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#cmb_tipo_usuario').val(), null, 'tipousuario') :
            _validate_fields($('#cmb_tipo_usuario').val(), $('#txt_usuario_id').val(), 'tipousuario');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#cmb_tipo_usuario');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#cmb_rol').parsley().isValid()) {
        _add_class_error('#cmb_rol');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The role is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#cmb_rol').val(), null, 'rol') :
            _validate_fields($('#cmb_rol').val(), $('#txt_usuario_id').val(), 'rol');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#cmb_rol');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }
    if (!_output.Estatus) _validation_sumary(_output);

    return _output;
}

function _add_class_error(selector) {
    $(selector).addClass('alert-danger');
}

function _remove_class_error(selector) {
    $(selector).removeClass('alert-danger');
}

function _clear_all_class_error() {
    $('#modal_datos input[type=text]').each(function (index, element) {
        _remove_class_error('#' + $(this).attr('id'));
    });

    $('#modal_datos select').each(function (index, element) {
        _remove_class_error('#' + $(this).attr('id'));
    });

    $('#modal_datos input[type=password]').each(function (index, element) {
        _remove_class_error('#' + $(this).attr('id'));
    });
}

function _validation_sumary(validation) {
    var header_message = '<i class="fa fa-exclamation-triangle fa-2x"></i><span>Observations</span><br />';

    if (validation == null) {
        $('#lbl_msg_error').html('');
        $('#sumary_error').css('display', 'none');
    } else {
        $('#lbl_msg_error').html(header_message + validation.Mensaje);
        $('#sumary_error').css('display', 'block');
    }
}

function _launch_modal(title_window) {
    _set_title_modal(title_window);
    jQuery('#modal_datos').modal('show', { backdrop: 'static', keyboard: false });
    $('#txt_usuario').focus();

}

function _enter_keypress_modal() {
    var $btn = $('[id$=btn_guardar_datos]').get(0);
    $(window).keypress(function (e) {
        if (e.which === 13 && e.target.type !== 'textarea') {
            if ($btn != undefined && $btn != null) {
                if ($btn.type === 'submit')
                    $btn.click();
                else
                    eval($btn.href);
                return false;
            }
        }
    });
}

function _validate_fields(value, id, field) {
    var usuario = null;
    var Resultado = null;

    try {
        usuario = new Object();
        if (id !== null)
            usuario.Usuario_ID = parseInt(id);

        switch (field) {
            case 'usuario':
                usuario.Usuario = value;
                break;
            case 'email':
                usuario.Email = value;
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(usuario) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/Consultar_Usuarios_Por_Nombre',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                if (result !== null)
                    Resultado = JSON.parse(result.d);
            }
        });
    } catch (e) {
        Resultado = new Object();
        Resultado.Estatus = 'error';
        Resultado.Mensaje = 'It was not possible to validate the' + field + ' in the data base.';
        _mostrar_mensaje('Technical report', e);
    }
    return Resultado;
}

function _load_estatus() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/ConsultarEstatus',
            //data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#cmb_estatus');
                    $('option', select).remove();
                    var options = '';
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Estatus_ID + '">' + datos_combo[Indice_Estatus].Estatus.toUpperCase() + '</option>';
                        if (datos_combo[Indice_Estatus].Estatus.toUpperCase() == 'ACTIVE') {
                            estatusActivo = datos_combo[Indice_Estatus].Estatus_ID;
                        }
                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }
}

function _filtroEstatus() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/ConsultarFiltroEstatus',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                
                if (datos !== null) {

                    var datos_combo = $.parseJSON(datos.d);                    

                    var select = $('#cmb_estatus');
                    $('option', select).remove();
                    $('#cmb_estatusfiltro', select).remove();
                                        
                    //recorremos la respuesta y llenamos el select con los estados
                    for (var i = 0; i < datos_combo.length; i++) {                        
                        $('#cmb_estatus').append('<option value="' + datos_combo[i].Estatus_ID + '">' + datos_combo[i].Estatus + '</option>');
                        $('#cmb_estatusfiltro').append('<option value="' + datos_combo[i].Estatus_ID + '">' + datos_combo[i].Estatus + '</option>');
                    }                    
                }
            }
        });
    } catch (e) {

    }
}

function _load_tipo_usuario() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/ConsultarTipoUsuario',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#cmb_tipo_usuario');
                    $('option', select).remove();
                    var options = '<option value=""><-SELECCIONE-></option>';
                    for (var Indice_tipo = 0; Indice_tipo < datos_combo.length; Indice_tipo++) {
                        options += '<option value="' + datos_combo[Indice_tipo].Tipo_Usuario_ID + '">' + datos_combo[Indice_tipo].Nombre + '</option>';
                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }
}

function _load_rol() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Usuarios_Controller.asmx/ConsultarRol',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#cmb_rol');
                    $('option', select).remove();
                    var options = '<option value=""><-SELECCIONE-></option>';
                    for (var Indice_rol = 0; Indice_rol < datos_combo.length; Indice_rol++) {
                        options += '<option value="' + datos_combo[Indice_rol].Rol_ID + '">' + datos_combo[Indice_rol].Nombre + '</option>';
                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }
}

/* =============================================
--NOMBRE_FUNCIÓN:       _validar_caracteres_email
--DESCRIPCIÓN:          valida que el usuario sólo pueda teclear caracteres validos en una direccion de email, (evento onkeypress html)
--PARÁMETROS:           evt: hace referencia al evento de precionar una tecla dentro del control
--CREO:                 Juan Carlos Gómez Rangel
--FECHA_CREO:           8 de Septiembre de 2020
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _validar_caracteres_email(evt) {

    //variable que almacena el codigo de la tecla que se preciona
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {//evaluamos si es la tecla de retroceso
        return true;
    } else if (code == 64 || code == 95 || code == 46 || code == 45) {//evaluamos el (@|_|.|-)
        return true;
    } else if (code >= 65 && code <= 90) {//evaluamos si son letras mayusculas
        return true;
    } else if (code >= 97 && code <= 122) {//evaluamos si son letras minusculas
        return true;
    } else if (code >= 48 && code <= 57) {//evaluamos si es un numero        
        return true;
    } else {//si no es ningun numero o tecla de retroceso invalidamos la accion
        return false;
    }
}
