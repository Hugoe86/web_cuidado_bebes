var closeModal = true;
var estatusActivo = '';
$(document).on('ready', function () {
    _inicializar_pagina();
});
function _inicializar_pagina() {
    try {
        _habilitar_controles('Inicio');
        _limpiar_controles();
        _load_estatus();
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
        $('#tbl_areas').bootstrapTable('refresh','controllers/Areas_Controller.asmx/Consultar_Areas_Por_Filtros');
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
            $('#cmb_estatus').attr({ disabled: Estatus });
            break;
        case "Modificar":
            Estatus = true;
            $('#cmb_estatus').attr({ disabled: !Estatus });
            break;
        case "Inicio":
            break;
    }
    $('#txt_nombre').attr({ disabled: !Estatus });
    $('#txt_observaciones').attr({ disabled: !Estatus });
}
function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(estatusActivo); });
    $('#cmb_estatus').val('');
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_area_id').val('');
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
            $('#cmb_estatus').val(estatusActivo);
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
        _mostrar_mensaje('Technical report', e);
    }
}
function _eventos_textbox() {
    $('#txt_nombre').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });

    $('#txt_observaciones').on('blur', function () {
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
        $('#tbl_areas').bootstrapTable('destroy');
        $('#tbl_areas').bootstrapTable({
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
                { field: 'Area_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Nombre', title: 'Name', width: 200, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Estatus', title: 'Status', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Observaciones', title: 'Observations', width: 200, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Empresa_ID', title: 'Company', width: 100, align: 'left', valign: 'bottom', sortable: true, visible: false },
                {
                    field: 'Area_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Area_ID + '" href="javascript:void(0)" data-areas=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Area_ID + '" href="javascript:void(0)" data-areas=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _alta_areas() {
    var Areas = null;
    var isComplete = false;

    try {

        Areas = new Object();
        Areas.Nombre = $('#txt_nombre').val();
        Areas.Observaciones = $('#txt_observaciones').val();
        Areas.Estatus_ID = parseInt($('#cmb_estatus').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Areas) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Areas_Controller.asmx/Alta',
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
function _modificar_areas() {
    var Areas = null;
    var isComplete = false;

    try {
        Areas = new Object();
        Areas.Area_ID = parseInt($('#txt_area_id').val());
        Areas.Nombre = $('#txt_nombre').val();
        Areas.Observaciones = $('#txt_observaciones').val();
        Areas.Estatus_ID = parseInt($('#cmb_estatus').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Areas) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Areas_Controller.asmx/Actualizar',
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
function _eliminar_areas(area_id) {
    var Areas = null;

    try {
        Areas = new Object();
        Areas.Area_ID = parseInt(area_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Areas) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Areas_Controller.asmx/Eliminar',
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

        tags += '<div class="row">' +
            ' <div class="col-md-6">' +
            '            <label class="fuente_lbl_controles">(*) Status</label>' +
            '        <select id="cmb_estatus" name="cmb_estatus" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required ></select> ' +
            '        <input type="hidden" id="txt_area_id"/>' +
            '       </div> ' +

            ' <div class="col-md-6">' +
            '            <label class="fuente_lbl_controles">(*) Name</label>' +
            '        <input type="text" id="txt_nombre" name="txt_nombre" class="form-control input-sm" disabled="disabled" placeholder="(*) Name" data-parsley-required="true" maxlength="100" required /> ' +
            '    </div>' +
            '</div>' +

            '<div class="row">' +
            ' <div class="col-md-12">' +
            '            <label class="fuente_lbl_controles">Observations</label>' +
            '        <textarea  id="txt_observaciones" name="txt_observaciones" class="form-control input-sm" disabled="disabled" placeholder="Observations"  style="min-height: 50px !important;" data-parsley-required="false" maxlength="250"> </textarea>' +
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

            if ($('#txt_area_id').val() != null && $('#txt_area_id').val() != undefined && $('#txt_area_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_areas()) {
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
                    if (_alta_areas()) {
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
function btn_editar_click(areas) {
    var row = $(areas).data('areas');

    $('#txt_area_id').val(row.Area_ID);
    $('#txt_nombre').val(row.Nombre);
    $('#txt_observaciones').val(row.Observaciones);
    $('#cmb_estatus').val(row.Estatus_ID);
    _clear_all_class_error();
    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Update data');
}
function btn_eliminar_click(areas) {
    var row = $(areas).data('areas');

    bootbox.confirm({
        title: 'Remove data',
        message: 'Are you sure to delete the selected record?',
        callback: function (result) {
            if (result) {
                _eliminar_areas(row.Area_ID);
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
                    url: 'controllers/Areas_Controller.asmx/Consultar_Areas_Por_Filtros',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_areas').bootstrapTable('load', JSON.parse(datos.d));
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
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; The name is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_nombre').val(), null, 'nombre') :
            _validate_fields($('#txt_nombre').val(), $('#txt_area_id').val(), 'nombre');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_nombre');
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
            _validate_fields($('#cmb_estatus').val(), $('#txt_area_id').val(), 'estatus');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#cmb_estatus');
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
    $('#modal_datos select').each(function () {
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
    $('#txt_nombre').focus();

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
    var Areas = null;
    var Resultado = null;

    try {
        Areas = new Object();
        if (id !== null)
            Areas.Area_ID = parseInt(id);

        switch (field) {
            case 'nombre':
                Areas.Nombre = value;
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Areas) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Areas_Controller.asmx/Consultar_Areas_Por_Nombre',
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
function _load_estatus() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Areas_Controller.asmx/Consultar_Estatus',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select2 = $('#cmb_estatus');
                    $('option', select2).remove();
                    var options = '<option value="">--SELECT--</option>';
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Estatus_ID + '">' + datos_combo[Indice_Estatus].Estatus.toUpperCase() + '</option>';
                        if (datos_combo[Indice_Estatus].Estatus.toUpperCase() == 'ACTIVE') {
                            estatusActivo = datos_combo[Indice_Estatus].Estatus_ID;
                        }
                    }
                    select2.append(options);
                }
            }
        });
    } catch (e) {

    }
}
