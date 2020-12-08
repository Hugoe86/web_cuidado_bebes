var _index = null;
var row_partida = null;

$(document).on('ready', function () {
    _load_vistas();
});


function _load_vistas() {
    _launchComponent('vistas/Consejos/Principal.html', 'Principal');
    _launchComponent('vistas/Consejos/Operacion.html', 'Operacion');
    _launchComponent('vistas/Consejos/Modal_Tags.html', 'Modal_Tags');
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

            case 'Modal_Tags':
                _inicializar_vista_modal();
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
        _eventos_principal();
        _mostrar_vista('Principal');
        _ConsultarFiltros();

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
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
        $('#tbl_consejos').bootstrapTable('destroy');
        $('#tbl_consejos').bootstrapTable({
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
                { field: 'Consejo_Id', width: 100, title: 'Consejo_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Estatus_Id', title: 'Estatus_Id', align: 'center', valign: 'top', visible: false },

                { field: 'Consejo',width: 100, title: 'Consejo', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Descripcion',width: 300, title: 'Descripcion', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Url', width: 50, title: 'Url', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Tags', width: 50, title: 'Tags', align: 'center', valign: 'top', visible: true, sortable: true },
                {
                    field: 'Consejo_Id',
                    title: '',
                    width: 50,
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Consejo_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;">Editar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

                {
                    field: 'Consejo_Id',
                    title: '',
                    width: 50,
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Consejo_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Editar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
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


//  *******************************************************************************************************************************
//  *******************************************************************************************************************************
///********************CONSULTAS**************///
//  *******************************************************************************************************************************
function _ConsultarFiltros() {
    var filtros = null;
    try {
        filtros = new Object();

        filtros.Consejo_Id = 0;
        filtros.Url = "";

        filtros.Estatus_Id = ($('#cmb_estatus_filtro').val() === null || $('#cmb_estatus_filtro').val() === "") ? 0 : parseInt($('#cmb_estatus_filtro').val());
        filtros.Consejo = $("#txt_consejo_busqueda").val();
        filtros.Tags = $("#txt_tags_busqueda").val();
      
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/ConsejosMedicosController.asmx/Consultar_Consejos_Filtro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_consejos').bootstrapTable('load', datos);
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
        _load_estatus('cmb_estatus');
        _limpiar_todos_controles_procesos();

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


/* =============================================
--NOMBRE_FUNCIÓN:       _inicializar_vista_modal
--DESCRIPCIÓN:          Evento con el que se cargan los eventos y funciones de la vista modal de metas
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _inicializar_vista_modal() {
    try {
        //  se crean las tablas
        crear_tabla_tags();

        //  se inicializan los eventos
        _eventos_modal();

        //  se limpian los controles
        _limpiar_todos_controles_modal();

    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [_inicializar_vista_modal] ', e);
    }
}




/* =============================================
--NOMBRE_FUNCIÓN:       crear_tabla_principal
--DESCRIPCIÓN:          Genere la estructura de la tabla
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function crear_tabla_tags() {

    try {
        //  se destruye la tabla
        $('#tbl_tags_asignados').bootstrapTable('destroy');

        //  se carga la estructura que tendrá la tabla
        $('#tbl_tags_asignados').bootstrapTable({
            cache: false,
            striped: true,
            pagination: true,
            data: [],
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200],
            smartDysplay: false,
            search: false,
            showColumns: false,
            showRefresh: false,
            minimumCountColumns: 2,

            columns: [

                { field: 'tag', title: 'Tag', align: 'left', valign: 'top', visible: true },

                {
                    field: 'tag',
                    title: '',
                    width: 80,
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {
                        var opciones;//   variable para formar la estructura del boton

                        opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.tag + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_tag_click(this);" title="Eliminar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },
            ]
        });

    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Informe Técnico' + ' [crear_tabla_principal] ', e.message);
    }
}


/* =============================================
--NOMBRE_FUNCIÓN:       _limpiar_todos_controles_modal
--DESCRIPCIÓN:          limpia todos los controles que se encuentran dentro del modal
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _limpiar_todos_controles_modal() {

    try {
        //  recorre los controles de tipo texto y ocultos
        $('#modal_tags input[type=text]').each(function () { $(this).val(''); });

        //  limpia las tablas
        $('#tbl_tags_asignados').bootstrapTable('load', JSON.parse('[]'));

    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [_limpiar_todos_controles_modal] ', 'limpiar controles. ' + e);
    }
}



/* =============================================
--NOMBRE_FUNCIÓN:       _eventos_modal
--DESCRIPCIÓN:          Crea los eventos de los botones que se encuentran dentro del modal
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _eventos_modal() {
    try {


        /* =============================================
       --NOMBRE_FUNCIÓN:       btn_agregar_tag_tabla
       --DESCRIPCIÓN:          Evento con el que se agrega un nuevo elemento
       --PARÁMETROS:           NA
       --CREO:                 Hugo Enrique Ramírez Aguilera
       --FECHA_CREO:           29 de Agosto del 2019
       --MODIFICÓ:
       --FECHA_MODIFICÓ:
       --CAUSA_MODIFICACIÓN:
       =============================================*/
        $('#btn_agregar_tag_tabla').on('click', function (e) {
            e.preventDefault();

            //  se asignan los datos de la tabla
            var auxiliar_tbl_tags_asignados = $('#tbl_tags_asignados').bootstrapTable('getData');//   almacena los datos de la tabla 
            var tag = "";//    se almacenara el valor del tag



            //  se obtiene el id del requerimiento id
            tag = $('#txt_nombre_tag').val();


            if (tag.length < 5) {

                _mostrar_mensaje('Validación', 'El tag debe de tener almenos 5 caracteres');
                return;
                
            }
            else {

                //  se obtiene el total de numero de registros dentro de la tabla
                var total_row = $('#tbl_tags_asignados').bootstrapTable('getOptions').totalRows;//    se almacenara la información del numero de registros

                //  actualiza el numero de la meta
                $('#tbl_tags_asignados').bootstrapTable('insertRow', {
                    index: total_row,
                    row: {
                        tag: tag,
                    }
                });

                //  recorre los controles de tipo texto y ocultos
                $('#modal_tags input[type=text]').each(function () { $(this).val(''); });

            }

        });


        /* =============================================
     --NOMBRE_FUNCIÓN:       btn_regresar_operacion
     --DESCRIPCIÓN:          Evento con el que se agrega un nuevo elemento
     --PARÁMETROS:           NA
     --CREO:                 Hugo Enrique Ramírez Aguilera
     --FECHA_CREO:           29 de Agosto del 2019
     --MODIFICÓ:
     --FECHA_MODIFICÓ:
     --CAUSA_MODIFICACIÓN:
     =============================================*/
        $('#btn_regresar_operacion').on('click', function (e) {
            e.preventDefault();

            //  se asignan los datos de la tabla
            var auxiliar_tbl_tags_asignados = $('#tbl_tags_asignados').bootstrapTable('getData');//   almacena los datos de la tabla 
            var tag = "";//    se almacenara el valor del tag




            /* =============================================
       --NOMBRE_FUNCIÓN:       $.each(tbl_requerimientos, function (index, value) 
       --DESCRIPCIÓN:          Recorre la tabla para actualizar el indice de la tabla
       --PARÁMETROS:           index: indice de la tabla
       --                      value: datos del renglon de la tabla
       --CREO:                 Hugo Enrique Ramírez Aguilera
       --FECHA_CREO:           14 de Septiembre de 2019
       --MODIFICÓ:
       --FECHA_MODIFICÓ:
       --CAUSA_MODIFICACIÓN:
       =============================================*/
            $.each(auxiliar_tbl_tags_asignados, function (indexs, values) { //  se recorre la tabla

                tag += "#" + values.tag;
                   
            });


            $('#txt_tags').val(tag);

            _limpiar_todos_controles_modal();
            _cancelar_modal_click();
        });


    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [_eventos_modal] ', e);
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
        $('input[type=text]').each(function () { $(this).val(''); });
      

        $('#txt_descripcion').val('');

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
        $('#btn_asignar_tag').on('click', function (e) {
            e.preventDefault();

            //  se limpian los controles
            _limpiar_todos_controles_modal();

            obtener_tags();

            //  se muestra el modal
            _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Administración de tags');

        });
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}

function obtener_tags() {
    var tag = "";
    var arreglo;
    var Cont_For = 0;

    tag = $('#txt_tags').val();
    arreglo = tag.split("#");


    for (Cont_For = 0; Cont_For < arreglo.length; Cont_For++) {

        if (arreglo[Cont_For] != "") {

            //  actualiza el numero de la meta
            $('#tbl_tags_asignados').bootstrapTable('insertRow', {
                index: Cont_For,
                row: {
                    tag: arreglo[Cont_For],
                }
            });
        }
    }


}

function _Cargar_Video() {
    try {
        var $content = $('#content');
        var ruta = "";
        var constante = 'https://www.youtube.com/embed/';
        var autoplay = "?autoplay=1";


        ruta = constante + $('#txt_url').val() + autoplay;
        ruta = ruta.replace("../../../", "../../");


        var $video = document.createElement('iframe');
        $video.controls = true;
        $video.style.width = '100%';
        $video.style.height = '550px';
        $video.id = 'player';
        $video.src = ruta;
        $video.frameborder = "0"
        $video.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        $video.allowfullscreen = true;
        $($content).append($video);


    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
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
        if ($('#txt_consejo').val() == '' || $('#txt_consejo').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El consejo.<br />';
        }

        if ($('#txt_descripcion').val() == '' || $('#txt_descripcion').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La descripcion del consejo.<br />';
        }

        if ($('#cmb_estatus').val() == '' || $('#cmb_estatus').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El estatus.<br />';
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
        obj.Consejo = $('#txt_consejo').val();
        obj.Descripcion = $('#txt_descripcion').val();
        obj.Url = $('#txt_url').val();
        obj.Tags = $('#txt_tags').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/ConsejosMedicosController.asmx/Alta',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {

                        var id = result.Consejo_Medico_Id;

                        consumir_servicio_notificacion(id);

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

        obj.Consejo_Id = $('#txt_consejo_id').val();
        obj.Estatus_Id = $('#cmb_estatus').val();
        obj.Consejo = $('#txt_consejo').val();
        obj.Descripcion = $('#txt_descripcion').val();
        obj.Url = $('#txt_url').val();
        obj.Tags = $('#txt_tags').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/ConsejosMedicosController.asmx/Actualizar',
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

function consumir_servicio_notificacion(consejo_id) {
    var obj = new Object();

    try {

        obj.Consejo_Id = consejo_id;


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/ConsejosMedicosController.asmx/Consumir_Servicio_Notificacion',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);


                    //if (result.Estatus == 'success') {

                    //    var id = result.Consejo_Medico_Id;

                    //    _mostrar_vista('Principal');
                    //    _mostrar_mensaje(result.Titulo, result.Mensaje);
                    //    _limpiar_iframe();
                    //    _ConsultarFiltros();
                    //} else {
                    //    _mostrar_mensaje(result.Titulo, result.Mensaje);
                    //}
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

    $('#txt_consejo_id').val(row.Consejo_Id);
    $('#txt_consejo').val(row.Consejo);
    $('#txt_descripcion').val(row.Descripcion);
    $('#txt_tags').val(row.Tags);

    if (row.Estatus != null) {
        $('#cmb_estatus').val(row.Estatus_Id);
    }

   
    $('#txt_url').val(row.Url);
   
    if (row.Url != null && row.Url != "") {
        _limpiar_iframe();
        _Cargar_Video();
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

                filtros.Consejo_Id = row.Consejo_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/ConsejosMedicosController.asmx/Eliminar',
                    data: $data,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            datos = JSON.parse(datos.d);

                            _ConsultarFiltros();
                        }
                    }
                });
            }
        }
    });
}




/* =============================================
--NOMBRE_FUNCIÓN:       _launch_modal
--DESCRIPCIÓN:          Se muestra el modal
--PARÁMETROS:           title_window: estructura que tendrá el titulo del modal
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _launch_modal(title_window) {

    //  se le carga el mensaje que tendrá el titulo del modal
    _set_title_modal_(title_window);

    //  se muestra el modal
    jQuery('#modal_tags').modal('show', { backdrop: 'static', keyboard: false });
}

/* =============================================
--NOMBRE_FUNCIÓN:       _set_title_modal_
--DESCRIPCIÓN:          Carga la estructura que tendrá el texto del titulo del modal
--PARÁMETROS:           titulo: el mensaje que se mostrara como titulo del modal
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _set_title_modal_(titulo) {

    //  se le asigna el texto al titulo del modal
    $("#lbl_titulo_modal").html(titulo);
}

/* =============================================
--NOMBRE_FUNCIÓN:       _cancelar_modal_click
--DESCRIPCIÓN:          Oculta el modal
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _cancelar_modal_click() {
    //  se llama al evento que cierra el modal
    _set_close_modal();
}


/* =============================================
--NOMBRE_FUNCIÓN:       _set_close_modal
--DESCRIPCIÓN:          Ejecuta la sección para ocultar el modal
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           29 de Agosto del 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _set_close_modal() {
    //  cierra el modal
    jQuery('#modal_tags').modal('hide');
}




/* =============================================
--NOMBRE_FUNCIÓN:       btn_eliminar_tag_click
--DESCRIPCIÓN:          elimina un registro dentro de la tabla y lo paso a la sección de la tabla de eliminados
--PARÁMETROS:           renglon: estructura del renglón de la tabla
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           14 de Septiembre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function btn_eliminar_tag_click(renglon) {
    try {
        var row = $(renglon).data('orden');//   se registrara la información del renglón de la tabla


        // se crea el mensaje de confirmación
        bootbox.confirm({
            title: 'ELIMINAR TAG [' + row.tag + ']',
            message: 'Esta seguro de Eliminar el registro seleccionado?',
            callback: function (result) {

                //  validamos la acción realizada
                if (result) {

                    //  se remueve el renglón de la tabla
                    $('#tbl_tags_asignados').bootstrapTable('remove', {
                        field: 'tag',
                        values: [row.tag],

                    });
                }
            }
        });


    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [btn_eliminar_tag_click] ', e);
    }
}

