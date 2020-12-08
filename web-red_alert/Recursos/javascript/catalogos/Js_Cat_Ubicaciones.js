var _index = null;
var row_partida = null;

var mapa;
var marker = null;
var markers = [];
var marker_inicio = null;
var marker_fin = null;
var nuevo = null;
var circle_1 = null;
var circles = [];
var linea = null;
var Horarios_Eliminados = [];

$(document).on('ready', function () {
    _load_vistas();
});


function _load_vistas() {
    _launchComponent('vistas/Ubicacion/Principal.html', 'Principal');
    _launchComponent('vistas/Ubicacion/Operacion.html', 'Operacion');
    _launchComponent('vistas/Ubicacion/Relacion.html', 'Relacion');
}


function _cargar_caja_busqueda() {
    var estructura_html = '';// variable en la que se mostraran el cuadro de busqueda

    var x = "";


    x = $('#txt_busqueda_lugar');

    estructura_html = '<input id="txt_busqueda_lugar" type = "text" class="form-control" style = "margin-top:0px" />';

    //  se agrega el text de busqueda
    $('#div_buscador').html(estructura_html);
    
}

function _launchComponent(component, id) {

    $('#' + id).load(component, function () {

        switch (id) {
            case 'Principal':
                _inicializar_vista_principal();
                break;
            case 'Operacion':
                _inicializar_vista_procesos();
                break;

            case 'Relacion':
                _inicializar_vista_modal_relacion();
                break;
        }
    });
}

