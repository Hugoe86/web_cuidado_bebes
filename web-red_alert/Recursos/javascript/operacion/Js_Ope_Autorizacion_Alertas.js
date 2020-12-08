var $table = null;
var closeModal = true;
var estatusActivo = '';
var estatusActivo_ID = 0;
var p;
var id_18 = 0;
var id_otro = 0;

$(document).on('ready', function () {
    _inicializar_pagina();
    $table = $('#tbl_alertas_rojas');
    $table_comentarios = $('#tbl_lista_comentarios');
    _limpiar_controles();
    _set_location_toolbar();
    _load_estatus_activo();
    _load_checkboxes();
    //_load_check_procesos();
    _eventos();

    var usuario = _validar_nivel();
    if (usuario == "True") {
        $('#tbl_alertas_rojas').bootstrapTable('hideColumn', 'Aprobado');
        $('#tbl_alertas_rojas').bootstrapTable('hideColumn', 'Autorizar');
        $('#tbl_alertas_rojas').bootstrapTable('hideColumn', 'Rechazar');
    }
 
});
function _inicializar_pagina() {
    try {
        _agregar_tooltip();
        _agregar_tooltip_tabla();
        _load_estatus('#cmb_busqueda_por_estatus');
        _crear_tbl_alertas_rojas();
        _crear_tbl_comentarios();
        //_modal_comentarios();
        _habilitar_controles('Inicial');
        _set_location_toolbar();
        _search_alertas_rojas_por_filtros();
        _eventos_textbox();
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _set_location_toolbar() {
    $('#toolbar').parent().removeClass("pull-left");
    $('#toolbar').parent().addClass("pull-right");
}

function _remove_class_error(selector) {
    $(selector).removeClass('alert-danger');
}
function _clear_all_class_error() {  
    $('#modal_datos_comentarios input[type=textarea]').each(function (index, element) {
        _remove_class_error('#' + $(this).attr('id'));
    });
    $('#modal_datos_comentarios select').each(function (index, element) {
        _remove_class_error('#' + $(this).attr('id'));
    });
}
function _eventos() {
    try {
        $('#modal_datos_comentarios').on('hidden.bs.modal', function () {
            if (!closeModal)
                $(this).modal('show');
        });
        $('#modal_datos_comentarios input[type=textarea]').each(function (index, element) {
            $(this).on('focus', function () {
                _remove_class_error('#' + $(this).attr('id'));
            });
        });
        $('#modal_datos_comentarios select').each(function (index, element) {
            $(this).on('focus', function () {
                _remove_class_error('#' + $(this).attr('id'));
            });
        });
        $('#modal_datos').on('hidden.bs.modal', function () {
            if (!closeModal)
                $(this).modal('show');
        });
        $('#btn_inicio').on('click', function (e) { e.preventDefault(); window.location.href = '../Paginas_Generales/Frm_Apl_Principal.aspx'; });
        $('#btn_busqueda').on('click', function (e) {
            _search_alertas_rojas_por_filtros();
        });
        $('#btn_salir').on('click', function (e) {
            debugger;
            if ($('#txt_descripcion_1').val() !== '') {
                bootbox.dialog({
                    message: "The entered data will not be saved<br/> Are you sure to continue?",
                    title: "Red Alert",
                    locale: 'es',
                    closeButton: true,
                    buttons: [{
                        label: 'Ok',
                        className: 'btn-default',
                        callback: function () {
                            $('#div_Informacion').css('display', 'none');
                            $('#div_principal_alertas_rojas').css('display', 'block');
                            _crear_tbl_alertas_rojas();
                            _search_alertas_rojas_por_filtros();
                            _set_location_toolbar();
                            _limpiar_controles();
                        }
                    }, {
                        label: 'Cancel',
                        className: 'btn-default',
                        callback: function () {
                        }
                    }]
                });
            } else {
                $('#div_Informacion').css('display', 'none');
                $('#div_principal_alertas_rojas').css('display', 'block');
                _limpiar_controles();
            }
        });
        $('#btn_guardar').on('click', function (e) {
            e.preventDefault();
            var destinatarios = "";
            bootbox.confirm({
                title: 'New Red Alert',
                message: 'Are you sure to save and authorize the alert?',
                callback: function (result) {
                    if (result) {
                        var output = _validar_datos();
                        if (output.Estatus) {
                            _actualizar_alerta_roja();
                            _limpiar_controles();
                            $('#div_Informacion').css('display', 'none');
                            $('#div_principal_alertas_rojas').css('display', 'block');
                            //_crear_tbl_alertas_rojas();
                            _mostrar_mensaje("Validation Report", "Red Alert successfully authorized.");
                        } else _mostrar_mensaje('Validation report', output.Mensaje);
                    }
                }
            });
        });
        $('#btn_guardar_comentarios').on('click', function (e) {
            e.preventDefault();
            var destinatarios = "";
            bootbox.confirm({
                title: 'New Comment',
                message: 'Are you sure to save the comment?',
                callback: function (result) {
                    if (result) {
                        var output = _validar_datos();

                        if ($('#txt_comentarios').val() == '' || $('#txt_comentarios').val() == undefined) {
                            _mostrar_mensaje('Validation report', 'The comment is a required data.');
                            return;
                        }
                        _comentar_alerta_roja();
                        _limpiar_controles();
                        $('#div_Informacion').css('display', 'none');
                        $('#div_principal_alertas_rojas').css('display', 'block');
                        _crear_tbl_alertas_rojas();
                        _search_alertas_rojas_por_filtros();
                        _set_location_toolbar();
                    }
                }
            });
        });
        $('#btn_regresar').on('click', function (e) { e.preventDefault(); window.location.href = '../Operacion/Frm_Ope_Autorizacion_Alertas.aspx'; });
        $('#btn_agregar_imagen_condicion_buena').on('click', function (e) {
            e.preventDefault();
            _agregar_anexos_condicion_buena();
        });
        $('#btn_agregar_imagen_condicion_mala').on('click', function (e) {
            e.preventDefault();
            _agregar_anexos_condicion_mala();
        });
        $('#modal_datos input[type=text]').each(function (index, element) {
            $(this).on('focus', function () {
                _remove_class_error('#' + $(this).attr('id'));
            });
        });
        $('#modal_datos select').each(function (index, element) {
            $(this).on('focus', function () {
                _remove_class_error('#' + $(this).attr('id'));
            });
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _agregar_tooltip() {
    _init_btn_config($('#btn_inicio'), 'Home', 'bottomRight');
    _init_btn_config($('#btn_salir'), 'Cancel Red Alert', 'bottomRight');
    _init_btn_config($('#btn_busqueda'), 'Search Red Alert', 'bottomRight');
}
function _init_btn_config(btn, text, alineacionTooltip) {
    $(btn).qtip({
        content: text,
        position: {
            corner: {
                target: 'topMiddle',
                tooltip: alineacionTooltip
            }
        },
        show: {
            when: { event: 'mouseover' },
            ready: false
        },
        hide: { event: 'mouseout' },
        style: {
            border: {
                width: 5,
                radius: 7
            },
            padding: 5,
            textAlign: 'center',
            tip: {
                corner: true,
                method: "polygon",
                border: 1,
                height: 20,
                width: 9
            },
            background: '#F5F6CE',
            color: '#2d2d30',
            width: 200,
            'font-size': 'small',
            'font-family': 'Calibri',
            'font-weight': 'Bold',
            tip: true,
            name: 'blue'
        }
    });
}
function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('select').each(function () { $(this).val(''); });
    $('input[type=checkbox]').each(function () { $(this).attr('checked', false) });
    $("#cmb_plantas").empty().trigger("change");;
    $("#cmb_unidades_negocio").empty().trigger("change");
    $("#cmb_productos").empty().trigger("change");
    $('#cmb_numero_partes').empty().trigger("change");
    $("#cmb_clientes").empty().trigger("change");
    $('#txt_referencia_productos').val('');
    $('#txt_sitios_clientes').val('');
    $('#txt_vehiculos').val('');
    $('#cmb_areas').empty().trigger("change");
    $('#cmb_turnos').empty().trigger("change");
    $('#cmb_estatus').empty().trigger("change");
    $('#txt_comentarios').val('');
    _validation_sumary(null);
}
function _formato(row) {
    if (!row.id) { return row.text; }
    else if (row.id == row.text) return row.text;

    var _salida = '<span style="text-transform:uppercase;">' +
        '&nbsp;&nbsp;&nbsp;<b> &nbsp;&nbsp;' + row.text + '</b>' +
        '&nbsp;&nbsp;<i class="glyphicon glyphicon-minus"></i>&nbsp;' + row.detalle_1 +
        '</span>';

    return $(_salida);
}
function _templateSelection(row) {
    if (!row.id) { return row.text; }
    else if (row.id == row.text) return row.text;

    var _salida = '<span style="text-transform:uppercase;">' +
       '&nbsp;&nbsp;&nbsp;<b>&nbsp;&nbsp;' + row.text + '</b>' +
       '&nbsp;&nbsp;<i class="glyphicon glyphicon-minus"></i>&nbsp;' + row.detalle_1 +
       '</span>';

    return $(_salida);
}
function _mostrar_mensaje(Titulo, Mensaje) {
    bootbox.dialog({
        message: Mensaje,
        title: Titulo,
        locale: 'en',
        closeButton: true,
        buttons: [{
            label: 'Close',
            className: 'btn-default',
            callback: function () { }
        }]
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
function _validar_datos() {
    var _output = new Object();

    try {
        _output.Estatus = true;
        _output.Mensaje = '';
        
        if ($('#txt_estatus_descripcion').val() == '' || $('#txt_estatus_descripcion').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Description is a required data.<br />';
        }
        if ($('#txt_estatus_partes_1').val() == '' || $('#txt_estatus_partes_1').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Number of rejected parts is a required data.<br />';
        }
        if ($('#txt_estatus_partes_2').val() == '' || $('#txt_estatus_partes_2').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Number of inspected parts is a required data.<br />';
        }
        if ($('#txt_estatus_partes_3').val() == '' || $('#txt_estatus_partes_3').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Number of produced parts is a required data.<br />';
        }
        if ($('#txt_estatus_partes_4').val() == '' || $('#txt_estatus_partes_4').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;Number of suspected parts is a required data.<br />';
        }
        if ($('#cmb_estatus_condicion_1').val() == '' || $('#cmb_estatus_condicion_1').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;"Corrective actions initiated?" is a required data.<br />';
        }
        if ($('#cmb_estatus_condicion_2').val() == '' || $('#cmb_estatus_condicion_2').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;"Customer afectation?" is a required data.<br />';
        }
        if ($('#cmb_estatus_condicion_3').val() == '' || $('#cmb_estatus_condicion_3').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;-&nbsp;"Other AAM plant afected?" is a required data.<br />';
        }
        if (_output.Mensaje != "")
            _output.Mensaje = "Please fill the next field(s): <br />" + _output.Mensaje;
    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    } finally {
        return _output;
    }
}
function _search_alertas_rojas_por_filtros() {
    var filtros = null;
    try {
        filtros = new Object();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Alertas_Rojas',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null && datos.d !== '') {
                    $('#tbl_alertas_rojas').bootstrapTable('load', JSON.parse(datos.d));
                    _agregar_tooltip_tabla();
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;
                    //if (JSON.parse(datos.d).length > 0)
                    //    $("#ctrl_panel").click();
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _crear_tbl_alertas_rojas() {
    try {
        $('#tbl_alertas_rojas').bootstrapTable('destroy');
        $('#tbl_alertas_rojas').bootstrapTable({
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
            clickToSelect: false,
            columns: [
                { field: 'No_Alerta_Roja', title: 'Red Alert Number', width: '10%', align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Planta', title: 'AAM Plant', width: '20%', align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Unidad_Negocio', title: 'Bussines Unit', width: '20%', align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                { field: 'Numero_Parte', title: 'Part Number', width: '20%', align: 'left', valign: 'bottom', sortable: true, clickToSelect: false },
                {
                    field: 'Aprobado', title: 'Authorized', width: '10%', align: 'left', valign: '', halign: 'left', sortable: true, clickToSelect: false, formatter: function (value, row) {
                        var color = '';
                        switch (value) {
                            case 'NO':
                                color = "rgba(221, 24, 24, 1)";
                                break;
                            case 'PENDING':
                                color = "yellow";
                                break;
                            case 'YES':
                                color = "green";
                                break;
                            default:
                                color = 'rgba(85, 171, 237, 1)';
                        }
                        return '<i class="fa fa-circle" style="color: ' + color + '"></i>&nbsp;' + value;
                    }
                },
                {
                    field: 'Estatus', title: 'Status', width: '10%', align: 'left', valign: '', halign: 'left', sortable: true, clickToSelect: false, formatter: function (value, row) {
                        var color = '';
                        switch (value) {
                            case 'CANCELED':
                                color = "black";
                                break;
                            case 'OPENED':
                                color = "yellow";
                                break;
                            case 'PROCESS':
                                color = 'rgba(85, 171, 237, 1)';
                                break;
                            case 'CLOSED':
                                color = "green";
                                break;
                            case 'REJECTED':
                                color = "rgba(221, 24, 24, 1)";
                                break;
                            case 'AUTHORIZED':
                                color = 'rgba(3, 251,16, 1)';
                                break;
                            default:
                                color = 'rgba(85, 171, 237, 1)';
                        }
                        return '<i class="fa fa-circle" style="color: ' + color + '"></i>&nbsp;' + value;
                    }
                },
                {
                  field: 'Autorizar', title: 'Authorize', align: 'center', width: '2%',
                  formatter: function (value, row) {
                    return '<div>' +
                                  '<a class="remove ml10 edit _editar_cambio" id="remove_' + row.No_Alerta_Roja + '" href="javascript:void(0)" data-alerta_roja=\'' + JSON.stringify(row) + '\' onclick="btn_autorizar_click(this);"><i class="glyphicon glyphicon-ok"  title=""></i></a>' +
                             '</div>';
                    }
                },
                   {
                       field: 'Rechazar', title: 'Refuse', align: 'center', width: '2%',
                       formatter: function (value, row) {
                           return '<div>' +
                                       '<a class="remove ml10 edit _editar_rechazar" id="remove_' + row.No_Alerta_Roja + '" href="javascript:void(0)" data-alerta_roja=\'' + JSON.stringify(row) + '\' onclick="btn_rechazar_click(this);"><i class="glyphicon glyphicon-remove" title=""></i></a>' +
                                  '</div>';
                       }
                   },
                    {
                        field: 'Comentar', title: 'Daily', align: 'center', width: '2%',
                        formatter: function (value, row) {
                            return '<div>' +
                                        '<a class="remove ml10 edit _editar_comentar" id="remove_' + row.No_Alerta_Roja + '" href="javascript:void(0)" data-alerta_roja=\'' + JSON.stringify(row) + '\' onclick="btn_comentar_click(this);"><i class="glyphicon glyphicon-pencil" title=""></i></a>' +
                                   '</div>';
                        }
                    },

                {
                  field: 'Visualizar', title: 'View', align: 'center', width: '2%',
                  formatter: function (value, row) {
                    return '<div>' +
                                '<a class="remove ml10 edit _ver_orden_cambio" id="remove_' + row.No_Alerta_Roja + '" href="javascript:void(0)" data-alerta_roja=\'' + JSON.stringify(row) + '\' onclick="btn_visualizar_click(this);"><i class="glyphicon glyphicon-eye-open" title=""></i></a>' +
                             '</div>';
                  }

                },
                  {
                      field: 'View', title: 'Report', align: 'center', width: '3%',
                      formatter: function (value, row) {
                          return '<div>' +
                                      '<a class="remove ml10 edit _visualizar" id="remove_' + row.No_Alerta_Roja + '" href="javascript:void(0)" data-alerta_roja=\'' + JSON.stringify(row) +
                                      '\' onclick="btn_visualizar_reporte_click(this);"><i class="glyphicon glyphicon-list-alt" title=""></i></a>' +
                                 '</div>';
                      }
                  }
            ]
        });
    } catch (e) {

    }
}
function _agregar_tooltip_tabla() {
    _init_tbl_btn_config('._editar_cambio', 'Authorize Alert', 'bottomLeft');
    _init_tbl_btn_config('._editar_rechazar', 'Refuse Alert', 'bottomLeft');
    _init_tbl_btn_config('._editar_comentar', 'Comment Alert', 'bottomLeft');
    _init_tbl_btn_config('._ver_orden_cambio', 'View Alert', 'bottomLeft');
    _init_tbl_btn_config('._visualizar', 'Alert Report', 'bottomLeft');
}
function btn_visualizar_click(renglon) {
    var row = $(renglon).data('alerta_roja');
    var Alerta = null;
    var isComplete = false;

    try {

        Alerta = new Object();

        Alerta.No_Alerta_Roja = row.No_Alerta_Roja;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Reporte_Alerta_Roja',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                Resultado = JSON.parse($result.d);

                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        validacion = true;
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);

                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje("Error", "No results found"); }
            }
        });

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
}

function _consultar_alertas_procesos(no_alerta) {
    var filtros = null;
    var datos_cb = null;
    try {
        filtros = new Object();
        filtros.No_Alerta_Roja = parseInt(no_alerta);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Alertas_Procesos',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_cb = JSON.parse(datos.d);

                    $('input[name=cb_procesos_criterios]').each(function () {
                        for (var indice = 0; indice < datos_cb.length; indice++) {
                            if ($(this).val() == datos_cb[indice].Proceso_Criterio_ID) {
                                $(this).attr('checked', true);
                            }
                            if (datos_cb[indice].Proceso_Criterio.indexOf("Other") > -1)
                                $('#txt_observacion_Otro').val(datos_cb[indice].Observaciones);
                        }
                    });
                }
            }
        });
    } catch (e) {

    }
}

function _cargar_formulario(renglon) {
    var row = $(renglon).data('alerta_roja');
    var Alerta = null;
    //_habilitar_controles('Modificar');

    try {
        _consultar_alertas_criterios(row.No_Alerta_Roja);
        _consultar_alertas_procesos(row.No_Alerta_Roja);
        _crear_tbl_comentarios();
        _consultar_tbl_comentarios(row.No_Alerta_Roja);

        Alerta = new Object();
        Alerta.No_Alerta_Roja = row.No_Alerta_Roja;
        if (row.Producto_ID != null)
            Alerta.Producto_ID = row.Producto_ID;
        if (row.Cliente_ID != null)
            Alerta.Cliente_ID = row.Cliente_ID;
        if (row.Area_ID != null)
            Alerta.Area_ID = row.Area_ID;
        if (row.Turno_ID != null)
            Alerta.Turno_ID = row.Turno_ID;
        if (row.Numero_Parte_ID != null)
            Alerta.Numero_Parte_ID = row.Numero_Parte_ID;


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Una_Alerta_Roja',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                var Resultado = JSON.parse($result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    $("#txt_no_alerta_roja").val(row.No_Alerta_Roja);
                    //$('#txt_numero_parte').val(Resultado[0].Numero_Parte);
                    $('#txt_numero_car').val(Resultado[0].Numero_CAR);

                    $("#cmb_estatus")[0].innerHTML = "";
                    $("#cmb_estatus").select2({ data: [{ id: row.Estatus_ID, text: row.Estatus }] });
                    $("#cmb_estatus").val(row.Estatus_ID).trigger("change");

                    $("#cmb_plantas")[0].innerHTML = "";
                    $("#cmb_plantas").select2({ data: [{ id: row.Planta_ID, text: row.Planta }] });
                    $("#cmb_plantas").val(row.Planta_ID).trigger("change");

                    $("#cmb_unidades_negocio")[0].innerHTML = "";
                    $("#cmb_unidades_negocio").select2({ data: [{ id: row.Unidad_Negocio_ID, text: row.Unidad_Negocio }] });
                    $("#cmb_unidades_negocio").val(row.Unidad_Negocio_ID).trigger("change");

                    if (Resultado[0].Producto != "") {
                        $("#cmb_productos")[0].innerHTML = "";
                        $("#cmb_productos").select2({ data: [{ id: row.Producto_ID, text: Resultado[0].Producto }] });
                        $("#cmb_productos").val(row.Producto_ID).trigger("change");
                    }
                    if (Resultado[0].Cliente != "") {
                        $("#cmb_clientes")[0].innerHTML = "";
                        $("#cmb_clientes").select2({ data: [{ id: row.Cliente_ID, text: Resultado[0].Cliente }] });
                        $("#cmb_clientes").val(row.Cliente_ID).trigger("change");
                    }
                    if (row.Numero_Parte_ID != null) {
                        if (Resultado[0].Numero_Parte != "") {
                            $("#cmb_numero_partes")[0].innerHTML = "";
                            $("#cmb_numero_partes").select2({ data: [{ id: row.Numero_Parte_ID, text: Resultado[0].Numero_Parte }] });
                            $("#cmb_numero_partes").val(row.Numero_Parte_ID).trigger("change");
                        }
                    } else {
                        $("#cmb_numero_partes")[0].innerHTML = "";
                        $("#cmb_numero_partes").select2({ data: [{ id: row.Numero_Parte, text: row.Numero_Parte }] });
                        $("#cmb_numero_partes").val(row.Numero_Parte).trigger("change");
                    }

                    $('#txt_referencia_productos').val(Resultado[0].Referencia_Producto);
                    $('#txt_sitios_clientes').val(Resultado[0].Sitio_Cliente);
                    $('#txt_vehiculos').val(Resultado[0].Vehiculo);
                    if (Resultado[0].Area != "") {
                        $("#cmb_areas")[0].innerHTML = "";
                        $("#cmb_areas").select2({ data: [{ id: row.Area_ID, text: Resultado[0].Area }] });
                        $("#cmb_areas").val(row.Area_ID).trigger("change");
                    }
                    if (Resultado[0].Turno != "") {
                        $("#cmb_turnos")[0].innerHTML = "";
                        $("#cmb_turnos").select2({ data: [{ id: row.Turno_ID, text: Resultado[0].Turno }] });
                        $("#cmb_turnos").val(row.Turno_ID).trigger("change");
                    }

                    $('#txt_descripcion_1').val(Resultado[0].Descripcion_1);
                    $('#txt_descripcion_2').val(Resultado[0].Descripcion_2);
                    $('#txt_descripcion_3').val(Resultado[0].Descripcion_3);
                    $('#txt_descripcion_4').val(Resultado[0].Descripcion_4);
                    $('#txt_descripcion_5').val(Resultado[0].Descripcion_5);
                    $('#txt_descripcion_6').val(Resultado[0].Descripcion_6);
                    $('#txt_descripcion_7').val(Resultado[0].Descripcion_7);
                    $('#imagen_condicion_buena').attr('src', Resultado[0].Condicion_Buena);
                    $('#imagen_condicion_mala').attr('src', Resultado[0].Condicion_Mala);

                    $('#txt_estatus_partes_1').val(Resultado[0].Estatus_Partes_1);
                    $('#txt_estatus_partes_2').val(Resultado[0].Estatus_Partes_2);
                    $('#txt_estatus_partes_3').val(Resultado[0].Estatus_Partes_3);
                    $('#txt_estatus_partes_4').val(Resultado[0].Estatus_Partes_4);
                    $('#txt_estatus_descripcion').val(Resultado[0].Estatus_Descripcion);
                    $('#cmb_estatus_condicion_1').val(Resultado[0].Estatus_Condicion_1);
                    $('#cmb_estatus_condicion_2').val(Resultado[0].Estatus_Condicion_2);
                    $('#cmb_estatus_condicion_3').val(Resultado[0].Estatus_Condicion_3);

                    if (row.Estatus == "CANCELED" || row.Estatus == "REJECTED") {
                        $("#lbl_observaciones").css('display', 'block');
                        $("#lbl_observaciones").html(Resultado[0].Observaciones);
                    }
                    else {
                        $("#lbl_observaciones").css('display', 'none');
                    }

                    _load_plantas('#cmb_plantas');
                    _load_unidades_negocio('#cmb_unidades_negocio');
                    _load_productos('#cmb_productos');
                    _load_clientes('#cmb_clientes');
                    _load_numero_partes('#cmb_numero_partes');
                    _load_areas('#cmb_areas');
                    _load_turnos('#cmb_turnos');
                    _load_estatus('#cmb_estatus');

                } else { _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje); }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _habilitar_controles(opcion) {
    $('#div_principal_alertas_rojas').css('display', 'none');
    $('#div_Informacion').css('display', 'none');
    switch (opcion) {
        case 'Inicial':
            $('#div_principal_alertas_rojas').css('display', 'block');
            break;
        case 'Nuevo':
            $('#div_Informacion').css('display', 'block');
            //$('#tbl_alertas_rojas').bootstrapTable('hideColumn', 'Modificar');
            break;
        case 'Modificar':
            $('#div_Informacion').css('display', 'block');
            $("#btn_guardar").css('display', 'inline-block');
            $("#btn_guardar_comentarios").css('display', 'none');
            $("#btn_salir").css('display', 'inline-block');
            $('#div_comentarios').css('display', 'none');
            $('#txt_comentarios').attr('disabled', true);
            $('#tbl_lista_comentarios').css('display', 'none');
            //$('#tbl_alertas_rojas').bootstrapTable('hideColumn', 'Modificar');
            _bloquear_controles('Autorizar');
            break;
        case 'Visualizar':
            $('#div_Informacion').css('display', 'block');
            $("#btn_salir").css('display', 'none');
            $("#btn_guardar").css('display', 'none');
            $("#btn_guardar_comentarios").css('display', 'none');
            $("#btn_regresar").css('display', 'block');
            $('#div_comentarios').css('display', 'block');
            $('#txt_comentarios').attr('disabled', true);
            $('#tbl_lista_comentarios').css('display', 'block');
            _bloquear_controles(opcion);
            break;
        case 'Comentar':
            $('#div_Informacion').css('display', 'block');
            $("#btn_salir").css('display', 'inline-block');
            $("#btn_guardar_comentarios").css('display', 'inline-block');
            $("#btn_guardar").css('display', 'none');
            $("#btn_regresar").css('display', 'none');
            $('#div_comentarios').css('display', 'block');
            $('#txt_comentarios').attr('disabled', false);
            $('#tbl_lista_comentarios').css('display', 'block');
            _bloquear_controles(opcion);
            break;
    }
}
function _bloquear_controles(opcion) {
    $('input[type=text]').each(function () { $(this).attr('disabled',true); });
    $('input[type=checkbox]').each(function () { $(this).attr('disabled', true) });
    $('input[type=file]').each(function () { $(this).attr('disabled', true) });
    $('select').each(function () { $(this).attr('disabled', true) });
    $('#btn_agregar_imagen_condicion_buena').attr('disabled', true);
    $('#btn_agregar_imagen_condicion_mala').attr('disabled', true);

    if (opcion == 'Autorizar') {
        $('#txt_estatus_partes_1').attr('disabled', false);
        $('#txt_estatus_partes_2').attr('disabled', false);
        $('#txt_estatus_partes_3').attr('disabled', false);
        $('#txt_estatus_partes_4').attr('disabled', false);
        $('#txt_estatus_descripcion').attr('disabled', false);
        $('#cmb_estatus_condicion_1').attr('disabled', false);
        $('#cmb_estatus_condicion_2').attr('disabled', false);
        $('#cmb_estatus_condicion_3').attr('disabled', false);
    }

}
function _consultar_alertas_criterios(no_alerta) {
    var filtros = null;
    var datos_cb = null;
    try {
        filtros = new Object();
        filtros.No_Alerta_Roja = parseInt(no_alerta);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Alertas_Criterios',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_cb = JSON.parse(datos.d);
                    $('input[name=cb_circunstancias]').each(function (index) {
                        for (var indice = 0; indice < datos_cb.length; indice++) {
                            if ($(this).val() == datos_cb[indice].Criterio_ID) {
                                $(this).attr('checked', true);
                                $('#div_procesos_' + $(this).val()).css('display', 'block');
                            }
                            if (datos_cb[indice].Criterio_ID == id_otro)
                                $('#txt_observacion_Otro').val(datos_cb[indice].Observaciones);
                        }
                    });
                }
            }
        });
    } catch (e) {

    }
}

