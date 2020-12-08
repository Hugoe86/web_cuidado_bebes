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
        _mostrar_mensaje('Informe tecnico', e);
    }
}

function _estado_inicial() {
    try {
        _habilitar_controles('Inicio');
        _limpiar_controles();
        $('#tbl_estatus').bootstrapTable('refresh', 'controllers/Estatus_Controller.asmx/Consultar_Estatus_Por_Filtros');
        _set_location_toolbar();
    } catch (e) {
        _mostrar_mensaje('Informe tecnico', e);
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
    $('select').each(function () { $(this).val('Activo'); });
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_estatus_id').val('');
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
            _launch_modal('<i class="fa fa-floppy-o" style="font-size: 25px;"></i>&nbsp;&nbsp;Insertar datos');
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
        _mostrar_mensaje('Informe tecnico', e);
    }
}

function _eventos_textbox() {
    $('#txt_nombre').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
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
        $('#tbl_estatus').bootstrapTable('destroy');
        $('#tbl_estatus').bootstrapTable({
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
                { field: 'Estatus_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Estatus', title: 'Nombre', width: 200, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                {
                    field: 'Estatus_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Estatus_ID + '" href="javascript:void(0)" data-estatus=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Estatus_ID + '" href="javascript:void(0)" data-estatus=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe tecnico', e);
    }
}

function _alta_estatus() {
    var Estatu = null;
    var isComplete = false;

    try {

        Estatu = new Object();
        Estatu.Estatus = $('#txt_nombre').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Estatu) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Estatus_Controller.asmx/Alta',
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
        _mostrar_mensaje('Informe tecnico', e);
    }
    return isComplete;
}

function _modificar_estatus() {
    var Estatu = null;
    var isComplete = false;

    try {
        Estatu = new Object();
        Estatu.Estatus_ID = parseInt($('#txt_estatus_id').val());
        Estatu.Estatus = $('#txt_nombre').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Estatu) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Estatus_Controller.asmx/Actualizar',
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
        _mostrar_mensaje('Informe tecnico', e);
    }
    return isComplete;
}

function _eliminar_estatus(estatus_id) {
    var Estatu = null;

    try {
        Estatu = new Object();
        Estatu.Estatus_ID = parseInt(estatus_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Estatu) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Estatus_Controller.asmx/Eliminar',
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
        _mostrar_mensaje('Informe tecnico', e);
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
          ' <div class="col-md-12">' +
          '            <label class="fuente_lbl_controles">(*) Nombre</label>' +
          '        <input type="text" id="txt_nombre" name="txt_nombre" class="form-control input-sm" disabled="disabled" placeholder="(*) Nombre" data-parsley-required="true" maxlength="10" required />' +
          '        <input type="hidden" id="txt_estatus_id"/>' +
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
        tags += '<button type="submit" class="btn btn-info  btn-xs" id="btn_guardar_datos" title="Save"><i class="fa fa-check"></i><span>Guardar</span></button>';
        tags += '<button type="button" class="btn btn-danger btn-xs cancelar" data-dismiss="modal" id="btn_cancelar" aria-label="Close" onclick="_set_close_modal(true);" title="Cancel operation"><i class="glyphicon glyphicon-remove"></i><span>Cancelar</span></button>';
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

            if ($('#txt_estatus_id').val() != null && $('#txt_estatus_id').val() != undefined && $('#txt_estatus_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_estatus()) {
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
                    if (_alta_estatus()) {
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
        _mostrar_mensaje('Informe tecnico', e);
    }
}

function _set_close_modal(state) {
    closeModal = state;
}

function btn_editar_click(estatus) {
    var row = $(estatus).data('estatus');

    $('#txt_estatus_id').val(row.Estatus_ID);
    $('#txt_nombre').val(row.Estatus);

    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Actualizar datos');
}

function btn_eliminar_click(estatus) {
    var row = $(estatus).data('estatus');

    bootbox.confirm({
        title: 'Eliminar datos',
        message: '¿Está seguro de eliminar el registro seleccionado?',
        callback: function (result) {
            if (result) {
                _eliminar_estatus(row.Estatus_ID);
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
                filtros.Estatus = $('#txt_busqueda_por_nombre').val() === '' ? '' : $('#txt_busqueda_por_nombre').val();
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/Estatus_Controller.asmx/Consultar_Estatus_Por_Filtros',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_estatus').bootstrapTable('load', JSON.parse(datos.d));
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
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; El nombre es un dato requerido..<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_nombre').val(), null, 'nombre') :
            _validate_fields($('#txt_nombre').val(), $('#txt_estatus_id').val(), 'nombre');

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
    var Estatu = null;
    var Resultado = null;

    try {
        Estatu = new Object();
        if (id !== null)
            Estatu.Estatus_ID = parseInt(id);

        switch (field) {
            case 'nombre':
                Estatu.Estatus = value;
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Estatu) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Estatus_Controller.asmx/Consultar_Estatus_Por_Nombre',
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
        Resultado.Mensaje = 'No fue posible validar el ' + field + ' en la base de datos.';
        _mostrar_mensaje('Informe tecnico', e);
    }
    return Resultado;
}