//  *******************************************************************************************************************************
//  *******************************************************************************************************************************
////*********************Inicializar********************///
//  *******************************************************************************************************************************
function _inicializar_vista_principal() {
    try {

        crear_tabla();
        _set_location_toolbar('toolbar');
        _load_estatus('cmb_estatus_filtro');
        _load_tipos_instalaciones('cmb_tipo_filtro');
        _eventos_principal();
        _mostrar_vista('Principal');
        _ConsultarFiltros();
        
    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}



/* =============================================
--NOMBRE_FUNCIÓN:       _inicializar_vista_modal_relacion
--DESCRIPCIÓN:          Evento con el que se cargan los eventos y funciones de la vista modal
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           07 Octubre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _inicializar_vista_modal_relacion() {
    try {

        //  se crea la estructura de la tabla
        crear_tabla_relacion();

        //  se inicializan los eventos
        _eventos_modal_relacion();

        //  se asignan los valores al combo
        _load_cmb_medicos('cmb_medico');

        //  se limpian los controles
        _limpiar_todos_controles_modal_relacion();

        //  se consultan los valores
        _ConsultarFiltros();


    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [_inicializar_vista_modal_relacion] ', e);
    }
}


function _eventos_principal() {
    try {        

        $('#btn_inicio').on('click', function (e) {
            e.preventDefault();
            window.location.href = '../Paginas_Generales/Frm_Apl_Principal.aspx';
        });

        $('#btn_nuevo').on('click', function (e) {
            e.preventDefault();

            _limpiar_todos_controles_procesos();
            _habilitar_controles('Nuevo');            

            var ubicacion = new Object();
            ubicacion.Latitud = 21.124773;
            ubicacion.Longitud = -101.690389;
            ubicacion.Zoom = 14;
            ubicacion.Nuevo = 2;

            //    var myLatLng = { lat: 20.684279, lng: -101.356237 };
            iniciar(ubicacion);

            _mostrar_vista('Operacion');

        });

        $('#btn_busqueda').on('click', function (e) {
            e.preventDefault();
            _ConsultarFiltros();
        });

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


function _habilitar_controles(opc) {

    try {
        switch (opc) {
            case 'Nuevo':
                $('#cmb_estatus').val(2);
                $('#cmb_estatus').attr({ disabled: true });  
                $('#btn_guardar').attr('title', 'Guardar');
                break;

            case 'Modificar':
                $('#cmb_estatus').attr({ disabled: false });
                $('#btn_guardar').attr('title', 'Actualizar');
                break;
        }

    } catch (e) {
        _mostrar_mensaje('Error Técnico' + ' [_habilitar_controles] ', e);
    }

}


function crear_tabla() {

    try {
        $('#tbl_ubicaciones').bootstrapTable('destroy');
        $('#tbl_ubicaciones').bootstrapTable({
            cache: false,
            striped: true,
            pagination: true,
            data: [],
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            search: true,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            columns: [
                { field: 'Ubicacion_Id', title: 'Ubicacion_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Estatus_Id', title: 'Estatus_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Tipo_Instalacion_Id', title: 'Tipo_Instalacion_Id', align: 'center', valign: 'top', visible: false },

                { field: 'Nombre', title: 'Nombre', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Tipo_Instalacion', title: 'Tipo', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Estatus', title: 'Estatus', align: 'left', valign: 'top', visible: true, sortable: true },

                //{
                //    field: 'Abierto', title: '', align: 'center', valign: 'top', sortable: true, visible: true,
                //    formatter: function (value, row, index) {


                //        var opciones = "";
                //        opciones += ' <div class="row" style="padding-top:2px;">';

                //        opciones += '   <div class="col-md-12">';
                //        opciones += '       <div>';

                //        if (value == true) {
                //            opciones += '           <i class="fa fa-check-square" style="color:#2E8B57;font-size: 14px;"></i>&nbsp; Abierto';
                //        }
                //        else {
                //            opciones += '           <i class="fa fa-window-close" style="color:#DCDCDC;font-size: 14px;"></i> <label  style="color:#DCDCDC;">&nbsp;Cerrado</label>  ';
                //        }


                //        opciones += "       </div>"
                //        opciones += "   </div>"
                //        opciones += "</div>"
                //        return opciones;
                //    }
                //},

                { field: 'Longitud', title: 'Longitud', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Latitud', title: 'Latitud', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Horario_Inicio', title: 'Horario_Inicio', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Horario_Termino', title: 'Horario_Termino', align: 'left', valign: 'top', visible: false, sortable: true },

                {
                    field: 'Str_Horario_Inicio', title: 'Hora inicio', align: 'left', valign: 'top', sortable: true, visible: false, formatter: function (value, row, index) {
                        if (row.Str_Horario_Inicio != null)
                            return new Date('1/1/2018 ' + value).toString('HH:mm');
                    }
                },
                {
                    field: 'Str_Horario_Termino', title: 'Hora termino', align: 'left', valign: 'top', sortable: true, visible: false, formatter: function (value, row, index) {
                        if (row.Str_Horario_Termino != null)
                            return new Date('1/1/2018 ' + value).toString('HH:mm');
                    }
                },
                { field: 'Lunes', title: 'Lunes', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Martes', title: 'Martes', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Miercoles', title: 'Miercoles', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Jueves', title: 'Jueves', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Viernes', title: 'Viernes', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Sabado', title: 'Sabado', align: 'left', valign: 'top', visible: false, sortable: true },
                { field: 'Domingo', title: 'Domingo', align: 'left', valign: 'top', visible: false, sortable: true },

                {
                    field: 'Editar',
                    title: 'Editar',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Ubicacion_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },


                   {
                       //  relacion
                       field: 'Relacion',
                       title: 'Medico-Hospital',
                       width: 80,
                       align: 'right',
                       valign: 'top',
                       halign: 'center',

                       /* =============================================
                       --NOMBRE_FUNCIÓN:        formatter: function (value, row) {
                       --DESCRIPCIÓN:          Evento con el que se da estilo a la celda
                       --PARÁMETROS:           value: es el valor de la celda
                       --                      row: estructura del renglon de la tabla
                       --CREO:                 Hugo Enrique Ramírez Aguilera
                       --FECHA_CREO:           24 Octubre de 2019
                       --MODIFICÓ:
                       --FECHA_MODIFICÓ:
                       --CAUSA_MODIFICACIÓN:
                       =============================================*/
                       formatter: function (value, row) {

                           var opciones;//   variable para formar la estructura del boton

                           //   validamos que solo los hospitales tengan esta opcion
                           if (row.Tipo_Instalacion_Id == 1) {
                               opciones = '<div style=" text-align: center;">';
                               opciones += '<div style="display:block"><a class="remove ml10 text-blue" id="' + row.Ubicacion_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_relacionar_click(this);" title="Relacionar"><i class="glyphicon glyphicon-tags"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
                               opciones += '</div>';
                           }

                           return opciones;
                       }
                   },


                {
                    field: 'Eliminar',
                    title: 'Eliminar',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id=edti_"' + row.Ubicacion_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Editar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico' + '[crear_tabla_participantes]', e.message);
    }
}