function _actualizar_alerta_roja() {
    var Alerta = null;
    try {
        Alerta = new Object();
        Alerta.No_Alerta_Roja = parseInt($('#txt_no_alerta_roja').val());
        Alerta.Estatus_Partes_1 = parseInt($('#txt_estatus_partes_1').val());
        Alerta.Estatus_Partes_2 = parseInt($('#txt_estatus_partes_2').val());
        Alerta.Estatus_Partes_3 = parseInt($('#txt_estatus_partes_3').val());
        Alerta.Estatus_Partes_4 = parseInt($('#txt_estatus_partes_4').val());
        Alerta.Estatus_Descripcion = $('#txt_estatus_descripcion').val();
        Alerta.Estatus_Condicion_1 = $('#cmb_estatus_condicion_1').val();
        Alerta.Estatus_Condicion_2 = $('#cmb_estatus_condicion_2').val();
        Alerta.Estatus_Condicion_3 = $('#cmb_estatus_condicion_3').val();
        
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Actualizar_Alerta_Roja',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                var Resultado = JSON.parse($result.d);

                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        _inicializar_pagina();
                        _limpiar_controles();
                        _autorizar_alerta_roja(Alerta.No_Alerta_Roja);
                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje); }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function _init_tbl_btn_config(classCss, text, alineacionTooltip) {
    $(classCss).each(function () {
        $(this).qtip({
            content: text,
            position: {
                corner: {
                    target: 'topMiddle',
                    tooltip: alineacionTooltip
                }
            },
            show: {
                when: { event: 'mouseover' },
                ready: false
            },
            hide: { event: 'mouseout' },
            style: {
                border: {
                    width: 5,
                    radius: 7
                },
                padding: 5,
                textAlign: 'center',
                tip: {
                    corner: true,
                    method: "polygon",
                    border: 1,
                    height: 20,
                    width: 9
                },
                background: '#F5F6CE',
                color: '#2d2d30',
                width: 100,
                'font-size': 'small',
                'font-family': 'Calibri',
                'font-weight': 'Bold',
                tip: true,
                name: 'blue'
            }
        });
    });
}
function btn_rechazar_click(renglon) {
    var row = $(renglon).data('alerta_roja');
    if (row.Estatus.toUpperCase() == "CLOSED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; Unable to refuse a finished alert.");
        return;
    }
    if (row.Estatus.toUpperCase() == "CANCELED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; Unable to refuse a canceled alert.");
        return;
    }
    if (row.Estatus.toUpperCase() == "REJECTED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp;You cannot refuse an alert already refused.");
        return;
    }
    if (row.Estatus.toUpperCase() == "AUTHORIZED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp;You cannot refuse an alert already authorized.");
        return;
    }
    if (row.Aprobado.toUpperCase() == "YES") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp;You cannot refuse an alert already authorized.");
        return;
    }
    if (row.Aprobado.toUpperCase() == "NO") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp;You cannot refuse an alert already refused.");
        return;
    }
    bootbox.confirm({
        title: 'Red Alert',
        message: 'Are you sure to refuse the alert?',
        callback: function (result) {
            if (result) {
                bootbox.prompt('Describe the reason of the refuse.', function (result) {
                    _actualizar_observaciones_alerta(row.No_Alerta_Roja, result);
                    _rechazar_alerta_roja(row.No_Alerta_Roja);
                    _mostrar_mensaje("Validation Report", "<i class='fa fa-check'style = 'color: #00A41E;' ></ i > &nbsp;Red Alert successfully refused..");
                });
            }
        }
    });
}

