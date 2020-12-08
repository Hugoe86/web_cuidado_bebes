﻿var closeModal = true;
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
        _load_estatus2();
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
        $('#tbl_plantas').bootstrapTable('refresh', 'Frm_Apl_Cat_Plantas_Ctrl.aspx?accion=consultar_unidades');
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
            break;
    }

    $('#txt_clave').attr({ disabled: !Estatus });
    $('#txt_nombre').attr({ disabled: !Estatus });
    $('#txt_direccion').attr({ disabled: !Estatus });
    $('#cmb_estatus').attr({ disabled: Estatus });
    $('#txt_colonia').attr({ disabled: !Estatus });
    $('#txt_rfc').attr({ disabled: !Estatus });
    $('#txt_cp').attr({ disabled: !Estatus });
    $('#txt_ciudad').attr({ disabled: !Estatus });
    $('#txt_estado').attr({ disabled: !Estatus });
    $('#txt_telefono').attr({ disabled: !Estatus });
    $('#txt_fax').attr({ disabled: !Estatus });
    $('#txt_email').attr({ disabled: !Estatus });
    $('#txt_descripcion').attr({ disabled: !Estatus });
}

function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(''); });
    $('#cmb_estatus').val(estatusActivo);
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_sucursal_id').val('');
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
        _mostrar_mensaje('Technical report', e);
    }
}