function crear_tabla_horarios() {

    try {
        $('#tbl_horarios_ubicacion').bootstrapTable('destroy');
        $('#tbl_horarios_ubicacion').bootstrapTable({
            cache: false,
            striped: true,
            pagination: false,
            data: [],
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            search: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,
            columns: [
                { field: 'Horario_Ubicacion_ID', title: 'Ubicacion_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Ubicacion_Id', title: 'Ubicacion_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Dia', title: 'Dia', align: 'left', valign: 'top', visible: true, sortable: true },         
                { field: 'Horario_Inicio', title: 'Horario Inicio', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Horario_Termino', title: 'Horario Termino', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Estatus', title: '', align: 'left', valign: 'top', visible: false, sortable: true },
                {
                    field: 'Eliminar',
                    title: 'Eliminar',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id=edti_"' + row.Ubicacion_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="_btn_quitar(this);" title="Editar"><i class="glyphicon glyphicon-remove"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico' + '[crear_tabla_participantes]', e.message);
    }
}
///*****Eventos********///
function _agregar_horarios() {

    try {
        $('#tbl_horarios_ubicacion').bootstrapTable('insertRow', {
            index: 0,
            row: {
                Horario_Ubicacion_ID: 0,
                Ubicacion_Id: $("#txt_ubicacion_id").val(),
                Dia: $("#cmb_dia").val(),
                Horario_Inicio: $("#txt_hora_inicio").val(),
                Horario_Termino: $("#txt_hora_termino").val(),
                Estatus : "Nuevo"
            }
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}

function btn_agregar_horarios() {
    try {
        if (!_validar_duplicar_horarios($('#cmb_dia').val())) {
            _agregar_horarios();
        } else {
            _mostrar_mensaje('Información', 'El día seleccionado ya fue agregado.');
        }
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}
function _validar_duplicar_horarios(dia) {
    var _agregados = null;
    var _existentes_tabla = false;
    try {
        _agregados = $("#tbl_horarios_ubicacion").bootstrapTable('getData');
        $.each(_agregados, function (index, value) {
            if (value.Dia == dia) {
                _existentes_tabla = true;
            }

        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
    return _existentes_tabla;
}

function _btn_quitar(perfil) {
    var indexrow = null;
    var row = $(perfil).data('orden');

    try {
  
            if (row.Estatus == 'Nuevo') {
                $('#tbl_horarios_ubicacion').bootstrapTable('remove', {
                    field: 'Dia',
                    values: [$.trim(row.Dia.toString())]
                });
            }
            else {
                var eliminar = new Object();
                eliminar.Horario_Ubicacion_ID = row.Horario_Ubicacion_ID;
                Horarios_Eliminados.push(eliminar);
                $('#tbl_horarios_ubicacion').bootstrapTable('remove', {
                    field: 'Dia',
                    values: [$.trim(row.Dia.toString())]
                });
            }       
    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}
//  -----------------------------------------------------
//  -----------------------------------------------------
function _mostrar_vista(vista_) {

    switch (vista_) {
        case "Principal":
            $('#Operacion').hide();
            $('#Principal').show();
            break;
        case "Operacion":
            $('#Operacion').show();
            $('#Principal').hide();
            break;
    }
}

//  -----------------------------------------------------
//  -----------------------------------------------------
function _set_location_toolbar(toolbar) {
    $('#' + toolbar).parent().removeClass("pull-left");
    $('#' + toolbar).parent().addClass("pull-right");
}



function _load_estatus(cmb) {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: '../Paginas_Generales/controllers/Usuarios_Controller.asmx/ConsultarEstatus',
            //data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#' + cmb);
                    $('option', select).remove();

                    var options = '<option value=""><-SELECCIONE-></option>';

                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Estatus_ID + '">' + datos_combo[Indice_Estatus].Estatus.toUpperCase() + '</option>';
                        if (datos_combo[Indice_Estatus].Estatus.toUpperCase() == 'ACTIVO') {
                            estatusActivo = datos_combo[Indice_Estatus].Estatus_ID;
                        }
                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }
}


function _load_tipos_instalaciones(cmb) {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: '../Catalogos/controllers/TiposInstalacionesController.asmx/ConsultarTiposInsatalaciones',
            //data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var datos_combo = $.parseJSON(datos.d);
                    var select = $('#' + cmb);
                    $('option', select).remove();

                    var options = '<option value=""><-SELECCIONE-></option>';

                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        options += '<option value="' + datos_combo[Indice_Estatus].Tipo_Instalacion_Id + '">' + datos_combo[Indice_Estatus].Nombre.toUpperCase() + '</option>';

                    }
                    select.append(options);
                }
            }
        });
    } catch (e) {

    }
}


//  *******************************************************************************************************************************
//  *******************************************************************************************************************************
///********************CONSULTAS**************///
//  *******************************************************************************************************************************
function _ConsultarFiltros() {
    var filtros = null;
    try {
        filtros = new Object();

        filtros.Estatus_Id = ($('#cmb_estatus_filtro').val() === null || $('#cmb_estatus_filtro').val() === "") ? 0 : parseInt($('#cmb_estatus_filtro').val());
        filtros.Tipo_Instalacion_Id = ($('#cmb_tipo_filtro').val() === null || $('#cmb_tipo_filtro').val() === "") ? 0 : parseInt($('#cmb_tipo_filtro').val());
        filtros.Nombre = $("#txt_nombre_busqueda").val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/UbicacionesController.asmx/Consultar_Ubicaciones_Filtro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_ubicaciones').bootstrapTable('load', datos);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error ', e);
    }
}

function _Consultar_Horarios(id_ubicacion) {
    var filtros = null;
    try {
        filtros = new Object();

        filtros.Ubicacion_Id = parseInt(id_ubicacion);
      
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/UbicacionesController.asmx/Consultar_Horarios_Ubicaciones',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_horarios_ubicacion').bootstrapTable('load', datos);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error ', e);
    }
}



//  -----------------------------------------------------
//  -----------------------------------------------------
function _inicializar_vista_procesos() {
    try {

        _eventos_procesos();
        _inicializar_horas_operacion();
        _inicializar_icheck();
        crear_tabla_horarios();
        _cargar_dias();
        _load_estatus('cmb_estatus');
        _load_tipos_instalaciones('cmb_tipo_instalacion');

        _limpiar_todos_controles_procesos();


        var ubicacion = new Object();
        ubicacion.Latitud = 21.124455;
        ubicacion.Longitud = -101.690389;
        ubicacion.Zoom = 14;
        ubicacion.Nuevo = 2;

        //    var myLatLng = { lat: 20.684279, lng: -101.356237 };
        iniciar(ubicacion);

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}

//  -----------------------------------------------------
//  -----------------------------------------------------
function _set_location_toolbar(toolbar) {
    $('#' + toolbar).parent().removeClass("pull-left");
    $('#' + toolbar).parent().addClass("pull-right");
}

function _limpiar_todos_controles_procesos() {

    try {
        $('input[type=text]').each(function () { $(this).val(''); });
        $('input[type=hidden]').each(function () { $(this).val(''); });
        $('input[type=textarea]').each(function () { $(this).val(''); });

        $('#cmb_tipo_instalacion').val('');
        $('#cmb_estatus').val('');
        $("#tbl_horarios_ubicacion").bootstrapTable('load', []);
        _limpiar_iframe();


    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'limpiar controles. ' + e);
    }
}

function _limpiar_iframe() {
    try {
        var iframes = document.getElementsByTagName('iframe');
        for (var i = 0; i < iframes.length; i++) {
            iframes[i].parentNode.removeChild(iframes[i]);
        }
    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'limpiar controles. ' + e);
    }
}



//  ---------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------
function _eventos_procesos() {
    try {
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        $('#btn_guardar').on('click', function (e) {
            e.preventDefault();


            var title = $('#btn_guardar').attr('title');
            var valida_datos_requerido = _validarDatos_Nuevo();
            if (valida_datos_requerido.Estatus) {

                if (title == "Guardar") {
                    alta()
                }
                else {
                    actualizar();
                }
            }
            else {
                _mostrar_mensaje('Información', valida_datos_requerido.Mensaje);
            }

        });
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        $('#btn_cancelar').on('click', function (e) {
            e.preventDefault();
            _mostrar_vista('Principal');
            _limpiar_todos_controles_procesos();
        });
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        $('#btn_visualizar').on('click', function (e) {
            e.preventDefault();

            _limpiar_iframe();
            _Cargar_Video();

        });
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        $('#btn_agregar_punto').on('click', function (e) {
            e.preventDefault();
            if (marker != null) {
                var latlng = marker.getPosition();
                if ($('#txt_latitud').val() == '')
                    Set_Ciudad_Origen(latlng);
                //else
                //    Set_Ciudad_Destino(latlng);
            }
        });
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------

        $('#btn_limpiar_puntos').on('click', function (e) {
            e.preventDefault();
            
            clearMarkers()
            markers = [];

        
            var ubicacion = new Object();
            ubicacion.Latitud = parseFloat($('#txt_latitud').val());
            ubicacion.Longitud = parseFloat($('#txt_longitud').val());
            ubicacion.Zoom = 14;
            ubicacion.Nuevo = 2;

            document.getElementById('mapa').innerHTML = '';
            iniciar(ubicacion);


        });

        $('#btn_agregar').on('click', function (e) {
            e.preventDefault();
            var valida_datos_requerido = _validarDatos_Nuevo_Horario();
            if (valida_datos_requerido.Estatus) {
                btn_agregar_horarios();
                $('#txt_hora_inicio').val('');
                $('#txt_hora_termino').val('');
                $('#cmb_dia').select2("trigger", "select", {
                    data: { id: '', text: '' }
                });
            }
            else {
                _mostrar_mensaje('Información', valida_datos_requerido.Mensaje);
            }
        });
        //  ---------------------------------------------------------------------------------
        // 

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


function _inicializar_horas_operacion() {
    //------------------------------------------------------------------
    $('#dtp_txt_hora_inicio').datetimepicker({
        defaultDate: new Date(),
        locale: 'es',
        format: "LT"
    });
    $("#dtp_txt_hora_inicio").datetimepicker("useCurrent", true);

    //------------------------------------------------------------------
    $('#dtp_txt_hora_termino').datetimepicker({
        defaultDate: new Date(),
        locale: 'es',
        format: "LT"
    });
    $("#dtp_txt_hora_termino").datetimepicker("useCurrent", true);



    //------------------------------------------------------------------

}



function _inicializar_icheck() {
    $('input.icheck-11').iCheck('destroy');
    $('input.icheck-11').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
}


///*******************Validaciones*************************///
function _validarDatos_Nuevo() {
    var _output = new Object();

    try {
        _output.Estatus = true;
        _output.Mensaje = '';
        //  ---------------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------------
        //  datos del participante
        if ($('#txt_nombre').val() == '' || $('#txt_nombre').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El nombre.<br />';
        }
        if ($('#txt_longitud').val() == '' || $('#txt_longitud').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La longitud.<br />';
        }


        if ($('#txt_latitud').val() == '' || $('#txt_latitud').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La latitud.<br />';
        }

        if ($('#cmb_estatus').val() == '' || $('#cmb_estatus').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El estatus.<br />';
        }

        if ($('#cmb_tipo_instalacion').val() == '' || $('#cmb_tipo_instalacion').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El tipo de instalacion.<br />';
        }


        if ($('#txt_telefono').val() == '' || $('#txt_telefono').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El teléfono.<br />';
        }

        if ($('#txt_telefono').val().length <= 9) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Longitud del teléfono.<br />';
        }

        //if ($('#txt_telefono_urgencias').val() == '' || $('#txt_telefono_urgencias').val() == undefined) {
        //    _output.Estatus = false;
        //    _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El teléfono urgencias.<br />';
        //}

        /*var tbl = $('#tbl_horarios_ubicacion').bootstrapTable('getData');
        if (tbl == 0) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Debes agregar los horarios.<br />';
        }*/


        //  ---------------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------------
        if (_output.Mensaje != "") {
            _output.Mensaje = "Favor de proporcionar lo siguiente: <br />" + _output.Mensaje;
        }

        //  ---------------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------------

    } catch (e) {
        _mostrar_mensaje('Informe técnico' + '[_validarDatos_Nuevo]', e);
    } finally {
        return _output;
    }
}

function _validarDatos_Nuevo_Horario() {
    var _output = new Object();

    try {
        _output.Estatus = true;
        _output.Mensaje = '';
        //  ---------------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------------
        //  datos del participante
        if ($('#cmb_dia').val() == '' || $('#cmb_dia').val() == 'SELECCIONE') {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El día.<br />';
        }
        if ($('#txt_hora_inicio').val() == '' || $('#txt_hora_inicio').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Horario Inicio.<br />';
        }
        if ($('#txt_hora_termino').val() == '' || $('#txt_hora_termino').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;Horario Termino.<br />';
        }
      

        //  ---------------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------------
        if (_output.Mensaje != "") {
            _output.Mensaje = "Favor de proporcionar lo siguiente: <br />" + _output.Mensaje;
        }

        //  ---------------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------------

    } catch (e) {
        _mostrar_mensaje('Informe técnico' + '[_validarDatos_Nuevo]', e);
    } finally {
        return _output;
    }
}

///********************BD***************///
function alta() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Estatus_Id = $('#cmb_estatus').val();
        obj.Tipo_Instalacion_Id = $('#cmb_tipo_instalacion').val();

        obj.Nombre = $('#txt_nombre').val();
        obj.Longitud = parseFloat($('#txt_longitud').val());
        obj.Latitud = parseFloat($('#txt_latitud').val());

        //obj.Horario_Inicio = $('#txt_hora_inicio').val();
        //obj.Horario_Termino = $('#txt_hora_termino').val();
        obj.Lunes = $('#chk_lunes').prop('checked');
        obj.Martes = $('#chk_martes').prop('checked');
        obj.Miercoles = $('#chk_miercoles').prop('checked');
        obj.Jueves = $('#chk_jueves').prop('checked');
        obj.Viernes = $('#chk_viernes').prop('checked');
        obj.Sabado = $('#chk_sabado').prop('checked');
        obj.Domingo = $('#chk_domingo').prop('checked');
       
        obj.Telefono = $('#txt_telefono').val();
        obj.Telefono_Urgencias = $('#txt_telefono_urgencias').val();
        obj.Sitio_Web_URL = $('#txt_sitio_web').val();
        obj.Observaciones = $('#txt_observaciones').val();
        obj.Emergencias = $('#ck_urgencias').prop('checked');
        obj.Lista_Horarios = JSON.stringify($('#tbl_horarios_ubicacion').bootstrapTable('getData'));
      
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/UbicacionesController.asmx/Alta',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_vista('Principal');
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _limpiar_iframe();
                        _ConsultarFiltros();
                    } else {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                    }
                }
            }
        });

    } catch (e) {
        alert(e.message)
    }

}