function btn_comentar_click(renglon) {
    var row = $(renglon).data('alerta_roja');
    //if (row.Estatus.toUpperCase() == "CLOSED") {
    //    _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; Unable to comment a finished alert.");
    //    return;
    //}
    //if (row.Estatus.toUpperCase() == "CANCELED") {
    //    _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; Unable to comment a canceled alert.");
    //    return;
    //}
    //if (row.Estatus.toUpperCase() == "REJECTED") {
    //    _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle'style = 'color:#f2041a;' ></ i > &nbsp; You cannot comment an alert already refused .");
    //    return;
    //}
    debugger;
    var comentario_permitido = _validar_comentario(row.No_Alerta_Roja);
    if (comentario_permitido == "False") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle'style = 'color:#f2041a;' ></ i > &nbsp; You cannot comment this alert. Exceeds the maximum of comments.");
        return;
    }

    _consultar_tbl_comentarios(row.No_Alerta_Roja);
    _habilitar_controles('Comentar');
    _cargar_formulario(renglon);
}

function btn_autorizar_click(renglon) {
    var row = $(renglon).data('alerta_roja');
    if (row.Estatus.toUpperCase() == "CLOSED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; Unable to authoriza a finished alert.");
        return;
    }
    if (row.Estatus.toUpperCase() == "CANCELED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; Unable to authoriza a canceled alert.");
        return;
    }
    if (row.Estatus.toUpperCase() == "REJECTED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle'style = 'color:#f2041a;' ></ i > &nbsp; You cannot authorize an alert already refused .");
        return;
    }
    if (row.Estatus.toUpperCase() == "AUTHORIZED") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle'style = 'color:#f2041a;' ></ i > &nbsp; You cannot authorize an alert already authorized .");
        return;
    }
    if (row.Aprobado.toUpperCase() == "YES") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle'style = 'color:#f2041a;' ></ i > &nbsp; You cannot authorize an alert already authorized.");
        return;
    }
    if (row.Aprobado.toUpperCase() == "NO") {
        _mostrar_mensaje('Validation', "<i class='fa fa-exclamation-circle' style = 'color:#f2041a;' ></ i > &nbsp; You cannot authorize an alert already refused.");
        return;
    }

        bootbox.confirm({
            title: 'Red Alert',
            message: 'Are you sure to authorize the alert?',
            callback: function (result) {
                if (result) {
                    //validar si es usuario
                    //var usuario = _valida_usuarios();
                    //if (usuario == true) {
                    //    _mostrar_mensaje('Validation Report', 'Invalid user: unable to cancel the alert.');
                    //    return;
                    //}
                    _autorizar_alerta_roja(row.No_Alerta_Roja);
                    _mostrar_mensaje("Validation Report", "<i class='fa fa-check'style = 'color: #00A41E;' ></ i > &nbsp;Red Alert successfully authorized.");
                }
            }
        });
}
function _autorizar_alerta_roja(no_alerta_roja) {
    var Alerta = null;
    var isComplete = false;
    try {
        Alerta = new Object();
        Alerta.No_Alerta_Roja = parseInt(no_alerta_roja);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Autorizar_Alerta_Roja',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                Resultado = JSON.parse($result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        validacion = true;
                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje("Error", "Unable to get results"); }
            }
        });
        _search_alertas_rojas_por_filtros();
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
    return isComplete;
}
function _rechazar_alerta_roja(no_alerta_roja) {
    var Alerta = null;
    var isComplete = false;
    try {
        Alerta = new Object();
        Alerta.No_Alerta_Roja = parseInt(no_alerta_roja);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Rechazar_Alerta_Roja',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                Resultado = JSON.parse($result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        validacion = true;
                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje("Error", "Unable to get results"); }
            }
        });
        _search_alertas_rojas_por_filtros();
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
    return isComplete;
}

