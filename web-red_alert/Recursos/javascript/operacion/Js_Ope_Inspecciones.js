var $table = null;
var closeModal = true;
var estatusActivo = '';
var estatusActivo_ID = 0;
var p;
var noinspeccion = 0;
var id_otro = 0;
var id_18 = 0;


$(document).on('ready', function () {
    _inicializar_pagina();
    $table = $('#tbl_inspecciones');
    _limpiar_controles();
    _set_location_toolbar();
    _eventos();
    //cargar_acciones();

    try {
        //Obtener el numero de orden
        objURI = new URI(window.location.href);

        //Obtener la cadena del query string
        objParametros = objURI.search(true);

        //verificar si no es nulo
        if (objParametros != null) {
            //Obtener el numero de la orden de produccion
            noinspeccion = parseInt(objParametros.Inspeccion_ID);
            //Llenar los detalles de la orden de produccion
            //_search_inspeccion();
        }
    } catch (ex) {
        _mostrar_mensaje("Technical Report", ex.message);
    }
});

function _inicializar_pagina() {
    try {
        _estado_inicial();
        _agregar_tooltip();
        _agregar_tooltip_tabla();
        _crear_tbl_inspecciones();
        _crear_tbl_acciones();
        _habilitar_controles('Inicial');
        _set_location_toolbar();
        _search_inspecciones_por_filtros();
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function _eventos() {
    try {      
        $('#btn_nuevo').on('click', function (e) {
            var ruta = null;         
            $('#btn_guardar').css('display', 'inline-block');
            $('#btn_salir').css('display', 'inline-block');          
            $('#div_Informacion').css('display', 'block');
            $('#div_principal_alertas_rojas').css('display', 'none');
            _limpiar_controles();
         
        });
        $('#btn_inicio').on('click', function (e) { e.preventDefault(); window.location.href = '../Paginas_Generales/Frm_Apl_Principal.aspx'; });
        $('#btn_busqueda').on('click', function (e) {
            _search();
        });
        $('#btn_salir').on('click', function (e) {
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
                            _search_inspecciones_por_filtros();
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
                message: 'Are you sure to save the alert?',
                callback: function (result) {
                    if (result) {
                        var output = _validar_datos();
                        if (output.Estatus) {

                            //if ($('#txt_no_alerta_roja').val() == '')
                            //    _guardar_alerta_roja();
                            //else
                            //    _actualizar_alerta_roja();
                            //_limpiar_controles();
                            //$('#div_Informacion').css('display', 'none');
                            //$('#div_principal_alertas_rojas').css('display', 'block');
                            //_crear_tbl_alertas_rojas();
                            //_search_alertas_rojas_por_filtros();
                            //_set_location_toolbar();

                        } else _mostrar_mensaje('Validation report', output.Mensaje);
                    }
                }
            });
        });
    
        $('#btn_regresar').on('click', function (e) { e.preventDefault(); window.location.href = '../Operacion/Frm_Ope_Inspecciones.aspx'; });
       
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function _estado_inicial() {

    $('#dtp_fecha_inicio_cambio').datetimepicker({
        defaultDate: new Date(),
        viewMode: 'days',
        locale: 'es',
        format: "DD/MM/YYYY"
    });

    $("#dtp_fecha_inicio_cambio").datetimepicker("useCurrent", true);
}

function _agregar_tooltip() {
    _init_btn_config($('#btn_nuevo'), 'Nueva Inspección', 'bottomRight');
    _init_btn_config($('#btn_inicio'), 'Home', 'bottomRight');
    _init_btn_config($('#btn_salir'), 'Cancelar Inspección', 'bottomRight');
    _init_btn_config($('#btn_guardar'), 'Guadar Inspección', 'bottomRight');
    _init_btn_config($('#btn_busqueda'), 'Buscar Inspección', 'bottomRight');
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

function _agregar_tooltip_tabla() {
    //_init_tbl_btn_config('._editar_cambio', 'Edit Alert', 'bottomRight');
    //_init_tbl_btn_config('._editar_cancelar', 'Cancel Alert', 'bottomRight');
    //_init_tbl_btn_config('._editar_comentar', 'Comment Alert', 'bottomLeft');
    _init_tbl_btn_config('._ver_inspeccion', 'Ver Inspección', 'bottomRight');
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

function _crear_tbl_inspecciones() {
    try {
        $('#tbl_inspecciones').bootstrapTable('destroy');
        $('#tbl_inspecciones').bootstrapTable({
            cache: false,
            striped: true,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            //search: true,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            clickToSelect: false,
            columns: [
                { field: 'Inspeccion_ID', title: 'Inspección ID', width: '10%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                { field: 'Dispositivo', title: 'Dispositivo', width: '20%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                { field: 'Fecha_Creo', title: 'Fecha', width: '20%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                { field: 'Dispositivo_ID', title: 'UUID', width: '10%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                  {
                     field: 'Visualizar', title: 'Visualizar', align: 'center', width: '2%',
                     formatter: function (value, row) {
                         return '<div>' +
                                     '<a class="remove ml10 edit _ver_inspeccion" id="remove_' + row.Inspeccion_ID + '" href="javascript:void(0)" data-inspeccion=\'' + JSON.stringify(row) + '\' onclick="btn_visualizar_inspeccion(this);"><i class="glyphicon glyphicon-eye-open" title=""></i></a>' +
                                  '</div>';
                     }

                 }             
            ]
        });
    } catch (e) {

    }
} 

function parseDateIntercambiarDiaMes(dateString) {
    //Intercambia el dia y el mes de los formatos de fecha( DD/MM/YYYY o MM/DD/YYYY )
    var dateTime = dateString.split(" ");
    var dateOnly = dateTime[0];
    var dates = dateOnly.split("/");
    var temp = dates[1] + "/" + dates[0] + "/" + dates[2];
    return temp;
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
            $('#txt_comentarios').attr('disabled', true);
            $("#btn_guardar_comentarios").css('display', 'none');
            $("#btn_guardar").css('display', 'inline-block');
            $("#btn_salir").css('display', 'inline-block');
            $('#div_comentarios').css('display', 'none');
            $('#txt_comentarios').attr('disabled', true);
            $('#tbl_lista_comentarios').css('display', 'none');
            break;
        case 'Modificar':
            $('#div_Informacion').css('display', 'block');
            $("#btn_guardar").css('display', 'inline-block');
            $("#btn_guardar_comentarios").css('display', 'none');
            $("#btn_salir").css('display', 'inline-block');
            $('#div_comentarios').css('display', 'none');
            $('#txt_comentarios').attr('disabled', true);
            $('#tbl_lista_comentarios').css('display', 'none');
           
            break;
        case 'Visualizar':
            $('#div_Informacion').css('display', 'block');
            $("#btn_salir").css('display', 'none');
            $("#btn_guardar").css('display', 'none');
            $("#btn_guardar_comentarios").css('display', 'none');
            $("#btn_regresar").css('display', 'block');       
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
    $('input[type=text]').each(function () { $(this).attr('disabled', true); });
    $('input[type=checkbox]').each(function () { $(this).attr('disabled', true) });
    $('input[type=file]').each(function () { $(this).attr('disabled', true) });
    $('select').each(function () { $(this).attr('disabled', true) });
}

function _set_location_toolbar() {
    $('#toolbar').parent().removeClass("pull-left");
    $('#toolbar').parent().addClass("pull-right");
}

function _limpiar_controles() {
    $('input[type=text]').each(function () { $(this).val(''); });
    $('input[type=checkbox]').each(function () { $(this).attr('checked', false) });
    $('select').each(function () { $(this).val(''); });
    _validation_sumary(null);
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

function _search() {
    var filtros = null;
    try {
        filtros = new Object();
        debugger;
        if ($.trim($('#txt_busqueda_por_no_inspeccion').val()) !== '')
            filtros.Inspeccion_ID = parseInt($('#txt_busqueda_por_no_inspeccion').val());
        if ($.trim($('#txt_busqueda_por_dispositivo').val()) !== '')
            filtros.Dispositivo_ID = $('#txt_busqueda_por_dispositivo').val();
        if ($.trim($('#txt_busqueda_por_codigo').val()) !== '')
            filtros.Codigo_Barras = $('#txt_busqueda_por_codigo').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Inspecciones_Controller.asmx/Ver_Inspeccion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    $('#tbl_inspecciones').bootstrapTable('load', JSON.parse(datos.d));
                    _agregar_tooltip_tabla();
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}


function _search_inspecciones_por_filtros() {
    var filtros = null;
    try {
        filtros = new Object();
        debugger;
        if ($.trim($('#txt_busqueda_por_no_inspeccion').val()) !== '')
            filtros.Inspeccion_ID = parseInt($('#txt_busqueda_por_no_inspeccion').val());
        if ($.trim($('#txt_busqueda_por_dispositivo').val()) !== '')
            filtros.Dispositivo_ID = $('#txt_busqueda_por_dispositivo').val();
        if ($.trim($('#txt_busqueda_por_codigo').val()) !== '')
            filtros.Codigo_Barras = $('#txt_busqueda_por_codigo').val();
        
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Inspecciones_Controller.asmx/Consultar_Inspecciones',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    $('#tbl_inspecciones').bootstrapTable('load', JSON.parse(datos.d));
                    _agregar_tooltip_tabla();
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function btn_visualizar_inspeccion(inspeccion) {
    var row = $(inspeccion).data('inspeccion');
    _habilitar_controles('Visualizar');
    _cargar_formulario(inspeccion);
   
}

function _cargar_formulario(renglon) {
    var row = $(renglon).data('inspeccion');
    var Alerta = null;

    try {
       
        Alerta = new Object();
        Alerta.Inspeccion_ID = row.Inspeccion_ID;

        _consultar_tbl_acciones(row.Inspeccion_ID);
        _consultar_ubicacion(row.Inspeccion_ID);
       
        

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Inspecciones_Controller.asmx/Consultar_Una_Inspeccion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                var Resultado = JSON.parse($result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    $("#txt_inspeccion_id").val(parseInt(Resultado[0].Inspeccion_ID));
                    $("#txt_dispositivo_id").val(Resultado[0].Dispositivo_ID);
                    $("#txt_latitud").val(Resultado[0].Latitud);
                    $("#txt_longitud").val(Resultado[0].Longitud);
                    $("#txt_nivel_bateria").val(Resultado[0].Nivel_Bateria);
                    $("#txt_codigo_barras").val(Resultado[0].Codigo_Barras);
                    $('#txt_dispositivo').val(Resultado[0].Dispositivo);
                    $('#f_inicio').val(Resultado[0].Fecha_Creo);
                   
                } else { _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje); }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}



function _crear_tbl_acciones() {
    try {
        $('#tbl_lista_acciones').bootstrapTable('destroy');
        $('#tbl_lista_acciones').bootstrapTable({
            idField: 'Accion_ID',
            uniqueId: 'Accion_ID',
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
                { field: 'Accion_ID', title: '', align: 'center', valign: 'bottom', sortable: false, visible: false },
                { field: 'Accion', title: 'Acciones', width: '10%', align: 'left', sortable: false, visible: true },
                { field: 'Tipo', title: 'Tipo', width: '10%', align: 'left', sortable: false, visible: true },
                {
                    field: 'Fecha', title: 'Fecha', width: '10%', align: 'left', sortable: false, visible: true, formatter: function (value,
                      row) { return parseDateIntercambiarDiaMes(value); }
                },
                 {
                     field: 'Estatus', title: 'Correcto/Realizado', align: 'left', valign: 'bottom', formatter: function (value, row) {
                         return '<input type="radio" value="1" id="rd_accion_' + row.Accion_ID + '_1" ' + ( row.Estatus == 1 ? ' checked ': '' ) + ' />';
                         
                     }
                 },
                 {
                     field: 'Estatus', title: 'Incorrecto', align: 'left', valign: 'bottom', formatter: function (value, row) {
                         return '<input  type="radio" value="2" id="rd_accion_' + row.Accion_ID + '_2" ' + (row.Estatus == 2 ? ' checked ': '' ) + ' />';
                       
                     }
                 },
                 {
                     field: 'Estatus', title: 'No Aplica', align: 'left', valign: 'bottom', formatter: function (value, row) {
                         return '<input type="radio" value="3" id="rd_accion_' + row.Accion_ID + '_3" ' + (row.Estatus == 3 ? ' checked ': '' ) + ' />';
                       
                     }
                 },
              
                { field: 'Observaciones', title: 'Observaciones', width: '80%', align: 'left', sortable: false, visible: true },
            ],
            onLoadSuccess: function (data) {
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'Error al crear la tabla');
    }
}




function _consultar_tbl_acciones(no_inspeccion) {
    var filtros = null;
    try {
        filtros = new Object();
        filtros.Inspeccion_ID = parseInt(no_inspeccion);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Inspecciones_Controller.asmx/Consultar_Acciones',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_cb = JSON.parse(datos.d);
                    $('#tbl_lista_acciones').bootstrapTable('load', JSON.parse(datos.d));
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;
                    
                }

            }
        });

    } catch (e) {

    }
}




function _consultar_ubicacion(no_inspeccion) {   
    var filtros = null;
    try {

        filtros = new Object();
        filtros.Inspeccion_ID = parseInt(no_inspeccion);
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        debugger;
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Inspecciones_Controller.asmx/Consultar_Ubicacion_Inspeccion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {

                    var ruta = $.parseJSON(datos.d);                 
                    var ubicacion;

                    for (var Indice = 0; Indice < ruta.length; Indice++) {

                       ubicacion = { lat: parseFloat(ruta[Indice].Latitud), lng: parseFloat(ruta[Indice].Longitud) };
                      
                    }
                }
                debugger;
                iniciar(ubicacion);
            }

        });

    } catch (e) {

    }

}


var mapa;

function iniciar(inspeccion) {

    var origen = {
        lat: 20.686216,
        lng: -101.354958
    };

    var div = document.getElementById('divmapa')
    mapa = new google.maps.Map(div, {
        center:inspeccion,
        zoom: 16
    });

    var ubicacion = inspeccion;

    marker = new google.maps.Marker({
        position: ubicacion,
        animation: google.maps.Animation.BOUNCE,
        map: mapa
    });

}