function actualizar() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Ubicacion_Id = $('#txt_ubicacion_id').val();
        obj.Estatus_Id = $('#cmb_estatus').val();
        obj.Tipo_Instalacion_Id = $('#cmb_tipo_instalacion').val();

        obj.Nombre = $('#txt_nombre').val();
        obj.Longitud = parseFloat($('#txt_longitud').val());
        obj.Latitud = parseFloat($('#txt_latitud').val());

        //obj.Horario_Inicio = $('#txt_hora_inicio').val();
        //obj.Horario_Termino = $('#txt_hora_termino').val();
        obj.Lunes = $('#chk_lunes').prop('checked');
        obj.Martes = $('#chk_martes').prop('checked');
        obj.Miercoles = $('#chk_miercoles').prop('checked');
        obj.Jueves = $('#chk_jueves').prop('checked');
        obj.Viernes = $('#chk_viernes').prop('checked');
        obj.Sabado = $('#chk_sabado').prop('checked');
        obj.Domingo = $('#chk_domingo').prop('checked');

        obj.Telefono = $('#txt_telefono').val();
        obj.Telefono_Urgencias = $('#txt_telefono_urgencias').val();
        obj.Sitio_Web_URL = $('#txt_sitio_web').val();
        obj.Observaciones = $('#txt_observaciones').val();
        obj.Emergencias = $('#ck_urgencias').prop('checked');

        obj.Lista_Horarios = JSON.stringify($('#tbl_horarios_ubicacion').bootstrapTable('getData'));
        obj.Lista_HorariosE = JSON.stringify(Horarios_Eliminados);

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/UbicacionesController.asmx/Actualizar',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_vista('Principal');
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _limpiar_iframe();
                        _ConsultarFiltros();
                    } else {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                    }
                }
            }
        });

    } catch (e) {
        alert(e.message)
    }
}