function _verifica_alerta(no_alerta) {
    var alerta = null;
    var datos_alerta;
    try {
        alerta = new Object();
        alerta.No_Alerta_Roja = parseInt(no_alerta);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(alerta) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Verificar_Alerta',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_alerta = JSON.parse(datos.d);
                }
            }
        });
        return datos_alerta.Mensaje;
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _actualizar_observaciones_alerta(no_alerta, result) {
    var alerta;
    try {
        alerta = new Object();
        alerta.No_Alerta_Roja = parseInt(no_alerta);
        alerta.Observaciones = result == null ? '' : result;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Actualizar_Observaciones_Alerta',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                Resultado = JSON.parse($result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        validacion = true;
                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje("Error", "Unable to get results"); }
            }
        });
        _search_alertas_rojas_por_filtros();
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

//function _comentar_alerta() {
//    var comentar;
//    debugger;
//    var validacion = false;
//    var Resultado;
//    comentar = new Object();
//    bootbox.confirm({
//        title: 'Comment',
//        message: 'Are you sure to comment the alert??',
//        callback: function (result) {
//            if (result) {
//                var no_alerta = $('#txt_no_alerta').val();
//                comentar.No_Alerta_Roja = parseInt(no_alerta);
//                comentar.Comentario = $('#txt_comentario_empleado').val();
//                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(comentar) });
//                $.ajax({
//                    type: 'POST',
//                    url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Comentar_Alerta',
//                    data: $data,
//                    contentType: "application/json; charset=utf-8",
//                    dataType: "json",
//                    async: false,
//                    cache: false,
//                    success: function ($result) {
//                        Resultado = JSON.parse($result.d);
//                        if (Resultado != null && Resultado != undefined && Resultado != '') {
//                            if (Resultado.Estatus == 'success') {
//                                validacion = true;
//                                debugger;
//                                _set_close_modal(true);
//                                jQuery('#modal_datos_comentarios').modal('hide');
//                                bootbox.confirm({
//                                    title: Resultado.Titulo,
//                                    message: Resultado.Mensaje,
//                                    callback: function (result) {
//                                        if (result) {
//                                        }
//                                        _search_alertas_rojas_por_filtros();
//                                    }
//                                });
//                            } else if (Resultado.Estatus == 'error') {
//                                _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
//                            }
//                        } else { _mostrar_mensaje("Error", "Unable to get results"); }
//                    }
//                });
//            }
//        }
//    });
//    _search_alertas_rojas_por_filtros();
//    return Resultado;
//}

