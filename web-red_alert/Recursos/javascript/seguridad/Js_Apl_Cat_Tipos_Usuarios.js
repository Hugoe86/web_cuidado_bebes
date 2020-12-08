var closeModal = true;
$(document).on('ready', function () {
    _inicializar_pagina();
});

function _inicializar_pagina() {
    try {
        _habilitar_controles('Inicio');
        _limpiar_controles();
        _cargar_tabla();
        _search();
        _modal();
        _eventos_textbox();
        _eventos();
        _enter_keypress_modal();
        _set_location_toolbar();
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}

function _estado_inicial() {
    try {
        _habilitar_controles('Inicio');
        _limpiar_controles();
        $('#tbl_tipos_usuarios').bootstrapTable('refresh', 'controllers/Tipos_Usuarios_Controller.asmx/Consultar_Tipos_Usuarios_Por_Filtros');
        _set_location_toolbar();
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}

function _habilitar_controles(opcion) {
    var Estatus = false;

    switch (opcion) {
        case "Nuevo":
            Estatus = true;
     
            break;
        case "Modificar":
            Estatus = true;
  
            break;
        case "Inicio":
            break;
    }

   
    $('#txt_nombre').attr({ disabled: !Estatus });

}

function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(estatusActivo); });
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_tipo_usuario_id').val('');
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
            _launch_modal('<i class="fa fa-floppy-o" style="font-size: 25px;"></i>&nbsp;&nbsp;Alta de registro');
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
        _mostrar_mensaje('Informe Técnico', e);
    }
}