function btn_editar_click(tab) {
    var row = $(tab).data('orden');

    _limpiar_todos_controles_procesos();

    _habilitar_controles('Modificar');

    $('#txt_ubicacion_id').val(row.Ubicacion_Id);
    $('#txt_nombre').val(row.Nombre);
    $('#txt_longitud').val(row.Longitud);
    $('#txt_latitud').val(row.Latitud);

    if (row.Estatus != null) {
        $('#cmb_estatus').val(row.Estatus_Id);
    }
    if (row.Tipo_Instalacion_Id != null) {
        $('#cmb_tipo_instalacion').val(row.Tipo_Instalacion_Id);
    }

    

    $('#txt_telefono').val(row.Telefono);
    $('#txt_telefono_urgencias').val(row.Telefono_Urgencias);
    $('#txt_sitio_web').val(row.Sitio_Web_URL);
    $('#txt_observaciones').val(row.Observaciones);

    if (row.Emergencias == true) {
        $('#ck_urgencias').iCheck('check');
    }
    else {
        $('#ck_urgencias').iCheck('uncheck');
    }

    _Consultar_Horarios(row.Ubicacion_Id);


    if (row.Longitud != null && row.Latitud != null) {

        if (row.Longitud != 0 && row.Latitud != 0) {
            var ubicacion = new Object();
            ubicacion.Latitud = parseFloat(row.Latitud);
            ubicacion.Longitud = parseFloat(row.Longitud);
            ubicacion.Zoom = 16;
            ubicacion.Nuevo = 1;


            iniciar(ubicacion);
        }
        else {
            var ubicacion = new Object();
            ubicacion.Latitud = 21.124773;
            ubicacion.Longitud = -101.690389;
            ubicacion.Zoom = 14;
            ubicacion.Nuevo = 2;      
            iniciar(ubicacion);
        }
    }
    else {
        var ubicacion = new Object();
        ubicacion.Latitud = 21.124773;
        ubicacion.Longitud = -101.690389;
        ubicacion.Zoom = 14;
        ubicacion.Nuevo = 2;
        iniciar(ubicacion);
    }


    _mostrar_vista('Operacion');
}