//function _comentar_alerta(no_alerta, result) {
//    var alerta;
//    try {
//        alerta = new Object();
//        alerta.No_Alerta_Roja = parseInt(no_alerta);
//        alerta.Comentario = result == null ? '' : result;
//        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(alerta) });
//        $.ajax({
//            type: 'POST',
//            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Comentar_Alerta',
//            data: $data,
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            async: false,
//            cache: false,
//            success: function ($result) {
//                Resultado = JSON.parse($result.d);
//                if (Resultado != null && Resultado != undefined && Resultado != '') {
//                    if (Resultado.Estatus == 'success') {
//                        validacion = true;
//                    } else if (Resultado.Estatus == 'error') {
//                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
//                    }
//                } else { _mostrar_mensaje("Error", "Unable to get results"); }
//            }
//        });
//        _search_alertas_rojas_por_filtros();
//    } catch (e) {
//        _mostrar_mensaje('Technical Report', e);
//    }
//}


function _load_checkboxes() {
    var options = '';
    var Tipo_criterio = null;

    try {
        Tipo_criterio = new Object();
        Tipo_criterio.Descripcion = "Calidad";

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Tipo_criterio) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Criterios',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {

                if (datos !== null) {
                    var datos_criterios = $.parseJSON(datos.d);
                    var criterios_len = datos_criterios==null ? 0 : datos_criterios.length;
                    for (var Indice = 0; Indice < criterios_len; Indice++){
                        options += '<div class="row">';
                        options += '    <div class="col-md-12">';
                        options += '        <label class="fuente_lbl_controles">';
                        options += '            <input type="checkbox" id="circunstancia_' + datos_criterios[Indice].Criterio_ID + '" name="cb_circunstancias" value="' + datos_criterios[Indice].Criterio_ID + '"/>';
                        options += datos_criterios[Indice].Nombre;
                        options += '        </label>';
                        options += '    </div>';
                        options += '</div>';
                        options += '<div class="row" id="div_procesos_' + datos_criterios[Indice].Criterio_ID + '" style="display:none; margin-left:20px"></div>';
                        //if (datos_criterios[Indice].Nombre == "Otro") {
                        //    options += ' <div class="row">' +
                        //   '<div class="col-md-6 col-xs-6">' +
                        //   '<input id="txt_observacion_Otro" type="text" class="form-control" placeholder="Otro" disabled="true" />  ' +
                        //   '</div>'
                        //    options += '</div>'
                        //}
                    }
                    options += '&nbsp;';
                    $('#div_circunstancias').append(options);
                }
                _load_check_procesos();
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_check_procesos() {
    var options = '';
    var Tipo_criterio = null;

    try {
        Tipo_criterio = new Object();
        Tipo_criterio.Descripcion = "Calidad";

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Tipo_criterio) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Alertas_Rojas_Controller.asmx/Consultar_Procesos_Criterios',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_criterios = $.parseJSON(datos.d);
                    $('input[name=cb_circunstancias]').each(function (index) {
                        options = '';
                        for (var indice = 0; indice < datos_criterios.length; indice++) {
                            if ($(this).val() == datos_criterios[indice].Criterio_ID) {
                                options += '<div class="row col-md-12">';
                                options += '    <label class="fuente_lbl_controles">';
                                options += '        <input type="checkbox" id="proceso_criterio_' + datos_criterios[indice].Proceso_Criterio_ID +
                                    '" name="cb_procesos_criterios" value="' + datos_criterios[indice].Proceso_Criterio_ID + '"/>';
                                options += datos_criterios[indice].Nombre;
                                options += '    </label>';
                                options += '</div>';

                                if (datos_criterios[indice].Nombre.indexOf("Other") > -1) {
                                    options += '<div class="row col-md-6"> <input type="text" id="txt_observacion_Otro" class="form-control" disabled="disabled"/></div>';
                                    id_otro = datos_criterios[indice].Proceso_Criterio_ID;
                                }
                            }
                        }
                        $('#div_procesos_' + $(this).val()).append(options);
                    });

                }
                $("#proceso_criterio_" + id_otro).on('change', function () {
                    if ($(this).is(':checked')) {
                        $('#txt_observacion_Otro').attr('disabled', false);
                    } else {
                        $('#txt_observacion_Otro').attr('disabled', true);
                        $('#txt_observacion_Otro').val('');
                    }
                });
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function _load_estatus(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Status',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Estatus',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_plantas(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Plant',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Plantas',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
        $('#cmb_plantas').on("select2:select", function (evt) {
            var id = evt.params.data.id;

            if ($('#cmb_plantas :selected').val() !== '' || $('#cmb_plantas :selected').val() !== undefined) {
                var planta = new Object();
                planta.Planta_ID = parseInt($('#cmb_plantas :selected').val());
                //$('#txt_no_empleado').val('');
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(planta) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Unidades_Negocio_Filtro',
                    data: $data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null && datos !== undefined) {
                            datos_proceso = JSON.parse(datos.d);

                            $("#cmb_unidades_negocio").select2("trigger", "select", {
                                data: { id: datos_proceso[0].Unidad_Negocio_ID, text: datos_proceso[0].Nombre }
                            });
                        }
                    }
                });
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_unidades_negocio(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Bussines Unit',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Unidades_Negocio',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_productos(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Product',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Productos',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_turnos(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Related Shift',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Turnos',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_areas(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Area',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Areas',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_numero_partes(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Part Number',
            allowClear: true,
            tags: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Numero_Partes',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function _load_clientes(cmb) {
    try {
        $(cmb).select2({
            language: "es",
            theme: "classic",
            placeholder: 'Search Customer',
            allowClear: true,
            ajax: {
                url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Clientes',
                cache: "true",
                dataType: 'json',
                type: "POST",
                delay: 250,
                cache: true,
                params: {
                    contentType: 'application/json; charset=utf-8'
                },
                quietMillis: 100,
                results: function (data) {
                    return { results: data };
                },
                data: function (params) {
                    return {
                        q: params.term,
                        page: params.page
                    };
                },
                processResults: function (data, page) {
                    return {
                        results: data
                    };
                },
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function _load_estatus_activo() {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Estatus_Activo',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_estatus = $.parseJSON(datos.d);
                    estatusActivo = datos_estatus[0].Estatus;
                    estatusActivo_ID = datos_estatus[0].Estatus_ID;
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}
function btn_visualizar_click(alerta_roja) {
    var row = $(alerta_roja).data('alerta_roja');
    _habilitar_controles('Visualizar');
    _cargar_formulario(alerta_roja);
    //_mostrar_cambio_proceso(row.No_Alerta_Roja);
}
function _eventos_textbox() {
    $('#txt_estatus_partes_1').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9()\u0020\-]+$/) ? $(this).val() : '');
    });
    $('#txt_estatus_partes_2').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9()\u0020\-]+$/) ? $(this).val() : '');
    });
    $('#txt_estatus_partes_3').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9()\u0020\-]+$/) ? $(this).val() : '');
    });
    $('#txt_estatus_partes_4').on('blur', function () {
        $(this).val($(this).val().match(/^[0-9()\u0020\-]+$/) ? $(this).val() : '');
    });
}
function _estado_inicial_checkboxes() {
    $('input [name=cb_circunstancias]').each(function () {
        if ($(this).is(':checked')) {
            $('#div_procesos_' + $(this).val()).css('display', 'block');
        }
        else {
            $('#div_procesos_' + $(this).val()).css('display', 'none');
        }
    });
}
function btn_visualizar_reporte_click(renglon) {
    var row = $(renglon).data('alerta_roja');
    var Alerta = null;
    var isComplete = false;

    try {

        Alerta = new Object();

        Alerta.No_Alerta_Roja = row.No_Alerta_Roja;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Reporte_Alerta_Roja',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                Resultado = JSON.parse($result.d);

                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        validacion = true;
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);

                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje("Error", "No results found"); }
            }
        });

    } catch (e) {
        _mostrar_mensaje('Technical report', e);
    }
    return isComplete;
}


