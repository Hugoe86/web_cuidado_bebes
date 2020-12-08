var $table = null;
var closeModal = true;
var estatusActivo = '';
var estatusActivo_ID = 0;
var p;
var noreproduccion = 0;
var id_otro = 0;
var id_18 = 0;


$(document).on('ready', function () {
    _inicializar_pagina();
    $table = $('#tbl_reproducciones');
    _limpiar_controles();
    _set_location_toolbar();
    _eventos();
 

    try {
        //Obtener el numero de orden
        objURI = new URI(window.location.href);

        //Obtener la cadena del query string
        objParametros = objURI.search(true);

        //verificar si no es nulo
        if (objParametros != null) {
            //Obtener el numero de la orden de produccion
            noreproduccion = parseInt(objParametros.folio_reproduccion);
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
        _crear_tbl_reproducciones();
        _crear_tbl_detalles();
        _habilitar_controles('Inicial');
        _set_location_toolbar();
        _search_reproducciones_por_filtros();
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
        $('#btn_inicio').on('click', function (e) { e.preventDefault(); window.location.href = '../Operacion/Frm_Ope_Reproducciones.aspx'; });
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
                           // _crear_tbl_alertas_rojas();
                            _search_reproducciones_por_filtros();
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

        $('#btn_regresar').on('click', function (e) { e.preventDefault(); window.location.href = '../Operacion/Frm_Ope_Reproducciones.aspx'; });

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
    _init_btn_config($('#btn_busqueda'), 'Buscar Reproducción', 'bottomRight');
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
    _init_tbl_btn_config('._ver_reproduccion', 'Ver Reproducción', 'bottomRight');
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

function _crear_tbl_reproducciones() {
    try {
        $('#tbl_reproducciones').bootstrapTable('destroy');
        $('#tbl_reproducciones').bootstrapTable({
            cache: false,
            striped: true,
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            clickToSelect: false,
            columns: [
                { field: 'folio_reproduccion', title: 'Folio Reproducción', width: '10%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                { field: 'Video', title: 'Video', width: '20%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                { field: 'Fecha_Creo', title: 'Fecha', width: '20%', align: 'left', valign: 'bottom', sortable: false, clickToSelect: false },
                  {
                      field: 'Visualizar', title: 'Visualizar', align: 'center', width: '2%',
                      formatter: function (value, row) {
                          return '<div>' +
                                      '<a class="remove ml10 edit _ver_reproduccion" id="remove_' + row.folio_reproduccion + '" href="javascript:void(0)" data-reproduccion=\'' + JSON.stringify(row) + '\' onclick="btn_visualizar_reproduccion(this);"><i class="glyphicon glyphicon-eye-open" title=""></i></a>' +
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
      
        if ($.trim($('#txt_busqueda_por_no_reproduccion').val()) !== '')
            filtros.Reproduccion_ID = parseInt($('#txt_busqueda_por_no_reproduccion').val());
        if ($.trim($('#txt_busqueda_por_video').val()) !== '')
            filtros.Video = $('#txt_busqueda_por_video').val();
        if ($.trim($('#txt_busqueda_por_folio').val()) !== '')
            filtros.folio_reproduccion = $('#txt_busqueda_por_folio').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Reproducciones.asmx/Ver_Reproduccion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    $('#tbl_reproducciones').bootstrapTable('load', JSON.parse(datos.d));
                    _agregar_tooltip_tabla();
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}


function _search_reproducciones_por_filtros() {
    var filtros = null;
    try {
        filtros = new Object();
        debugger;
        if ($.trim($('#txt_busqueda_por_no_reproduccion').val()) !== '')
            filtros.Reproduccion_ID = parseInt($('#txt_busqueda_por_no_reproduccion').val());
        if ($.trim($('#txt_busqueda_por_video').val()) !== '')
            filtros.Video = $('#txt_busqueda_por_video').val();
        if ($.trim($('#txt_busqueda_por_folio').val()) !== '')
            filtros.folio_reproduccion = $('#txt_busqueda_por_folio').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Reproducciones.asmx/Consultar_Reproducciones',         
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    $('#tbl_reproducciones').bootstrapTable('load', JSON.parse(datos.d));
                    _agregar_tooltip_tabla();
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}

function btn_visualizar_reproduccion(reproduccion) {
    var row = $(reproduccion).data('reproduccion');
    _habilitar_controles('Visualizar');
    _consultar_tbl_detalles(row.folio_reproduccion);
   // _consultar_ubicacion(row.folio_reproduccion);
    _consultar_ruta(row.folio_reproduccion);
   
}

function _cargar_formulario(renglon) {
    var row = $(renglon).data('reproduccion');
    var Alerta = null;

    try {

        Alerta = new Object();
        Alerta.folio_reproduccion = row.folio_reproduccion;

        _consultar_tbl_detalles(row.folio_reproduccion);
        // _consultar_ubicacion(row.folio_reproduccion);
        _consultar_ruta(row.folio_reproduccion);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(Alerta) });
        $.ajax({
            type: 'POST',
            url: 'controllers/Ope_Reproducciones.asmx/Consultar_Una_Reproduccion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function ($result) {
                var Resultado = JSON.parse($result.d);
                if (Resultado != null && Resultado != undefined && Resultado != '') {
                    $("#txt_reproduccion_id").val(parseInt(Resultado[0].Reproduccion_ID));
                    $("#txt_video").val(Resultado[0].Video);
                    $("#txt_latitud").val(Resultado[0].Latitud);
                    $("#txt_longitud").val(Resultado[0].Longitud);
                    $("#txt_folio").val(Resultado[0].folio_reproduccion);
                    $('#f_inicio').val(Resultado[0].Fecha_Creo);

                } else { _mostrar_mensaje(Resultado.Titulo, Resultado.Mensaje); }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Technical Report', e);
    }
}



function _crear_tbl_detalles() {
    try {
        $('#tbl_lista_detalles').bootstrapTable('destroy');
        $('#tbl_lista_detalles').bootstrapTable({
            idField: 'folio_reproduccion',
            uniqueId: 'folio_reproduccion',
            method: 'POST',
            async: false,
            cache: false,
            striped: true,
            pagination: true,
            pageSize: 5,
            pageList: [200],
            smartDysplay: false,
            search: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            editable: true,
            columns: [
                { field: 'folio_reproduccion', title: '', align: 'center', valign: 'bottom', sortable: false, visible: false },
                { field: 'Video', title: 'Video', width: '10%', align: 'left', sortable: false, visible: true },
                { field: 'Latitud', title: 'Latitud', width: '10%', align: 'left', sortable: false, visible: true },
                { field: 'Longitud', title: 'Longitud', width: '10%', align: 'left', sortable: false, visible: true },
                { field: 'Fecha_Creo', title: 'Fecha', width: '10%', align: 'left', sortable: false, visible: true },
              
            ],
            onLoadSuccess: function (data) {
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'Error al crear la tabla');
    }
}

function _consultar_tbl_detalles(folio_reproduccion) {
    var filtros = null;
    try {
        filtros = new Object();
        filtros.folio_reproduccion = folio_reproduccion;
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Reproducciones.asmx/Consultar_Detalles',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos_cb = JSON.parse(datos.d);
                    $('#tbl_lista_detalles').bootstrapTable('load', JSON.parse(datos.d));
                    datos.d = (datos.d == undefined || datos.d == null) ? '[]' : datos.d;

                }

            }
        });

    } catch (e) {

    }
}


var ubicacion_;

function _consultar_ubicacion(no_inspeccion) {
    var filtros = null;
    try {

        filtros = new Object();
        filtros.folio_reproduccion = no_inspeccion;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });
        debugger;
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Reproducciones.asmx/Consultar_Ubicacion',
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
              
                ubicacion_ = ubicacion;
            }

        });

    } catch (e) {

    }

}


var mapa;


function _consultar_ruta(folio) {
    var filtros = null;
    try {

        filtros = new Object();
        filtros.folio_reproduccion = folio;

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Ope_Reproducciones.asmx/Consultar_Ubicacion_Inspeccion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    debugger;
                    var ruta = $.parseJSON(datos.d);
                    var miobjeto = [];
                    for (var Indice = 0; Indice < ruta.length; Indice++) {
                        debugger;

                        miobjeto.push({ lat: parseFloat(ruta[Indice].Latitud), lng: parseFloat(ruta[Indice].Longitud) });
 
                    }
                }

                initmap(miobjeto);
               // setInterval(dibujar_puntos(miobjeto), 3000);
            }

        });

    } catch (e) {

    }
}


function initmap(objeto)
{
    var div = document.getElementById('divmapa')
    var bounds = new google.maps.LatLngBounds();
    var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    mapa = new google.maps.Map(div, {
        zoom: 18,
        //center:{lat:20.7250129, lng:-101.3688148}
       // center: myLatLng
    });

  
    for (var i = 0; i < objeto.length; i++) {
        var localizacion = objeto[i];
        var myLatLng = new google.maps.LatLng(localizacion.lat, localizacion.lng);  
        bounds.extend(myLatLng);

    }
    mapa.fitBounds(bounds);

    var markers = objeto.map(function (location, i) {
        return new google.maps.Marker({
            position: location,
            map: mapa,
            label: labels[i % labels.length]
        });

    });
   
    var markerCluster = new MarkerClusterer(mapa, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });


}