function _keyDownInt(id) {
    $('#' + id).on('keydown', function (e) {

        //alert("entro int");//_remove_class_error('#' + $(this).attr('id'));

        // Allow: backspace, delete, tab, escape, enter
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}



function btn_eliminar_click(tab) {
    var row = $(tab).data('orden');

    bootbox.confirm({
        title: 'ELIMINAR Registro',
        message: 'Esta seguro de Eliminar el registro seleccionado?',
        callback: function (result) {
            if (result) {

                //  documentos
                var filtros = null;
                filtros = new Object();

                filtros.Ubicacion_Id = row.Ubicacion_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/UbicacionesController.asmx/Eliminar',
                    data: $data,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            datos = JSON.parse(datos.d);
                            _mostrar_mensaje('Información','El registro se elimino correctamente.');
                            _ConsultarFiltros();
                        }
                    }
                });
            }
        }
    });
}





function iniciar(ubicacion) {
    var destino;
  
    if (ubicacion != undefined) {

        nuevo = ubicacion.Nuevo;

        var origen = { lat: ubicacion.Latitud, lng: ubicacion.Longitud };

      
        var div = document.getElementById('mapa')


        mapa = new google.maps.Map(div, {
            center: origen,
            zoom: ubicacion.Zoom,
          
        });


        //  seccion de caja de busqueda de lugares
        var input = document.getElementById("txt_busqueda_lugar");

        //  validamos que exista el control
        if (input == null) {
            _cargar_caja_busqueda();
            input = document.getElementById("txt_busqueda_lugar");
        }


        var searchBox = new google.maps.places.SearchBox(input);
        mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        // Bias the SearchBox results towards current map's viewport.
        mapa.addListener("bounds_changed", () => {
            searchBox.setBounds(mapa.getBounds());
        });


        if (nuevo == 1) {
            marker_inicio = new google.maps.Marker({ position: origen, label: 'A', map: mapa });
        }

        mapa.addListener('click', function (event) {

            //if (nuevo != 2) {
            if (marker != null)
                marker.setMap(null);
            marker = new google.maps.Marker({
                position: event.latLng,
                map: mapa
            });
         


            $('#txt_longitud').val(event.latLng.lng());
            $('#txt_latitud').val(event.latLng.lat());

        });



        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }
            // Clear out the old markers.
            markers.forEach(marker => {
                marker.setMap(null);
            });
            markers = [];
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
                if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                const icon = {
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(25, 25)
                };
                // Create a marker for each place.
                markers.push(
                    new google.maps.Marker({
                        mapa,
                        icon,
                        title: place.name,
                        position: place.geometry.location
                    })
                );

                //if (place.geometry.viewport) {
                //    // Only geocodes have viewport.
                //    bounds.union(place.geometry.viewport);
                //} else {
                    bounds.extend(place.geometry.location);
                //}

                var puntos = markers[0].getPosition();


                $('#txt_longitud').val(puntos.lng());
                $('#txt_latitud').val(puntos.lat());

            });
            mapa.fitBounds(bounds);
        });

    }
}