function _validar_nivel() {
    var filtros = null;
    var datos_emp;
    try {
        filtros = new Object();
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Nivel',
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
        _mostrar_mensaje('Technical Report', e);
    }
}

function _crear_tbl_comentarios() {
    try {
        $('#tbl_lista_comentarios').bootstrapTable('destroy');
        $('#tbl_lista_comentarios').bootstrapTable({
            idField: 'No_Alerta_Roja_Comentario_Detalles',
            uniqueId: 'No_Alerta_Roja_Comentario_Detalles',
            method: 'POST',
            async: false,
            cache: false,
            striped: true,
            pagination: true,
            pageSize: 10,
            pageList: [200],
            smartDysplay: false,
            search: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            editable: true,
            columns: [
                { field: 'No_Alerta_Roja_Comentario_Detalles', title: '', align: 'center', valign: 'bottom', sortable: false, visible: false },
                { field: 'No_Alerta_Roja', title: 'Red Alert Number', width: '10%', align: 'left', sortable: false, visible: false },
                { field: 'Usuario_Creo', title: 'Responsable', width: '10%', align: 'left', sortable: false, visible: true },
                {field: 'Fecha_Creo', title:'Date', width:'10%', align:'left', sortable:false, visible:true},
                { field: 'Comentario', title: 'Commentary', width: '80%', align: 'left', sortable: false, visible: true },
            ],
            onLoadSuccess: function (data) {
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'Error al crear la tabla');
    }
}

function _consultar_tbl_comentarios(no_alerta) {
    var filtros = null;
    try {
        filtros = new Object();
        filtros.No_Alerta_Roja = parseInt(no_alerta);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Comentarios',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    $('#tbl_lista_comentarios').bootstrapTable('load', JSON.parse(datos.d));
                }
               
            }
        });

    } catch (e) {

    }
}
// consulta el comentario por empleado y lo coloca en el textarea de comentarios
//function _consultar_comentario_empleado(no_alerta) {
//    var filtros = null;
//    try {
//        filtros = new Object();
//        filtros.No_Alerta_Roja = parseInt(no_alerta);
//        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
//        jQuery.ajax({
//            type: 'POST',
//            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Consultar_Comentario_Por_Empleado',
//            data: $data,
//            contentType: "application/json; charset=utf-8",
//            dataType: "json",
//            async: false,
//            cache: false,
//            success: function ($datos) {
//                var Resultado = JSON.parse($datos.d);
//                if (Resultado != null && Resultado != undefined && Resultado != '') {
//                    debugger;
//                   $('#txt_comentario_empleado').val(Resultado[0].Comentario);
//                }
//                else {
//                    $('#txt_comentario_empleado').val('');
//                }
//            }
//        });
//    } catch (e) {
//    }
//}

