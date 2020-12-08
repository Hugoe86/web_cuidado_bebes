var closeModal = true;
var estatusActivo = '';
$(document).on('ready', function () {
    _inicializar_pagina();
});

function _inicializar_pagina() {
    try {
        _combo_menu();
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
        _mostrar_mensaje('Technical report', e);
    }
}
function _estado_inicial() {
    try {
        _habilitar_controles('Inicio');
        _limpiar_controles();
        $('#tbl_parametros').bootstrapTable('refresh', 'controllers/Parametros_Controller.asmx/Consultar_Parametro_Por_Filtros');
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
            
            break;
        case "Modificar":
            Estatus = true;
           
            break;
        case "Inicio":
            $('#btn_nuevo').attr({ disabled: Estatus })
            break;
        case "OcultarBoton":
            $('#btn_nuevo').attr({disabled: !Estatus})
            break;
    }

    $('#txt_prefijo').attr({ disabled: !Estatus });
    $('#txt_tipo_usuario').attr({ disabled: !Estatus });
    $('#cmb_menu').attr({ disabled: !Estatus });

}
function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(estatusActivo); });
    $('#cmb_menu').val('');
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_parametro_id').val('');
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
            _launch_modal('<i class="fa fa-floppy-o" style="font-size: 25px;"></i>&nbsp;&nbsp;Insert data');
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
    $('#txt_prefijo').on('blur', function () {
        $(this).val($(this).val().match(/^[a-zA-Z\-]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });

    $('#txt_tipo_usuario').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020\-]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
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
        $('#tbl_parametros').bootstrapTable('destroy');
        $('#tbl_parametros').bootstrapTable({
            cache: false,
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
                { field: 'Parametro_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Prefijo', title: 'Prefix', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Tipo_Usuario', title: 'User type', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Menu_ID', title: 'Menu_ID', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false, visible: false },
                { field: 'Nombre_Mostrar', title: 'Production Screen', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },

                {
                    field: 'Parametro_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Parametro_ID + '" href="javascript:void(0)" data-parametro=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Parametro_ID + '" href="javascript:void(0)" data-parametro=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _alta_parametro() {
    var parametro = null;
    var isComplete = false;

    try {

        parametro = new Object();
        parametro.Prefijo = $('#txt_prefijo').val();
        parametro.Tipo_Usuario = $('#txt_tipo_usuario').val();
        parametro.Menu_ID = $('#cmb_menu').val() == '' ? 0 : parseInt($('#cmb_menu').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(parametro) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Parametros_Controller.asmx/Alta',
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
        _mostrar_mensaje('Technical report ', e);
    }
    return isComplete;
}

function _modificar_parametros() {
    var parametro = null;
    var isComplete = false;

    try {
        parametro = new Object();
        parametro.Parametro_ID = parseInt($('#txt_parametro_id').val());
        parametro.Prefijo = $('#txt_prefijo').val();
        parametro.Tipo_Usuario = $('#txt_tipo_usuario').val();
        parametro.Menu_ID = $('#cmb_menu').val() == '' ? 0 : parseInt($('#cmb_menu').val());
     

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(parametro) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Parametros_Controller.asmx/Actualizar',
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

function _eliminar_parametro(parametro_id) {
    var parametro = null;

    try {
        parametro = new Object();
        parametro.Parametro_ID = parseInt(parametro_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(parametro) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Parametros_Controller.asmx/Eliminar',
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
        tags += '<div class="modal-dialog">';
        tags += '<div class="modal-content">';

        tags += '<div class="modal-header">';
        tags += '<button type="button" class="close cancelar" data-dismiss="modal" aria-label="Close" onclick="_set_close_modal(true);"><i class="fa fa-times"></i></button>';
        tags += '<h4 class="modal-title" id="myModalLabel">';
        tags += '<label id="lbl_titulo"></label>';
        tags += '</h4>';
        tags += '</div>';

        tags += '<div class="modal-body">';
        tags +=
           '<div class="row">' +
           ' <div class="col-md-4">' +
           '            <label class="fuente_lbl_controles">(*) Prefix</label>' +
           '        <input type="text" id="txt_prefijo" name="txt_prefijo" class="form-control input-sm" disabled="disabled" placeholder="(*) Prefix" data-parsley-required="true" maxlength="5" required />' +
           '   </div> ' +
           ' <div class="col-md-8">' +
           '            <label class="fuente_lbl_controles">(*) User type</label>' +
           '        <input type="text" id="txt_tipo_usuario" name="txt_tipo_usuario" class="form-control input-sm" disabled="disabled" placeholder="(*) Tipo de Usuario" data-parsley-required="true" maxlength="50" required /> ' +
           '        <input type="hidden" id="txt_parametro_id"/>' +
           '       </div> ' +
           '</div>' +
           '<div class="row">' +
           ' <div class="col-md-4">' +
           '            <label class="fuente_lbl_controles">(*) URL Production Screen</label>' +
           '        <select id="cmb_menu" name="cmb_menu" class="form-control input-sm" disabled="disabled" data-parsley-required="false" ></select> ' +
           '   </div> ' +
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

            if ($('#txt_parametro_id').val() != null && $('#txt_parametro_id').val() != undefined && $('#txt_parametro_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_parametros()) {
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
                    if (_alta_parametro()) {
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

function btn_editar_click(parametro) {
    var row = $(parametro).data('parametro');

    $('#txt_parametro_id').val(row.Parametro_ID);
    $('#txt_prefijo').val(row.Prefijo);
    $('#txt_tipo_usuario').val(row.Tipo_Usuario);
    $('#cmb_menu').val(row.Menu_ID);

    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Update data');
}

function btn_eliminar_click(parametro) {
    var row = $(parametro).data('parametro');

    bootbox.confirm({
        title: 'Remove data',
        message: 'Are you sure to delete the selected record?',
        callback: function (result) {
            if (result) {
                _eliminar_parametro(row.Parametro_ID);
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
                filtros.Prefijo = $('#txt_busqueda_por_prefijo').val() === '' ? '' : $('#txt_busqueda_por_prefijo').val();


                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                jQuery.ajax({
                    type: 'POST',
                    url: 'controllers/Parametros_Controller.asmx/Consultar_Parametro_Por_Filtros',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_parametros').bootstrapTable('load', JSON.parse(datos.d));
                            hide_loading_bar();
                            _habilitar_controles('OcultarBoton');
                            
                            if (datos.d == "[]")
                                _habilitar_controles('Inicio');
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

    if (!$('#txt_prefijo').parsley().isValid()) {
        _add_class_error('#txt_prefijo');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The prefix is ​​a required data.<br />';
    }

    if (!$('#txt_tipo_usuario').parsley().isValid()) {
        _add_class_error('#txt_tipo_usuario');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The user type is ​​a required data.<br />';
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
    $('#txt_prefijo').focus();

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
    var parametro = null;
    var Resultado = null;

    try {
        parametro = new Object();
        if (id !== null)
            parametro.Parametro_ID = parseInt(id);

        switch (field) {
            case 'prefijo':
                parametro.Prefijo = value;
                break;
        
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(parametro) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Parametros_Controller.asmx/Consultar_Parametro_Por_Nombre',
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
        Resultado.Mensaje = 'It was not possible to validate the ' + field + ' in the database.';
        _mostrar_mensaje('Technical report', e);
    }
    return Resultado;
}

function _combo_menu() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Parametros_Controller.asmx/Consultar_Menus',
            //data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#cmb_menu');
                    $('option', select).remove();
                    var options = '<option value=""><-SELECT-></option>';
                    for (var Indice_estatus = 0; Indice_estatus < datos_combo.length; Indice_estatus++) {
                        options += '<option value="' + datos_combo[Indice_estatus].Menu_ID + '">' + datos_combo[Indice_estatus].Nombre_Mostrar + '</option>';
                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }
}