function initZoomControl(map) {
    document.querySelector('.zoom-control-in').onclick = function () {
       
        map.setZoom(map.getZoom() + 1);
        return false;
    };
    document.querySelector('.zoom-control-out').onclick = function () {
       
        map.setZoom(map.getZoom() - 1);
        return false;
    };

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.querySelector('.zoom-control'));
}

function initMapTypeControl(map) {
    var mapTypeControlDiv = document.querySelector('.maptype-control');
    document.querySelector('.maptype-control-map').onclick = function () {
        mapTypeControlDiv.classList.add('maptype-control-is-map');
        mapTypeControlDiv.classList.remove('maptype-control-is-satellite');
        map.setMapTypeId('roadmap');
        return false;
    };
    document.querySelector('.maptype-control-satellite').onclick =
        function () {
            mapTypeControlDiv.classList.remove('maptype-control-is-map');
            mapTypeControlDiv.classList.add('maptype-control-is-satellite');
            map.setMapTypeId('hybrid');
            return false;
        };

    map.controls[google.maps.ControlPosition.LEFT_TOP].push(
        mapTypeControlDiv);
}

function addMarker(location) {
    var _marker = new google.maps.Marker({
        position: location,
        map: mapa
    });
    markers.push(_marker);

   
    marker_inicio = new google.maps.Marker({ position: location, label: 'A', map: mapa });

    var circle = new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: '#0000FF',
        fillOpacity: 0.20,
        map: mapa,
        center: location,
        radius: 25
    });
    circles.push(circle);
}



function Set_Ciudad_Origen(latlng) {
    $('#txt_longitud').val(latlng.lat());
    $('#txt_latitud').val(latlng.lng());
    marker_inicio = new google.maps.Marker({ position: latlng, label: 'A', map: mapa });
}
function Set_Ciudad_Destino(latlng) {
    $('#txt_latitud_destino').val(latlng.lat());
    $('#txt_longitud_destino').val(latlng.lng());
    if (marker_fin != null)
        marker_fin.setMap(null);
    marker_fin = new google.maps.Marker({ position: latlng, label: 'B', map: mapa });
}
function Limpiar_Puntos() {
    if (nuevo != 2) {
      
        if (marker != null) { marker.setMap(null); }
        if (marker_inicio != null) { marker_inicio.setMap(null); }
        if (marker_fin != null) { marker_fin.setMap(null); }
        if (circle_1 != null) { circle_1.setMap(null); }
        if (linea != null) { linea.setMap(null); }
    }
    else {

        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        for (var i = 0; i < circles.length; i++) {
            circles[i].setMap(null);
        }
        circles = [];
        if (linea != null) { linea.setMap(null); }
    }
}