function _eventos_textbox() {
    $('#txt_nombre').on('blur', function () {
        $(this).val($(this).val().match(/^[^'#&\\]*$/) ? $(this).val() : $(this).val().replace(/'*#*&*\\*/gi, ''));
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
        $('#tbl_tipos_usuarios').bootstrapTable('destroy');
        $('#tbl_tipos_usuarios').bootstrapTable({
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
                { field: 'Tipo_Usuario_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Nombre', title: 'Nombre', width: 500, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                {
                    field: 'Tipo_Usuario_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Tipo_Usuario_ID + '" href="javascript:void(0)" data-tipo_usuario=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Tipo_Usuario_ID + '" href="javascript:void(0)" data-tipo_usuario=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Eliminar"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}

function _alta_tipos_usuarios() {
    var tipos_usuarios = null;
    var isComplete = false;

    try {

        tipos_usuarios = new Object();
    
        tipos_usuarios.Nombre = $('#txt_nombre').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(tipos_usuarios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Tipos_Usuarios_Controller.asmx/Alta',
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
        _mostrar_mensaje('Informe Tecnico', e);
    }
    return isComplete;
}

function _modificar_tipos_usuarios() {
    var tipos_usuarios = null;
    var isComplete = false;

    try {
        tipos_usuarios = new Object();
        tipos_usuarios.Tipo_Usuario_ID = parseInt($('#txt_tipo_usuario_id').val());
  
        tipos_usuarios.Nombre = $('#txt_nombre').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(tipos_usuarios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Tipos_Usuarios_Controller.asmx/Actualizar',
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
        _mostrar_mensaje('Informe Tecnico', e);
    }
    return isComplete;
}

function _eliminar_tipos_usuarios(tipo_usuario_id) {
    var tipos_usuarios = null;

    try {
        tipos_usuarios = new Object();
        tipos_usuarios.Tipo_Usuario_ID = parseInt(tipo_usuario_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(tipos_usuarios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Tipos_Usuarios_Controller.asmx/Eliminar',
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
        _mostrar_mensaje('Informe Técnico', e);
    }
}

function _modal() {
    var tags = '';
    try {
        tags += '<div class="modal fade" id="modal_datos" name="modal_datos" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">';
        tags += '<div class="modal-dialog">';
        tags += '<div class="modal-content">';

        tags += '<div class="modal-header">';
        tags += '<button type="button" class="close cancelar" data-dismiss="modal" aria-label="Close" onclick="_set_close_modal(true);"><i class="fa fa-times"></i></button>';
        tags += '<h4 class="modal-title" id="myModalLabel">';
        tags += '<label id="lbl_titulo"></label>';
        tags += '</h4>';
        tags += '</div>';

        tags += '<div class="modal-body">';

        tags += '<div class="row">' +
            '    <div class="col-sm-12">' +
            '           <label class="fuente_lbl_controles">(*) Nombre</label>' +
            '        <input type="text" id="txt_nombre" name="txt_nombre" class="form-control input-sm" disabled="disabled" placeholder="(*) Nombre" data-parsley-required="true" maxlength="100" required /> ' +
            '        <input type="hidden" id="txt_tipo_usuario_id"/>' +
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
        tags += '<button type="submit" class="btn btn-info btn-icon btn-icon-standalone btn-xs" id="btn_guardar_datos" title="Guardar"><i class="fa fa-check"></i><span>Aceptar</span></button>';
        tags += '<button type="button" class="btn btn-danger btn-icon btn-icon-standalone btn-xs cancelar" data-dismiss="modal" id="btn_cancelar" aria-label="Close" onclick="_set_close_modal(true);" title="Cancelar operaci&oacute;n"><i class="fa fa-remove"></i><span>Cancelar</span></button>';
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

            if ($('#txt_tipo_usuario_id').val() != null && $('#txt_tipo_usuario_id').val() != undefined && $('#txt_tipo_usuario_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_tipos_usuarios()) {
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
                    if (_alta_tipos_usuarios()) {
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
        _mostrar_mensaje('Informe técnico', e);
    }
}

function _set_close_modal(state) {
    closeModal = state;
}

function btn_editar_click(tipo_usuario) {
    var row = $(tipo_usuario).data('tipo_usuario');

    $('#txt_tipo_usuario_id').val(row.Tipo_Usuario_ID);
    $('#txt_nombre').val(row.Nombre);
    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Actualizar registro');
}

function btn_eliminar_click(tipo_usuario) {
    var row = $(tipo_usuario).data('tipo_usuario');

    bootbox.confirm({
        title: 'Eliminar Registro',
        message: 'Esta seguro de eliminar el registro seleccionado?',
        callback: function (result) {
            if (result) {
                _eliminar_tipos_usuarios(row.Tipo_Usuario_ID);
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
    
                filtros.Nombre = $('#txt_busqueda_por_nombre').val() === '' ? '' : $('#txt_busqueda_por_nombre').val();
            

                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                jQuery.ajax({
                    type: 'POST',
                    url: 'controllers/Tipos_Usuarios_Controller.asmx/Consultar_Tipos_Usuarios_Por_Filtros',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_tipos_usuarios').bootstrapTable('load', JSON.parse(datos.d));
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

    if (!$('#txt_nombre').parsley().isValid()) {
        _add_class_error('#txt_nombre');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El nombre es un dato requerido.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_nombre').val(), null, 'nombre') :
            _validate_fields($('#txt_nombre').val(), $('#txt_tipo_usuario_id').val(), 'nombre');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_nombre');
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
}

function _validation_sumary(validation) {
    var header_message = '<i class="fa fa-exclamation-triangle fa-2x"></i><span>Observaciones</span><br />';

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
    $('#txt_clave').focus();

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
    var tipo_usuario = null;
    var Resultado = null;

    try {
        tipo_usuario = new Object();
        if (id !== null)
            tipo_usuario.Tipo_Usuario_ID = parseInt(id);

        switch (field) {
            case 'nombre':
                tipo_usuario.Nombre = value;
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(tipo_usuario) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Tipos_Usuarios_Controller.asmx/Consultar_Tipos_Usuarios_Por_Nombre',
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
        Resultado.Mensaje = 'No fue posible realizar la validación del ' + field + ' en la base de datos.';
        _mostrar_mensaje('Informe Técnico', e);
    }
    return Resultado;
}

