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
        _load_empleados();
        _load_criterios_autorizacion();
        _load_grupos();
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
        $('#tbl_criterios_autorizacion').bootstrapTable('refresh', 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Criterios_Autorizacion_Por_Filtros');
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
    $('#cmb_departamentos').attr({ disabled: !Estatus });
    $('#cmb_nodo_padre').attr({ disabled: !Estatus });
    $('#cmb_grupos').attr({ disabled: !Estatus });
    $('#cmb_empleados').attr({ disabled: !Estatus });
    $('#txt_no_empleado').attr({ disabled: Estatus });
    $('#txt_email').attr({ disabled: !Estatus });
    $('#txt_telefono').attr({ disabled: !Estatus });
    $('#cmb_tipo_criterio').attr({ disabled: !Estatus });
}
function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(estatusActivo); });
    $('#cmb_estatus').val('');
    $('#cmb_departamentos').val('');
    $('#cmb_empleados').val('');
    $('#cmb_nodo_padre').val('');
    $('textarea').each(function () { $(this).val(''); });
    $('#txt_criterio_autorizacion_id').val('');
    $('#txt_responsable_id').val('');
    $('#cmb_tipo_criterio').val('');
    $('#cmb_grupos').val('');
    $('#txt_nombre').val('');
    $('#txt_no_empleado').val('');
    $('#txt_email').val('');
    $('#txt_telefono').val('');
    $('#tbl_responsables').bootstrapTable('load', []);
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
            _crear_tbl_responsables();
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
        $('#cmb_empleados').change(function () {
            _busqueda_email($('#cmb_empleados').val());
        });
        $('#cmb_nodo_padre').change(function () {
            _load_tipo_criterio($('#cmb_nodo_padre').val());
            if ($('#cmb_nodo_padre').val() == '') {
                $("#cmb_tipo_criterio").attr({ disabled: false });
                $('#cmb_tipo_criterio').val('');
                $("#cmb_grupos").attr('disabled', false);
                $('#cmb_grupos').val('');
            }
            else {
                $("#cmb_tipo_criterio").attr('disabled', 'disabled');
                //$('#cmb_grupos').attr('disabled', 'disabled');
            }
        });
        $('#btn_agregar_responsable').on('click', function (e) {
            e.preventDefault();
            _agregar_responsable();
        })

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _eventos_textbox() {
    $('#txt_nombre').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9a-zA-Z\u0020]+$/) ? $(this).val() : $(this).val().replace(/\W+/g, ''));
    });
    $('#txt_email').on('blur', function () {
        $(this).val($(this).val().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/) ? $(this).val() : '');
    });
    //$('#txt_observaciones').on('blur', function () {
    //    $(this).val($(this).val().match(/^[^'#&\\]*$/) ? $(this).val() : $(this).val().replace(/'*#*&*\\*/gi, ''));
    //});
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
        $('#tbl_criterios_autorizacion').bootstrapTable('destroy');
        $('#tbl_criterios_autorizacion').bootstrapTable({
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
                { field: 'Criterio_Autorizacion_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Tipo_Criterio', title: 'Criterion type', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Grupo', title: 'Group', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Responsable_ID', title: '', width: 0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'Nombre', title: 'Name', width: 200, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Estatus', title: 'Status', width: 100, align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                {
                    field: 'Criterio_Autorizacion_ID',
                    title: '',
                    align: 'center',
                    valign: 'bottom',
                    width: 60,
                    clickToSelect: false,
                    formatter: function (value, row) {
                        return '<div> ' +
                            '<a class="remove ml10 edit" id="' + row.Criterio_Autorizacion_ID + '" href="javascript:void(0)" data-criterios_autorizacion=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Edit"><i class="glyphicon glyphicon-edit"></i></button>' +
                            '&nbsp;&nbsp;<a class="remove ml10 delete" id="' + row.Criterio_Autorizacion_ID +row.Responsable_ID+ '" href="javascript:void(0)" data-criterios_autorizacion=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Remove"><i class="glyphicon glyphicon-trash"></i></a>' +
                            '</div>';
                    }
                }
            ]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _validar_no_duplicar_responsables(id) {
    var _responsables_agregados = null;
    var _responsables_existes_tabla = false;
    try {
        _responsables_agregados = $("#tbl_responsables").bootstrapTable('getData');

        $.each(_responsables_agregados, function (index, value) {
            if (value.No_Empleado == id)
                _responsables_existes_tabla = true;
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return _responsables_existes_tabla;
}
function _validar_no_duplicar_responsable_asignado(id) {
    var responsables = null;
    var datos_emp = null;
    try {
        responsables = new Object();
        responsables.No_Empleado = id;
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(responsables) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Responsables_Asignados',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_emp = JSON.parse(datos.d);
                }
            }
        });
        return datos_emp.Mensaje;
    } catch (e) {

    }
}
function _agregar_responsable() {
    try {
        var valida_datos_requerido = _validar_datos_requeridos_agregar_responsable();
        if (valida_datos_requerido.Estatus) {
            if (!_validar_no_duplicar_responsables($('#cmb_empleados').val())) {
                if (_validar_no_duplicar_responsable_asignado($('#cmb_empleados').val()) == 'False') {
                    _agregar_lista();
                    _limpiar_datos_responsable();
                }
                else
                    _mostrar_mensaje('Information', 'The responsable is already assigned')
            } else {
                _mostrar_mensaje('Information', 'The responsable is already on the list.');
            }
        } else { _mostrar_mensaje('Information', valida_datos_requerido.Mensaje); }


    } catch (ex) {
        _mostrar_mensaje('Technical error', ex.message);
    }
}
function _agregar_lista() {
    var Responsable = null;
    var lst_responsable = null;
    try {
        $('#tbl_responsables').bootstrapTable('insertRow', {
            index: 0,
            row: {
                No_Empleado: $('#cmb_empleados').val(),
                Nombre: $('#cmb_empleados option:selected').html(),
                Email: $('#txt_email').val(),
                Telefono: $('#txt_telefono').val()
            }
        });

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _quitar_responsables(responsable) {
    var indexrow = null;
    var row = $(responsable).data('responsables');
    try {
        $('#tbl_responsables').bootstrapTable('remove', {
            field: 'Nombre',
            values: [$.trim(row.Nombre.toString())]
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }

}
function _validar_datos_requeridos_agregar_responsable() {
    var _output = new Object();

    try {
        _output.Estatus = true;
        _output.Mensaje = '';

        if ($('#cmb_empleados').val() == '' || $('#cmb_empleados').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Select a responsable.<br />';
        }
        if ($('#txt_email').val() == '' || $('#txt_email').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Email is a required data.<br />';
        }
        if ($('#txt_telefono').val() == '' || $('#txt_telefono').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Telephone is a required data.<br />';
        }
        if (_output.Mensaje != "")
            _output.Mensaje = "Please fill the next fields: <br />" + _output.Mensaje;
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    } finally {
        return _output;
    }
}
function _limpiar_datos_responsable() {
    $('#txt_email').val('');
    $('#txt_telefono').val('');
    $("#cmb_empleados").val('');
    $('#txt_no_empleado').val('');
}
function _alta_criterios() {
    var Criterios = null;
    var Responsables = null;
    var isComplete = false;

    try {
        Criterios = new Object();
        Criterios.Nombre = $('#txt_nombre').val();
        Criterios.Estatus_ID = parseInt($('#cmb_estatus').val());
        Criterios.Nodo_ID = $('#cmb_nodo_padre').val() == '' ? 0 : parseInt($('#cmb_nodo_padre').val());
        Criterios.Tipo_Criterio = $('#cmb_tipo_criterio').val();
        Criterios.Grupo_ID = parseInt($('#cmb_grupos').val());

        Criterios.Detalles = JSON.stringify($('#tbl_responsables').bootstrapTable('getData'));

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Criterios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Alta',
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
                        _load_criterios_autorizacion();
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
function _modificar_criterios() {
    var Criterios = null;
    var Responsables = null;
    var isComplete = false;

    try {
        Criterios = new Object();
        Criterios.Criterio_Autorizacion_ID = parseInt($('#txt_criterio_autorizacion_id').val());
        Criterios.Nombre = $('#txt_nombre').val();
        Criterios.Estatus_ID = parseInt($('#cmb_estatus').val());
        Criterios.Nodo_ID = $('#cmb_nodo_padre').val() == '' ? 0 : parseInt($('#cmb_nodo_padre').val());
        Criterios.Tipo_Criterio = $('#cmb_tipo_criterio').val();
        Criterios.Grupo_ID = parseInt($('#cmb_grupos').val());

        Criterios.Detalles = JSON.stringify($('#tbl_responsables').bootstrapTable('getData'));

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Criterios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Actualizar',
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
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Status</label>' +
            '       <select id="cmb_estatus" name="cmb_estatus" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required ></select> ' +
            '       <input type="hidden" id="txt_criterio_autorizacion_id"/>' +
            '       <input type="hidden" id="txt_responsable_id"/>' +
            '   </div> ' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Criterion type</label>' +
            '       <select id="cmb_tipo_criterio" name="cmb_tipo_criterio" class="form-control input-sm" disable="disabled" data-parsley-required="true" required >' +
            '           <option value="">--SELECT--</option>' +
            '           <option value="Quality">Quality</option>' +
            '           <option value="Launcher">Launcher</option>' +
            '       </select>' +
            '   </div>' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Group</label>' +
            '       <select id="cmb_grupos" name="cmb_grupos" class="form-control input-sm" disabled="disabled" data-parsley-required="true" required > </select>' +
            '   </div>' +
            '</div>' +

            '<div class="row">' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Name</label>' +
            '       <input type="text" id="txt_nombre" name="txt_nombre" class="form-control input-sm" disabled="disabled" placeholder="(*) Name" data-parsley-required="true" maxlength="100" required /> ' +
            '   </div>' +
            '   <div class="col-md-4">' +
            '   </div>' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles"> Parent node</label>' +
            '       <select id="cmb_nodo_padre" name="cmb_nodo_padre" class="form-control input-sm" disabled="disabled" > </select>' +
            '   </div>' +
            '</div>' +

            '<div class="row">' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Personal name</label>' +
            '       <select id="cmb_empleados" name="cmb_empleados" class="form-control input-sm" disable="disabled" data-parsley-required="true" required ></select>' +
            '   </div>' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Email</label>' +
            '       <input type="text" id="txt_email" name="txt_email" class="form-control input-sm" disable="disabled" placeholder="Email" data-parsley-required="true" required/>' +
            '   </div>' +
            '   <div class="col-md-4">' +
            '       <label class="fuente_lbl_controles">(*) Phone</label>' +
            '       <input type="text" id="txt_telefono" name="txt_telefono" class="form-control input-sm" disable="disabled" placeholder="Phone" data-parsley-required="true" required onkeypress="return _solo_numeros(event)" maxlength="15"/>' +
            '   </div>' +
            '</div>' +

            '<div class="row">' +
            '   <div class="col-md-4">' +
            '       <button type="submit" style="margin-top:15px; margin-bottom:15px; margin-left:5px" class="btn btn-info btn-icon btn-icon-standalone btn-xs" id="btn_agregar_responsable" title="Add"><i class="fa fa-check"></i><span>Add Responsable</span></button>' +
            '   </div>' +
            '</div>' +

            '<div class="row">' +
            '   <table id="tbl_responsables" class="table table-responsive table-sm"></table>' +
            '</div>';
        
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

            if ($('#txt_criterio_autorizacion_id').val() != null && $('#txt_criterio_autorizacion_id').val() != undefined && $('#txt_criterio_autorizacion_id').val() != '') {
                var _output = _validation('editar');
                if (_output.Estatus) {
                    if (_modificar_criterios()) {
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
                    if (_alta_criterios()) {
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
function btn_editar_click(criterios_autorizacion) {
    var row = $(criterios_autorizacion).data('criterios_autorizacion');
    var nodo = row.Nodo_ID == 0 ? '' : row.Nodo_ID;
    $('#txt_criterio_autorizacion_id').val(row.Criterio_Autorizacion_ID);
    $('#txt_responsable_id').val(row.Responsable_ID);
    $('#txt_nombre').val(row.Nombre);
    $('#cmb_estatus').val(row.Estatus_ID);
    $('#cmb_departamentos').val(row.Departamento_ID);
    $('#cmb_nodo_padre').val(nodo);
    $('#cmb_empleados option:selected').html(row.Nombre_Empleado);
    $('#txt_no_empleado').val(row.No_Empleado);
    $('#txt_email').val(row.Email);
    $('#txt_telefono').val(row.Telefono);
    $('#cmb_tipo_criterio').val(row.Tipo_Criterio);
    $('#cmb_grupos').val(row.Grupo_ID);
    _clear_all_class_error();
    _habilitar_controles('Modificar');
    _crear_tbl_responsables();
    _consultar_responsables(row.Criterio_Autorizacion_ID);
    _launch_modal('<i class="glyphicon glyphicon-edit" style="font-size: 25px;"></i>&nbsp;&nbsp;Update data');
}
function btn_eliminar_click(criterios_autorizacion) {
    var row = $(criterios_autorizacion).data('criterios_autorizacion');
    bootbox.confirm({
        title: 'Remove data',
        message: 'Are you sure to delete the selected record?',
        callback: function (result) {
            if (result) {
                _eliminar_criterios(row.Criterio_Autorizacion_ID);
                _load_criterios_autorizacion();
            }
            _estado_inicial();
        }
    });
}
function _eliminar_criterios(criterio_id) {
    var criterio = null;
    var responsable = null;

    try {
        criterio = new Object();
        criterio.Criterio_Autorizacion_ID = parseInt(criterio_id);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(criterio) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Eliminar',
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
                    url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Criterios_Autorizacion_Por_Filtros',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: true,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            $('#tbl_criterios_autorizacion').bootstrapTable('load', JSON.parse(datos.d));
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
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp; The name is field required.<br />';
    } else {
        var _criterios = new Object();
        _criterios.Nombre = $('#txt_nombre').val();
        _criterios.Tipo_Criterio = $('#cmb_tipo_criterio').val();
        _criterios.Grupo_ID = $('#cmb_grupos').val();
        var _Resultado = (opcion === 'alta') ?
            _validate_fields(_criterios, null, 'nombre') :
            _validate_fields(_criterios, $('#txt_criterio_autorizacion_id').val(), 'nombre');

        if (_Resultado.Estatus === 'error') {
            _add_class_error('#txt_nombre');
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;' + _Resultado.Mensaje + '<br />';
        }
    }

    if (!$('#cmb_estatus').parsley().isValid()) {
        _add_class_error('#cmb_estatus');
        _output.Estatus = false;
        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Status is field required.<br />';
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
    var Criterios = null;
    var Resultado = null;

    try {
        Criterios = new Object();
        if (id !== null)
            Criterios.Criterio_Autorizacion_ID = parseInt(id);

        switch (field) {
            case 'nombre':
                Criterios.Nombre = value.Nombre;
                Criterios.Tipo_Criterio = value.Tipo_Criterio;
                Criterios.Grupo_ID = parseInt(value.Grupo_ID);
                break;
            default:
        }

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Criterios) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Criterios_Autorizacion_Por_Nombre',
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
function _load_estatus() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Estatus',
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
function _load_empleados() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Empleados',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select2 = $('#cmb_empleados');
                    $('option', select2).remove();
                    var options = '<option value="">--SELECT--</option>';
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].No_Empleado + '">' + datos_combo[Indice_Estatus].Nombre.toUpperCase() + '</option>';
                        
                    }
                    select2.append(options);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _load_grupos() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Grupos',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select2 = $('#cmb_grupos');
                    $('option', select2).remove();
                    var options = '<option value="">--SELECT--</option>';
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Grupo_ID + '">' + datos_combo[Indice_Estatus].Nombre.toUpperCase() + '</option>';

                    }
                    select2.append(options);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _load_criterios_autorizacion() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Criterios_Autorizacion',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select2 = $('#cmb_nodo_padre');
                    $('option', select2).remove();
                    var options = '<option value="">--SELECT--</option>';
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Criterio_Autorizacion_ID + '">' + datos_combo[Indice_Estatus].Nombre.toUpperCase() + '</option>';
                        
                    }
                    select2.append(options);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _lista_responsables() {
    var filtros = null;
    var datos_emp;
    try {
        filtros = new Object();
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_lista_responsables',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_emp = JSON.parse(datos.d);
                }
            }
        });
        return datos_emp.Mensaje;
    } catch (e) {

    }
}
function _crear_tbl_responsables() {
    try {
        $('#tbl_responsables').bootstrapTable('destroy');
        $('#tbl_responsables').bootstrapTable({
            idField: 'Responsable_ID',
            uniqueId: 'Responsable_ID',
            method: 'POST',
            async: false,
            cache: false,
            striped: true,
            width:850,
            pagination: false,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            search: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            editable: true,
            showFooter: false,
            columns: [
                { field: 'Responsable_ID', title: '', width:0, align: 'center', valign: 'bottom', sortable: true, visible: false },
                { field: 'No_Empleado', title: 'Employee number', width: 100, align: 'left', valign: 'bottom', sortable: true, visible: true },
                { field: 'Nombre', title: 'Name', width:200, align: 'center', valign: 'bottom', sortable: true, visible: true },
                { field: 'Email', title: 'Email', width:100, align: 'center', valign: 'bottom', sortable: true, visible: true },
                { field: 'Telefono', title: 'Phone', width:100, align: 'left', valign: 'bottom', sortable: true, visible: true },
                {
                    field: 'eliminar', title: 'Remove', width:20, align: 'center', valign: 'bottom', formatter: function (value, row) {
                        return '<div><a class="remove ml10" id="' + value + '" href="javascript:void(0)"  data-responsables=\'' + JSON.stringify(row) + '\' onclick="_quitar_responsables(this);"><i class="glyphicon glyphicon-remove"></i></a></div>';
                    }
                }
            ],
            onLoadSuccess: function (data) {
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical error', 'Error al crear la tabla');
    }
}
function _consultar_responsables(criterio_id) {
    var filtros = null;
    try {
        filtros = new Object();
        filtros.Criterio_Autorizacion_ID = parseInt(criterio_id);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_lista_responsables',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    $('#tbl_responsables').bootstrapTable('load', JSON.parse(datos.d));
                }
            }
        });
    } catch (e) {

    }
}
function _load_tipo_criterio(Criterio) {
    var filtros = null;

    try {
        filtros = new Object();
        filtros.Criterio_Autorizacion_ID = parseInt(Criterio);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Datos_Criterios',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: $data,
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    $('#cmb_tipo_criterio').val($.trim(datos_combo[0].Tipo_Criterio));
                    $('#cmb_grupos').val(datos_combo[0].Grupo_ID);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}
function _solo_numeros(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "0123456789";
    especiales = [8];

    tecla_especial = false
    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if (letras.indexOf(tecla) == -1 && !tecla_especial)
        return false;
}
function _busqueda_email(no_empleado) {
    var Empleado = null;

    try {
        Empleado = new Object();
        Empleado.No_Empleado = no_empleado;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Empleado) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Criterios_Autorizacion_Controller.asmx/Consultar_Email',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: $data,
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_email = $.parseJSON(datos.d);
                    $('#txt_email').val($.trim(datos_email[0].Email));
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
}