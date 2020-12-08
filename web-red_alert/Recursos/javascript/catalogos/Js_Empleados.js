var closeModal = true;
var estatusActivo = '';
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
        _llena_combo_estatus('#cmb_estatus');
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
        $('#tbl_empleados').bootstrapTable('refresh', 'controllers/Empleados_Controller.asmx/Consultar_Empleados_Por_Filtros');
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

    $('#txt_no_empleado').attr({ disabled: !Estatus });
    $('#txt_nombre').attr({ disabled: !Estatus });
    $('#txt_apellidos').attr({ disabled: !Estatus });
    $('#txt_email').attr({ disabled: !Estatus });
    $('#txt_nivel').attr({ disabled: !Estatus });
    $('#txt_planta').attr({ disabled: !Estatus });
    $('#cmb_estatus').attr({ disabled: !Estatus });
    $('#txt_observaciones').attr({ disabled: !Estatus });
}
function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select2').each(function () { $(this).val(estatusActivo); });
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_empleado_id').val('');
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
            $("#cmb_estatus").val("ACTIVO");
            $('#cmb_estatus').attr("disabled", true);
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
    $('#txt_apellidos').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });
    $('#txt_nivel').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });
    $('#txt_email').on('blur', function () {
        $(this).val($(this).val().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/) ? $(this).val() : '');
    });
    $('#txt_observaciones').on('blur', function () {
        $(this).val($(this).val().match(/^[^'#&\\]*$/) ? $(this).val() : $(this).val().replace(/'*#*&*\\*/gi, ''));
    });
    $('#txt_no_empleado').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9()\u0020\-]+$/) ? $(this).val() : '');
    });
    $('#txt_planta').on('blur', function () {
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
        $('#tbl_empleados').bootstrapTable('destroy');
        $('#tbl_empleados').bootstrapTable({
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
                { field: 'Empleado_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'No_Empleado', title: 'Employee number', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Empleado', title: 'Name', width: 150, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Nivel', title: 'Level', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Planta', title: 'Plant', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Estatus', title: 'Status', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Observaciones', title: 'Observations', width: 100, align: 'left', valign: 'bottom', sortable: true, visible: false },
                { field: 'Empresa_ID', title: 'Company', width: 100, align: 'left', valign: 'bottom', sortable: true, visible: false },
                {
                    field: 'Empleado_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Empleado_ID + '" href="javascript:void(0)" data-empleados=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Empleado_ID + '" href="javascript:void(0)" data-empleados=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _alta_empleados() {
    var empleados = null;
    var isComplete = false;

    try {

        empleados = new Object();
        empleados.No_Empleado = $('#txt_no_empleado').val();
        empleados.Nombre = $('#txt_nombre').val();
        empleados.Apellidos = $('#txt_apellidos').val();
        empleados.Email = $('#txt_email').val();
        empleados.Nivel = parseInt($('#txt_nivel').val());
        empleados.Planta = $('#txt_planta').val();
        empleados.Estatus = $('#cmb_estatus').val();
        empleados.Observaciones = $('#txt_observaciones').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(empleados) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Empleados_Controller.asmx/Alta',
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
function _modificar_empleados() {
    var empleados = null;
    var isComplete = false;

    try {
        empleados = new Object();
        empleados.Empleado_ID = parseInt($('#txt_empleado_id').val());
        empleados.No_Empleado = $('#txt_no_empleado').val();
        empleados.Nombre = $('#txt_nombre').val();
        empleados.Apellidos = $('#txt_apellidos').val();
        empleados.Email = $('#txt_email').val();
        empleados.Nivel = parseInt($('#txt_nivel').val());
        empleados.Planta = $('#txt_planta').val();
        empleados.Estatus = $('#cmb_estatus').val();
        empleados.Observaciones = $('#txt_observaciones').val();
        

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(empleados) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Empleados_Controller.asmx/Actualizar',
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
function _eliminar_empleados(empleado_id) {
    var empleados = null;

    try {
        empleados = new Object();
        empleados.Empleado_ID = parseInt(empleado_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(empleados) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Empleados_Controller.asmx/Eliminar',
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
            '        <label class="fuente_lbl_controles">(*) Employee number</label>' +
            '        <input type="text" id="txt_no_empleado" name="txt_no_empleado" class="form-control input-sm" disabled="disabled" placeholder="(*) Employee number" data-parsley-required="true" maxlength="100" required /> ' +
            '        <input type="hidden" id="txt_empleado_id"/>' +
            ' </div> ' +
            ' <div class="col-md-6">' +
            '        <label class="fuente_lbl_controles">(*) Level</label>' +
            '        <input type="text" id="txt_nivel" name="txt_nivel" class="form-control input-sm" disabled="disabled" placeholder="(*) Level" data-parsley-required="true" maxlength="100" required /> ' +
            ' </div>' +
            '</div>' +

            '<div class="row">' +
            ' <div class="col-md-6">' +
            '        <label class="fuente_lbl_controles">(*) Name</label>' +
            '        <input type="text" id="txt_nombre" name="txt_nombre" class="form-control input-sm" disabled="disabled" placeholder="(*) Name" data-parsley-required="true" maxlength="100" required /> ' +
            ' </div>' +
            ' <div class="col-md-6">' +
            '        <label class="fuente_lbl_controles">(*) Last name</label>' +
            '        <input type="text" id="txt_apellidos" name="txt_apellidos" class="form-control input-sm" disabled="disabled" placeholder="(*) Last name" data-parsley-required="true" maxlength="100" required /> ' +
            ' </div>' +
            
            '</div>' +

            '<div class="row">' +
            ' <div class="col-md-6">' +
            '        <label class="fuente_lbl_controles">(*) Email</label>' +
            '        <input type="text" id="txt_email" name="txt_email" class="form-control input-sm" disabled="disabled" placeholder="(*) Email" data-parsley-required="true" maxlength="100" required /> ' +
            ' </div> ' +
            ' <div class="col-md-6">' +
            '        <label class="fuente_lbl_controles">(*) Plant</label>' +
            '        <input type="text" id="txt_planta" name="txt_planta" class="form-control input-sm" disabled="disabled" placeholder="(*) Plant" data-parsley-required="true" maxlength="100" required /> ' +
            ' </div>' +
            '</div>' +
                        '<div class="row">' +
            ' <div class="col-md-6">' +
            '        <label class="fuente_lbl_controles">(*) Status</label>' +
            '            <select id="cmb_estatus" name="cmb_estatus" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required style="width: 100% !important;"></select> ' +
            ' </div> ' +
            ' <div class="col-md-6">' +
            ' </div>' +
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

            if ($('#txt_empleado_id').val() != null && $('#txt_empleado_id').val() != undefined && $('#txt_empleado_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_empleados()) {
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
                    if (_alta_empleados()) {
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
function btn_editar_click(empleados) {
    var row = $(empleados).data('empleados');
   

    $('#txt_no_empleado').val(row.No_Empleado);
    $('#txt_empleado_id').val(row.Empleado_ID);
    $('#txt_nombre').val(row.Nombre);
    $('#txt_apellidos').val(row.Apellidos);
    $('#txt_email').val(row.Email);
    $('#txt_nivel').val(row.Nivel);
    $('#txt_planta').val(row.Planta);

    $('#cmb_estatus').val(row.Estatus);
    $('#txt_observaciones').val(row.Observaciones);
    _clear_all_class_error();
    _habilitar_controles('Modificar');
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Update data');
}
function btn_eliminar_click(empleados) {
    var row = $(empleados).data('empleados');

    bootbox.confirm({
        title: 'Remove data',
        message: 'Are you sure to delete the selected record?',
        callback: function (result) {
            if (result) {
                _eliminar_empleados(row.Empleado_ID);
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
                    url: 'controllers/Empleados_Controller.asmx/Consultar_Empleados_Por_Filtros',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_empleados').bootstrapTable('load', JSON.parse(datos.d));
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

    if (!$('#txt_no_empleado').parsley().isValid()) {
        _add_class_error('#txt_no_empleado');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; The employee number is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_no_empleado').val(), null, 'clave', null) :
            _validate_fields($('#txt_no_empleado').val(), $('#txt_empleado_id').val(), 'clave', null);

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_no_empleado');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#txt_nombre').parsley().isValid()) {
        _add_class_error('#txt_nombre');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; The name is a required data.<br />';
    }

    if (!$('#txt_apellidos').parsley().isValid()) {
        _add_class_error('#txt_apellidos');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The Last name is a required data.<br />';
    }

    //Validacion Nombre + Apellidos
    if ($('#txt_nombre').parsley().isValid() && $('#txt_apellidos').parsley().isValid()) {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_nombre').val(), null, 'nombre', $('#txt_apellidos').val()) :
            _validate_fields($('#txt_nombre').val(), $('txt_empleado_id').val(), 'nombre', $('#txt_apellidos').val());

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_nombre');
            _add_class_error('#txt_apellidos');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    //Planta
    if (!$('#txt_planta').parsley().isValid()) {
        _add_class_error('#txt_planta');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The plant is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_planta').val(), null, 'planta', null) :
            _validate_fields($('#txt_planta').val(), $('#txt_empleado_id').val(), 'clave', null);

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_planta');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }
    //nivel
    if (!$('#txt_nivel').parsley().isValid()) {
        _add_class_error('#txt_nivel');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; The level is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_nivel').val(), null, 'tipo', null) :
            _validate_fields($('#txt_nivel').val(), $('#txt_empleado_id').val(), 'tipo', null);

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_nivel');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }
    //Estatus
    if (!$('#cmb_estatus').parsley().isValid()) {
        _add_class_error('#cmb_estatus');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The status is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#cmb_estatus').val(), null, 'estatus', null) :
            _validate_fields($('#cmb_estatus').val(), $('#txt_empleado_id').val(), 'estatus', null);

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#cmb_estatus');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }
    //Email
    if (!$('#txt_email').parsley().isValid()) {
        _add_class_error('#txt_email');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; The Email is a required data.<br />';
    } else {
        var _Resultado = (opcion === 'alta') ?
            _validate_fields($('#txt_email').val(), null, 'email', null) :
            _validate_fields($('#txt_email').val(), $('#txt_empleado_id').val(), 'email', null);

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_email');
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
    //('#modal_datos select').each(function () {
    //    _remove_class_error('#' + $(this).attr('id'));
    //});
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
function _validate_fields(value, id, field, value2) {
    var Empleado = null;
    var Resultado = null;

    try {
        Empleado = new Object();
        if (id !== null)
            Empleado.Empleado_ID = parseInt(id);

        switch (field) {
            case 'nombre':
                Empleado.Nombre = value;
                Empleado.Apellidos = value2;
                break;
            case 'clave':
                Empleado.No_Empleado = value;
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Empleado) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Empleados_Controller.asmx/Consultar_Empleados_Por_Nombre',
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
        Resultado.Mensaje = 'It was not possible to validate the ' + field + ' in the data base.';
        _mostrar_mensaje('Technical report', e);
    }
    return Resultado;
}
function _llena_combo_estatus(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: "Select the status",
            allowClear: true,
            data: [
                {
                    id: 'ACTIVO',
                    text: 'ACTIVO'
                }, {
                    id: 'INACTIVO',
                    text: 'INACTIVO'
                }
            ]
        });

        $('#cmb_estatus').on('select2:unselect', function (evt) {
            $(this).prop('selected', function () {
                return this.defaultSelected;
            });
        });

        //$('#cmb_estatus').prop('selectedIndex', $('#cmb_estatus option:contains("value")').index());
        //$('#cmb_estatus').prop('selectedIndex', '-1'); 

    } catch (ex) {
        _mostrar_mensaje("Technical report", ex);
    }
}