function _convertir_puntos() {
    var objpuntos = '[';
    var latlng;
    var puntos_Arreglo;

    if (markers.length > 0) {
        for (var i = 0; i < markers.length; i++) {
            latlng = markers[i].getPosition();
            objpuntos += '{Inidice:' + i + ',Latitud:"' + latlng.lat() + '",Longitud:"' + latlng.lng() + '"},'
            puntos_Arreglo.push()
        }
        if (objpuntos[objpuntos.length - 1] == ',') {
            objpuntos = objpuntos.slice(0, objpuntos.length - 1);
        }
        objpuntos += ']';
    }
    return objpuntos;
}

function dibujar_puntos(ruta) {
    var puntos = ruta;

    linea = new google.maps.Polyline({
        path: puntos,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    linea.setMap(mapa);
}


// Sets the map on all markers in the array.
function setMapOnAll(mapa) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(mapa);
    }

    markers = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}



/* =============================================
--NOMBRE_FUNCIÓN:       btn_relacionar_click
--DESCRIPCIÓN:          Carga la información del registro de la tabla, carga la información dentro de los controles correspondientes
--PARÁMETROS:           tab: estructura del renglón de la tabla
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           07 Octubre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function btn_relacionar_click(tab) {

    //  se carga la información del renglón de la tabla
    var row = $(tab).data('orden');//   variable para guardar la informacion del renglon de la tabla


    //  se limpian los controles
    _limpiar_todos_controles_modal_relacion();

    //  se carga la información en los controles
    $('#txt_ubicacion_relacion_id').val(row.Ubicacion_Id);

    //  se consultan la relacion con entridades
    _consultar_relacion();


    //  se muestra el modal
    _launch_modal_relacion('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Relacionar Hospital-Medico [' + row.Nombre + ']');
}

function _cargar_dias() {
    try {
        $('#cmb_dia').select2({
            language: "es",
            theme: "classic",
            placeholder: 'SELECCIONE',
            allowClear: true,
            data: [
                {
                    id: '',
                    text: 'SELECCIONE',
                },
                {
                    id: 'Lunes',
                    text: 'Lunes',
                }, {
                    id: 'Martes',
                    text: 'Martes',
                },
                {
                    id: 'Miércoles',
                    text: 'Miércoles',
                },
                {
                    id: 'Jueves',
                    text: 'Jueves',
                },
                {
                    id: 'Viernes',
                    text: 'Viernes',
                }, {
                    id: 'Sábado',
                    text: 'Sábado',
                },
                 {
                     id: 'Domingo',
                     text: 'Domingo',
                 }],
        });

    } catch (e) {
        _mostrar_mensaje('Informe técnico', e);
    }
}


/* =============================================
--NOMBRE_FUNCIÓN:       _evitar_submit_enter
--DESCRIPCIÓN:          Evento que evita el envio del fromulario al presionar enter dentro del cuadro de busqueda txt_busqueda_lugar
--PARÁMETROS:           e: hace referencia al evento de precionar una tecla dentro del control
--CREO:                 Juan Carlos Gómez Rangel
--FECHA_CREO:           25 de Agosto de 2020
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _evitar_submit_enter(e) {

    //variable que almacena el valor de la tecla pulsada / evaluamos si la tecla es alfanumerica o de control y la almacenamos segun sea el caso
    var tecla = (document.all) ? e.keyCode : e.which;
    //se retorna true en caso de que la tecla sea diferente a enter, evitando el envio del formulario
    return (tecla != 13);
}


/* =============================================
--NOMBRE_FUNCIÓN:       _validar_numeros
--DESCRIPCIÓN:          valida que el usuario sólo pueda teclear numeros en un campo de texto determinado, (evento onkeypress html)
--PARÁMETROS:           evt: hace referencia al evento de precionar una tecla dentro del control
--CREO:                 Juan Carlos Gómez Rangel
--FECHA_CREO:           8 de Septiembre de 2020
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _validar_numeros(evt) {

    //variable que almacena el codigo de la tecla que se preciona
    var code = evt.which ? evt.which : evt.keyCode;
    
    if (code == 8) {//evaluamos si es la tecla de retroceso
        return true;
    } else if (code >= 48 && code <= 57) {//evaluamos si es un numero        
        return true;
    } else {//si no es ningun numero o tecla de retroceso invalidamos la accion
        return false;
    }
}