//function _modal_comentarios() {
//    debugger;
//    var tags = '';
//    try {
//        tags += '<div class="modal fade" id="modal_datos_comentarios" name="modal_datos_comentarios" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">';
//        tags += '<div class="modal-dialog modal-lg">';
//        tags += '<div class="modal-content">';
//        tags += '<div class="modal-header">';
//        tags += '<button type="button" class="close cancelar" data-dismiss="modal" aria-label="Close" onclick="_set_close_modal(true);"><i class="fa fa-times"></i></button>';
//        tags += '<h4 class="modal-title" id="myModalLabel">';
//        tags += '<label id="lbl_titulo">Comment</label>';
//        tags += '</h4>';
//        tags += '</div>';
//        tags += '<div class="modal-body">';
//        tags += '<div class="row">';
//        tags += '    <div class="col-md-12"> ';
//        tags += '        <label class="fuente_lbl_controles">Comment</label>';
//        tags += '         <textarea  id="txt_comentario_empleado" class="form-control input-sm" rows="10"  data-parsley-required="true"  style="min-height: 50px !important;"></textarea>';
//        tags += '        <input type="hidden" id="txt_no_alerta"/>';
//        tags += '        <input type="hidden" id="txt_no_empleado"/>';
//        tags += '    </div>';
//        tags += '    <div class="col-sm-12">';
//        tags += '    </div>';
//        tags += '</div>';
//        tags += '<div class="modal-footer">';
//        tags += '<div class="row">';
//        tags += '<div class="col-md-7">';
//        tags += '<div id="sumary_error" class="alert alert-danger text-left" style="width: 277.78px !important; display:none;">';
//        tags += '<label id="lbl_msg_error"/>';
//        tags += '</div>';
//        tags += '</div>';
//        tags += '<div class="col-md-5">';
//        tags += '<div class="form-inline">';
//        tags += '<button type="submit" class="btn btn-info btn-icon btn-icon-standalone btn-xs" id="btn_comentar_alerta" title="Save"><i class="fa fa-check"></i><span>Save</span></button>';
//        tags += '<button type="button" class="btn btn-danger btn-icon btn-icon-standalone btn-xs cancelar" data-dismiss="modal" id="btn_cancelar" aria-label="Close" onclick="_set_close_modal(true);" title="Cancel"><i class="fa fa-remove"></i><span>Cancel</span></button>';
//        tags += '</div>';
//        tags += '</div>';
//        tags += '</div>';
//        tags += '</div>';
//        tags += '</div>';
//        tags += '</div>';
//        tags += '</div>';
//        $(tags).appendTo('body');
//        $('#btn_comentar_alerta').bind('click', function (e) {
//            e.preventDefault();
//            if ($('#txt_no_alerta').val() != null && $('#txt_no_alerta').val() != undefined && $('#txt_no_alerta').val() != '') {
//                var _output = _validation_comment();
//                if (_output.Estatus) {
//                    debugger;
//                    _comentar_alerta();
//                } else {
//                    _set_close_modal(false);
//                }
//            }
//        });
//    } catch (e) {
//        _mostrar_mensaje('Informe técnico', e);
//    }
//}