function _eventos_textbox() {
    $('#txt_nombre').on('blur', function () {
        $(this).val($(this).val().match(/^[^'#&\\]*$/) ? $(this).val() : $(this).val().replace(/'*#*&*\\*/gi, ''));
    });

    $('#txt_clave').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });

    $('#txt_rfc').on('blur', function () {
        $(this).val(this.value.match(/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/) ? $(this).val() : '');
    });

    $('#txt_rfc').on('keyup', function () { $(this).val($(this).val().toUpperCase()); });

    $('#txt_email').on('blur', function () {
        $(this).val(this.value.match(/^(([\w-]+\.)+[\w-]+|([a-zA-Z]{1}|[\w-]{2,}))@((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|([a-zA-Z]+[\w-]+\.)+[a-zA-Z]{2,4})$/) ? $(this).val() : _add_class_error('#txt_email'));
    });

    $('#txt_cp').on('blur', function () {
        $(this).val(this.value.match(/^([\d]{5})$/) ? $(this).val() : '');
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
        $('#tbl_plantas').bootstrapTable('destroy');
        $('#tbl_plantas').bootstrapTable({
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
                { field: 'Planta_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Clave', title: 'Key', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Nombre', title: 'Name', width: 300, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Direccion', title: 'Address', width: 100, align: 'center', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Email', title: 'Email', width: 150, align: 'center', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Descripcion', title: 'Description', width: 250, align: 'center', valign: 'bottom', sortable: true, clickToSelect: false },
                {
                    field: 'Planta_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Planta_ID + '" href="javascript:void(0)" data-sucursal=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Planta_ID + '" href="javascript:void(0)" data-sucursal=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Planta_ID + '" href="javascript:void(0)" data-sucursal=\'' + JSON.stringify(row) + '\' onclick="btn_agregar_roles_click(this);" title="Add roles"><i class="glyphicon glyphicon-plus"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}

function _alta_sucursal() {
    var Sucursal = null;
    var isComplete = false;

    try {
        Sucursal = new Object();
        Sucursal.Clave = $('#txt_clave').val();
        Sucursal.Nombre = $('#txt_nombre').val();
        Sucursal.Direccion = $('#txt_direccion').val();
        Sucursal.Estatus_ID = parseInt($('#cmb_estatus').val());
        Sucursal.Colonia = $('#txt_colonia').val();
        Sucursal.RFC = $('#txt_rfc').val();
        Sucursal.CP = $('#txt_cp').val();
        Sucursal.Ciudad = $('#txt_ciudad').val();
        Sucursal.Estado = $('#txt_estado').val();
        Sucursal.Telefono = $('#txt_telefono').val();
        Sucursal.Fax = $('#txt_fax').val();
        Sucursal.Email = $('#txt_email').val();
        Sucursal.Descripcion = $('#txt_descripcion').val();
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Sucursal) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Plantas_Controller.asmx/Alta',
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

function _actualizar_sucursal() {
    var Sucursal = null;
    var isComplete = false;

    try {
        Sucursal = new Object();
        Sucursal.Planta_ID = parseInt($('#txt_sucursal_id').val());
        Sucursal.Clave = $('#txt_clave').val();
        Sucursal.Nombre = $('#txt_nombre').val();
        Sucursal.Direccion = $('#txt_direccion').val();
        Sucursal.Estatus_ID = parseInt($('#cmb_estatus').val());
        Sucursal.Colonia = $('#txt_colonia').val();
        Sucursal.RFC = $('#txt_rfc').val();
        Sucursal.CP = $('#txt_cp').val();
        Sucursal.Ciudad = $('#txt_ciudad').val();
        Sucursal.Estado = $('#txt_estado').val();
        Sucursal.Telefono = $('#txt_telefono').val();
        Sucursal.Fax = $('#txt_fax').val();
        Sucursal.Email = $('#txt_email').val();
        Sucursal.Descripcion = $('#txt_descripcion').val();
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Sucursal) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Plantas_Controller.asmx/Actualizar',
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

function _eliminar(sucursal_id) {
    var Sucursal = null;

    try {
        Sucursal = new Object();
        Sucursal.Planta_ID = parseInt(sucursal_id);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Sucursal) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Plantas_Controller.asmx/Eliminar',
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
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else {
                    _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                }
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

        tags +=
            '<div class="row">' +
            '    <div class="col-sm-12">' +
            '       <label class="fuente_lbl_controles">(*) Name</label>' +
            '        <input type="text" id="txt_nombre" name="txt_nombre" class="form-control input-sm" disabled="disabled" placeholder="(*) Plant name" data-parsley-required="true" maxlength="100" required />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">(*) Key</label>' +
            '        <input type="text" id="txt_clave" name="txt_clave" class="form-control input-sm" disabled="disabled" placeholder="(*) Key" data-parsley-required="true" maxlength="9" required />' +
            '        <input type="hidden" id="txt_sucursal_id"/>' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">RFC</label>' +
            '        <input type="text" id="txt_rfc" name="txt_rfc" class="form-control input-sm" disabled="disabled" placeholder="RFC" data-parsley-required="false" maxlength="20" />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">Postal Code</label>' +
            '        <input type="text" id="txt_cp" name="txt_cp" class="form-control input-sm" disabled="disabled" placeholder="Postal Code" data-parsley-required="false" maxlength="20" pattern="[\d]{5}"/>' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">(*) Status</label>' +
            '        <select id="cmb_estatus" name="cmb_estatus" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required ></select> ' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">Phone</label>' +
            '        <input type="text" id="txt_telefono" name="txt_telefono" class="form-control input-sm" disabled="disabled" placeholder="Phone" data-parsley-required="false" maxlength="50" />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">Fax</label>' +
            '        <input type="text" id="txt_fax" name="txt_fax" class="form-control input-sm" disabled="disabled" placeholder="Fax" data-parsley-required="false" maxlength="20" />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">(*) Email</label>' +
            '        <input type="text" id="txt_email" name="txt_email" class="form-control input-sm" disabled="disabled" placeholder="(*) Email" data-parsley-required="true" maxlength="100" required />' +
            '    </div>' +
            '    <div class="col-sm-8">' +
            '       <label class="fuente_lbl_controles">Address</label>' +
            '        <input type="text" id="txt_direccion" name="txt_direccion" class="form-control input-sm" disabled="disabled" placeholder="Address" data-parsley-required="false" maxlength="100" />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">Colony</label>' +
            '        <input type="text" id="txt_colonia" name="txt_colonia" class="form-control input-sm" disabled="disabled" placeholder="Colony" data-parsley-required="false" maxlength="100" />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">City</label>' +
            '        <input type="text" id="txt_ciudad" name="txt_ciudad" class="form-control input-sm" disabled="disabled" placeholder="City" data-parsley-required="false" maxlength="50" />' +
            '    </div>' +
            '    <div class="col-sm-4">' +
            '       <label class="fuente_lbl_controles">State</label>' +
            '        <input type="text" id="txt_estado" name="txt_estado" class="form-control input-sm" disabled="disabled" placeholder="State" data-parsley-required="false" maxlength="50" />' +
            '    </div>' +
            '    <div class="col-sm-12">' +
            '       <label class="fuente_lbl_controles">Description</label>' +
            '        <textarea  id="txt_descripcion" name="txt_descripcion" class="form-control input-sm" rows="5" disabled="disabled" placeholder="Description" data-parsley-required="true" maxlength="250" style="min-height: 50px !important;"></textarea>' +
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

            if ($('#txt_sucursal_id').val() != null && $('#txt_sucursal_id').val() != undefined && $('#txt_sucursal_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_actualizar_sucursal()) {
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
                    if (_alta_sucursal()) {
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

function btn_editar_click(empresa) {
    var row = $(empresa).data('sucursal');

    $('#txt_sucursal_id').val(row.Planta_ID);
    $('#txt_clave').val(row.Clave);
    $('#txt_nombre').val(row.Nombre);
    $('#txt_direccion').val(row.Direccion);
    $('#cmb_estatus').val(row.Estatus_ID);
    $('#txt_colonia').val(row.Colonia);
    $('#txt_rfc').val(row.RFC);
    $('#txt_cp').val(row.CP);
    $('#txt_ciudad').val(row.Ciudad);
    $('#txt_estado').val(row.Estado);
    $('#txt_telefono').val(row.Telefono);
    $('#txt_fax').val(row.Fax);
    $('#txt_email').val(row.Email);
    $('#txt_descripcion').val(row.Descripcion);

    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Update data');
}

function btn_eliminar_click(sucursal) {
    var row = $(sucursal).data('sucursal');

    bootbox.confirm({
        title: 'Remove data',
        message: 'Are you sure to delete the selected record?',
        callback: function (result) {
            if (result) {
                _eliminar(row.Planta_ID);
            }
            _estado_inicial();
        }
    });
}

function btn_agregar_roles_click(sucursal) {
    var row = $(sucursal).data('sucursal');
    $('#txt_sucursal').val(row.Planta_ID);
    _habilitar_controles_rol_sucursal('Roles');
    _limpiar_controles_rol_sucursal();
    _search_rol_sucursal();
    _launch_modal_roles_sucursales('<i class="fa fa-pencil-square-o" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Sucursales-Roles');
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
                filtros.Clave = $('#txt_busqueda_por_clave').val() === '' ? '' : $('#txt_busqueda_por_clave').val();
                filtros.Nombre = $('#txt_busqueda_por_nombre').val() === '' ? '' : $('#txt_busqueda_por_nombre').val();
                filtros.Estatus_ID = $('#cmb_busqueda_por_estatus').val() === '' ? 0 :parseInt($('#cmb_busqueda_por_estatus').val());
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
                $.ajax({
                    url: 'controllers/Plantas_Controller.asmx/Consultar_Sucursales_Por_Filtros',
                    data: $data,
                    method: 'POST',
                    cache: false,
                    async: true,
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json',
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_plantas').bootstrapTable('load', JSON.parse(datos.d));
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

    if (!$('#txt_clave').parsley().isValid()) {
        _add_class_error('#txt_clave');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The key is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ? _validate_fields($('#txt_clave').val(), null, 'clave') : _validate_fields($('#txt_clave').val(), $('#txt_sucursal_id').val(), 'clave');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_clave');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }
    if (!$('#txt_nombre').parsley().isValid()) {
        _add_class_error('#txt_nombre');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The name is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_nombre').val(), null, 'nombre') :
            _validate_fields($('#txt_nombre').val(), $('#txt_sucursal_id').val(), 'nombre');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_nombre');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#txt_email').parsley().isValid()) {
        _add_class_error('#txt_email');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The email is a required data.<br />';
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
    var Sucursal = null;
    var Resultado = null;

    try {
        Sucursal = new Object();
        if (id !== null)
            Sucursal.Planta_ID = parseInt(id);

        switch (field) {
            case 'nombre':
                Sucursal.Nombre = value;
                break;
            case 'clave':
                Sucursal.Clave = value;
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Sucursal) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Plantas_Controller.asmx/Consultar_Sucursales_Por_Clave',
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
            url: 'controllers/Plantas_Controller.asmx/ConsultarEstatus',
            //data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#cmb_busqueda_por_estatus');
                    $('option', select).remove();
                    var options = '<option value="">--SELECT--</option>';
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Estatus_ID + '">' + datos_combo[Indice_Estatus].Estatus.toUpperCase() + '</option>';
                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }


}

function _load_estatus2() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Plantas_Controller.asmx/ConsultarEstatus',
            //data: $data,
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