function _set_close_modal(state) {
    closeModal = state;
}

//function _validation_comment() {
//    var _output = new Object();
//    _output.Estatus = true;
//    _output.Mensaje = '';
//    if (!$('#txt_comentario_empleado').parsley().isValid()) {
//        _add_class_error('#txt_comentario_empleado');
//        _output.Estatus = false;
//        _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;The commentary is requi.<br />';
//    }
//    if (!_output.Estatus) _validation_sumary(_output);
//    return _output;
//}

function _add_class_error(selector) {
    $(selector).addClass('alert-danger');
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

function _comentar_alerta_roja() {
    var Alerta = null;
    try {
        Alerta = new Object();
        var no_alerta = $('#txt_no_alerta_roja').val();
        Alerta.No_Alerta_Roja = parseInt(no_alerta);

        debugger;
        var comentario = '[';
        comentario += '{"Comentario":"' + $('#txt_comentarios').val() + '"},';
        if (comentario[comentario.length - 1] == ',') {
            comentario = comentario.slice(0, comentario.length - 1);
        }
        comentario += ']';

        Alerta.Datos_Detalles_Comentarios = comentario;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Comentar_Alerta',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                var Resultado = JSON.parse($result.d);

                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    if (Resultado.Estatus == 'success') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                        _inicializar_pagina();
                        _limpiar_controles();
                    } else if (Resultado.Estatus == 'error') {
                        _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje);
                    }
                } else { _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje); }
            }
        });
        return true;
    } catch (ex) {
        _mostrar_mensaje("Informe T&eacute;cnico", ex);
    }
}

function _validar_comentario(no_alerta) {
    var filtros = null;
    var datos_emp;
    try {
        filtros = new Object();
        filtros.No_Alerta_Roja = parseInt(no_alerta);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Autorizacion_Alertas_Controller.asmx/Validar_Total_Comentarios',
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
        _mostrar_mensaje('Technical Report', e);
    }
}