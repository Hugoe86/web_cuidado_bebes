var _index = null;
var row_partida = null;

$(document).on('ready', function () {
    _load_vistas();
});


function _load_vistas() {
    _launchComponent('vistas/Tramite/Principal.html', 'Principal');
    _launchComponent('vistas/Tramite/Modal.html', 'Modal');
    _launchComponent('vistas/Tramite/ModalPasos.html', 'Modal_Pasos');
    _launchComponent('vistas/Tramite/Adjuntar.html', 'Adjuntar');
    _launchComponent('vistas/Tramite/VerAdjunto.html', 'VerAdjuntar');
}


function _launchComponent(component, id) {

    $('#' + id).load(component, function () {

        switch (id) {
            case 'Principal':
                _inicializar_vista_principal();
                break;

            case 'Modal':
                _inicializar_vista_modal();
                break;

            case 'Modal_Pasos':
                _inicializar_vista_modal_pasos();
                break;

            case 'Adjuntar':
                _inicializar_vista_adjuntar();
                break;

            case 'VerAdjuntar':

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
        _load_estatus('cmb_estatus_filtro');
        _set_location_toolbar('toolbar');
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
            _limpiar_todos_controles_modal();
            _habilitar_controles("Nuevo");
            _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Alta de Trámite');

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

function _habilitar_controles_modal_pasos(opc) {

    try {
        switch (opc) {
            case 'Nuevo':
                $('#btn_agregar').attr('title', 'Guardar');
                break;

            case 'Modificar':
                $('#btn_agregar').attr('title', 'Actualizar');
                break;
        }

    } catch (e) {
        _mostrar_mensaje('Error Técnico' + ' [_habilitar_controles] ', e);
    }

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


                    $('option', '#cmb_estatus').remove();
                    $('#cmb_estatus').append('<option value=""><-SELECCIONE-></option>');
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        $('#cmb_estatus').append('<option value="' + datos_combo[Indice_Estatus].Estatus_ID + '">' + datos_combo[Indice_Estatus].Estatus.toUpperCase() + '</option>');
                    }
                }
            }
        });
    } catch (e) {

    }
}

function crear_tabla() {

    try {
        $('#tbl_tramites').bootstrapTable('destroy');
        $('#tbl_tramites').bootstrapTable({
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
                { field: 'Tramite_Id', title: 'Tramite_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Nombre', title: 'Nombre', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Estatus', title: 'Estatus', align: 'center', valign: 'top', visible: true },


                {
                    field: 'Tramite_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Tramite_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;">Editar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

                {
                    field: 'Tramite_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Tramite_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Editar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

                {
                    field: 'Tramite_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-blue" id="' + row.Tramite_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_pasos_click(this);" title="relacion"><i class="fa-plus-square"></i>&nbsp;<span style="font-size:11px !important;">Requisitos</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },



            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico' + '[crear_tabla]', e.message);
    }
}


function crear_tabla_relacion_pasos() {

    try {
        $('#tbl_pasos').bootstrapTable('destroy');
        $('#tbl_pasos').bootstrapTable({
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

                { field: 'Paso_Id', title: 'Paso_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Tramite_Id', title: 'Tramite_Id', align: 'center', valign: 'top', visible: false },

                { field: 'Descripcion', width: '50%', title: 'Descripción', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Orden', width: '5%', title: 'Orden', align: 'center', valign: 'top', visible: true, sortable: true },

                {
                    field: 'Tiene_Imagen', title: 'Imagen', width: '25%', align: 'left', valign: 'top', visible: true, sortable: true,
                    formatter: function (value, row, index) {


                        var opciones = "";
                        opciones += '   <div class="row" style="padding-top:2px;">';



                        if (value == true) {

                            opciones += '       <div class="col-md-4 text-center">';
                            opciones += '           <div style="display:block"><a class="remove ml10 text-purple" id="' + row.Paso_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_ver_adjunto_click(this);" title="Ver"><i class="glyphicon glyphicon-eye-open"></i>&nbsp;<span style="font-size:11px !important;">Ver</span></a></div>';
                            opciones += "       </div>"

                            opciones += '       <div class="col-md-4 text-center">';
                            opciones += '           <div style="display:block"><a class="remove ml10 text-red" id="' + row.Paso_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_quitar_adjunto_click(this);" title="Quitar"><i class="glyphicon glyphicon-remove-circle"></i>&nbsp;<span style="font-size:11px !important;">Quitar</span></a></div>';
                            opciones += "       </div>"

                            opciones += '       <div class="col-md-4 text-center">';
                            opciones += '           <div style="display:block"><a class="remove ml10 text-purple" id="' + row.Paso_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_adjuntar_archivo_click(this);" title="Adjuntar"><i class="fa fa-upload"></i>&nbsp;<span style="font-size:11px !important;">Adjuntar</span></a></div>';
                            opciones += "       </div>"


                        }
                        else {
                            opciones += '       <div class="col-md-12 text-center">';
                            opciones += '           <div style="display:block"><a class="remove ml10 text-purple" id="' + row.Paso_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_adjuntar_archivo_click(this);" title="Adjuntar"><i class="fa fa-upload"></i>&nbsp;<span style="font-size:11px !important;">Adjuntar</span></a></div>';
                            opciones += "       </div>"

                        }


                        opciones += "</div>"

                        return opciones;
                    }

                },

                {
                    field: 'Paso_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',
                    width: '10%',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Paso_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_paso_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;">Editar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },


                //{
                //    field: 'Paso_Id',
                //    title: '',
                //    align: 'right',
                //    valign: 'top',
                //    halign: 'center',

                //    formatter: function (value, row) {

                //        var opciones = '<div style=" text-align: center;">';
                //         opciones += '</div>';

                //        return opciones;
                //    }
                //},


                {
                    field: 'Paso_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',
                    width: '10%',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Paso_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_paso_click(this);" title="EliminarPaso"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico' + '[crear_tabla]', e.message);
    }
}


//  -----------------------------------------------------
//  -----------------------------------------------------
function _mostrar_vista(vista_) {

    switch (vista_) {

        case "Principal":
            $('#Operacion').hide();
            $('#Asignacion').hide();
            $('#Principal').show();
            break;

        case "Operacion":
            $('#Principal').hide();
            $('#Asignacion').hide();
            $('#Operacion').show();
            break;

        case "Asignacion":
            $('#Operacion').hide();
            $('#Principal').hide();
            $('#Asignacion').show();
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


                    $('option', '#cmb_estatus').remove();
                    $('#cmb_estatus').append('<option value=""><-SELECCIONE-></option>');
                    for (var Indice_Estatus = 0; Indice_Estatus < datos_combo.length; Indice_Estatus++) {
                        $('#cmb_estatus').append('<option value="' + datos_combo[Indice_Estatus].Estatus_ID + '">' + datos_combo[Indice_Estatus].Estatus.toUpperCase() + '</option>');
                    }
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

        filtros.Tamite_Id = 0;
        filtros.Nombre = $('#txt_nombre_busqueda').val();
        filtros.Estatus_Id = ($('#cmb_estatus_filtro').val() === null || $('#cmb_estatus_filtro').val() === "") ? 0 : parseInt($('#cmb_estatus_filtro').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Consultar_TramitesFiltro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_tramites').bootstrapTable('load', datos);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error ', e);
    }
}


//  *******************************************************************************************************************************
//  *******************************************************************************************************************************
///********************CONSULTAS**************///
//  *******************************************************************************************************************************
function _Consultar_Pasos() {
    var filtros = null;
    try {
        filtros = new Object();

        filtros.Tramite_Id = parseInt($('#txt_tramite_pasos_id').val());


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Consultar_Pasos',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_pasos').bootstrapTable('load', datos);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error ', e);
    }
}

//  -----------------------------------------------------
//  -----------------------------------------------------
function _inicializar_vista_modal() {
    try {

        _eventos_modal();
        _limpiar_todos_controles_modal();

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


//  -----------------------------------------------------
//  -----------------------------------------------------
function _inicializar_vista_modal_pasos() {
    try {
        crear_tabla_relacion_pasos();
        _eventos_modal_pasos();

        _inicializar_controls_file();
        _eventos_adjuntar();

        _keyDownInt('txt_orden_paso');

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}

function _inicializar_vista_adjuntar() {
    try {

        _inicializar_controls_file();
        _eventos_adjuntar();

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

function _limpiar_todos_controles_modal() {

    try {
        $('input[type=text]').each(function () { $(this).val(''); });
        $('input[type=hidden]').each(function () { $(this).val(''); });



    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'limpiar controles. ' + e);
    }
}

function _limpiar_todos_controles_modal_pasos() {

    try {
        $('#modal_pasos :input[type=text]').each(function () { $(this).val(''); });
        $('#modal_pasos :input[type=hidden]').each(function () { $(this).val(''); });



    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'limpiar controles. ' + e);
    }
}

//  ---------------------------------------------------------------------------------
//  ---------------------------------------------------------------------------------
function _eventos_modal() {
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
            _limpiar_todos_controles_modal();
            _cancelar_modal_click();
        });
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


function _eventos_modal_pasos() {
    try {
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        $('#btn_agregar').on('click', function (e) {
            e.preventDefault();

            var title = $('#btn_agregar').attr('title');

            var valida_datos_requerido = _validarDatos_pasos();
            if (valida_datos_requerido.Estatus) {

                if (title == "Guardar") {
                    alta_paso();
                }
                else {
                    actualizar_paso();
                }
            }
            else {
                _mostrar_mensaje('Información', valida_datos_requerido.Mensaje);
            }

        });

        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        //
        $('#btn_cancelar_actualizacion_pasos').on('click', function (e) {
            e.preventDefault();

            _limpiar_todos_controles_modal_pasos();
            _habilitar_controles_modal_pasos('Nuevo');

            $("#btn_cancelar_actualizacion_pasos").prop("disabled", true);

        });

        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


function _inicializar_controls_file() {

    $("#fl_adjuntar_archivo_productos").fileinput({

        overwriteInitial: false,
        showClose: true,
        showPreview: false,
        browseLabel: '',
        uploadLabel: '',
        removeLabel: '',
        maxFileSize: 10000,
        browseTitle: 'Seleccionar imagen',
        browseIcon: '<i class="glyphicon glyphicon-folder-open"></i>',
        browseClass: 'btn btn-success',
        showUpload: false,
        removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
        removeTitle: 'Cancelar',
        removeClass: 'btn btn-danger',
        uploadClass: 'btn btn-info',
        //msgErrorClass: 'alert alert-block alert-danger',
        allowedFileExtensions: ["jpg", "png", "gif"],
        msgInvalidFileExtension: 'Extensión inválida para el archivo "{name}". Solo los archivos "{extensions}" son compatibles.',
        elErrorContainer: '#bugs',
    });
}

function _eventos_adjuntar() {

    $('#btn_leer_archivo').on('click', function (e) {
        e.preventDefault();
        var guardar = _guardar_archivo_importacion();


    });

}


function _guardar_archivo_importacion() {
    var Archivos = $("#fl_adjuntar_archivo_productos").get(0).files;

    var data = new FormData();
    var Ruta = '';
    var _out = new Object();
    var Id;
    var archivo_final;

    _out.Estatus = false;

    try {

        if (Archivos.length > 0) {

            id = $('#txt_pasos_adjunto_id').val();

            var nombre = Archivos[0].name;
            var ruta = "Reportes/Importaciones";
            archivo_final = id + "." + Archivos.type;

            data.append("file", Archivos[0]);
            data.append("nombre", nombre);
            data.append("url_", ruta);

            //Ruta = '../../../' + ruta;
            Ruta = '../../../' + ruta + '/' + Archivos[0].name;

            var guardar = _guardar_archivo_directorio(data);

            if (guardar.Estatus === "success") {

                actualizar_adjunto(Archivos[0], '../../../' + ruta + '/' + guardar.Titulo);
                //actualizar_adjunto(Archivos[0], Ruta);
            }
        }
    } catch (e) {
        _out.Estatus = false;
    }

    return _out;
}

function _guardar_archivo_directorio(data) {
    var estatus = false;
    var resultado = '';
    try {
        $.ajax({
            type: "POST",
            url: "../../FileUploadHandler.ashx",
            contentType: false,
            processData: false,
            data: data,
            async: false,
            success: function (result) {
                resultado = JSON.parse(result);
                if (result) {
                    estatus = true;
                }
            }
        });
    } catch (e) {
        estatus = false;
        _mostrar_mensaje('Informe técnico', e);
    }
    return resultado;
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
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El nombre del tramite.<br />';
        }

        if (_output.Mensaje != "") {
            _output.Mensaje = "Favor de proporcionar lo siguiente: <br />" + _output.Mensaje;
        }


    } catch (e) {
        _mostrar_mensaje('Informe técnico' + '[_validarDatos_Nuevo]', e);
    } finally {
        return _output;
    }
}


///*******************Validaciones*************************///
function _validarDatos_pasos() {
    var _output = new Object();

    try {
        _output.Estatus = true;
        _output.Mensaje = '';

        if ($('#txt_descripcion_paso').val() == '' || $('#txt_descripcion_paso').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La descripción.<br />';
        }


        if ($('#txt_orden_paso').val() == '' || $('#txt_orden_paso').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El número de orden.<br />';
        }

        if (_output.Mensaje != "") {
            _output.Mensaje = "Favor de proporcionar lo siguiente: <br />" + _output.Mensaje;
        }


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

        obj.Tramite_Id = 0;
        obj.Nombre = $('#txt_nombre').val();
        obj.Estatus_Id = ($('#cmb_estatus').val() === null || $('#cmb_estatus').val() === "") ? 0 : parseInt($('#cmb_estatus').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Alta',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _ConsultarFiltros();
                        _cancelar_modal_click();
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



///********************BD***************///
function actualizar_adjunto(nombre, url) {
    var obj = new Object();


    try {

        obj.Tramite_Id = parseInt($('#txt_tramite_pasos_id').val());

        obj.Paso_Id = parseInt($('#txt_pasos_adjunto_id').val());
        obj.Nombre_Archivo = nombre.name;
        obj.Url_Archivo = url;


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Actualizar_Adjunto',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _set_close_adjunto();

                        _Consultar_Pasos();

                        setTimeout(function () {
                            $.ajax({
                                url: '../Reporting/Frm_Eliminar_Archivos.aspx?accion=delete_pdf&url_pdf=' + result.Url_PDF,
                                type: 'POST',
                                async: false,
                                cache: false,
                                contentType: 'application/json; charset=utf-8',
                                datatype: 'json',
                                success: function (data) { }
                            });
                        }, 3000);

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


function alta_paso() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Tramite_Id = parseInt($('#txt_tramite_pasos_id').val());
        obj.Descripcion = $('#txt_descripcion_paso').val();
        obj.Orden = parseInt($('#txt_orden_paso').val());


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Alta_Pasos',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _Consultar_Pasos();
                        $('#modal_pasos :input[type=text]').each(function () { $(this).val(''); });


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


function actualizar_paso() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Paso_Id = parseInt($('#txt_pasos_id').val());
        obj.Tramite_Id = parseInt($('#txt_tramite_pasos_id').val());
        obj.Descripcion = $('#txt_descripcion_paso').val();
        obj.Orden = parseInt($('#txt_orden_paso').val());


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Actualizar_Pasos',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _Consultar_Pasos();

                        $('#modal_pasos :input[type=text]').each(function () { $(this).val(''); });

                        $("#btn_cancelar_actualizacion_pasos").prop("disabled", true);

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


        obj.Tramite_Id = parseInt($('#txt_tramite_id').val());
        obj.Nombre = $('#txt_nombre').val();
        obj.Estatus_Id = ($('#cmb_estatus').val() === null || $('#cmb_estatus').val() === "") ? 0 : parseInt($('#cmb_estatus').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Actualizar',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        //_mostrar_vista('Principal');
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _ConsultarFiltros();
                        _cancelar_modal_click();
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

    _limpiar_todos_controles_modal();


    $('#txt_tramite_id').val(row.Tramite_Id);
    $('#txt_nombre').val(row.Nombre);


    _habilitar_controles("Modificar");
    _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Actualizar Trámite');
}

function btn_editar_paso_click(tab) {
    var row = $(tab).data('orden');

    $("#btn_cancelar_actualizacion_pasos").prop("disabled", false);
    _limpiar_todos_controles_modal();


    $('#txt_pasos_id').val(row.Paso_Id);
    $('#txt_tramite_pasos_id').val(row.Tramite_Id);
    $('#txt_descripcion_paso').val(row.Descripcion);
    $('#txt_orden_paso').val(row.Orden);


    _habilitar_controles_modal_pasos("Modificar");
}

function btn_pasos_click(tab) {
    var row = $(tab).data('orden');

    _limpiar_todos_controles_modal_pasos();
    crear_tabla_relacion_pasos();
    $('#txt_tramite_pasos_id').val(row.Tramite_Id);
    _Consultar_Pasos();

    $("#btn_cancelar_actualizacion_pasos").prop("disabled", true);;
    _habilitar_controles_modal_pasos("Nuevo");
    _launch_modal_relacion('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Agregar Requisito [' + row.Nombre + ']');
}


function btn_adjuntar_archivo_click(tab) {
    var row = $(tab).data('orden');


    $('#txt_pasos_adjunto_id').val(row.Paso_Id);

    _launch_adjunto('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Adjuntar');
}

function btn_ver_adjunto_click(tab) {
    var row = $(tab).data('orden');

    var Tramite_Id = row.Tramite_Id;
    var Paso_Id = row.Paso_Id;
    var Ruta = '../../Tramites/' + Tramite_Id + '/' + Paso_Id + ".png";

    $('#img_adjunto_ver').attr('src', Ruta);

    _launch_veradjunto();
}



function btn_quitar_adjunto_click(tab) {



    try {

        var row = $(tab).data('orden');
        var Paso_Id = row.Paso_Id;
        var Tramite_Id = row.Tramite_Id;

        var obj = new Object();

        obj.Tramite_Id = parseInt(Tramite_Id);
        obj.Paso_Id = parseInt(Paso_Id);


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Actualizar_Adjunto',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos != null) {
                    var result = JSON.parse(datos.d);
                    if (result.Estatus == 'success') {
                        _mostrar_mensaje(result.Titulo, result.Mensaje);
                        _set_close_adjunto();

                        _Consultar_Pasos();
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

                filtros.Tramite_Id = row.Tramite_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/TramitesController.asmx/Eliminar',
                    data: $data,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            var result = JSON.parse(datos.d);
                            if (result.Estatus == 'success') {
                                _ConsultarFiltros();
                            }
                            else {

                                _mostrar_mensaje(result.Titulo, result.Mensaje);
                            }
                        }
                    }
                });
            }
        }
    });
}




function btn_eliminar_paso_click(tab) {
    var row = $(tab).data('orden');

    bootbox.confirm({
        title: 'ELIMINAR Registro',
        message: 'Esta seguro de Eliminar el registro seleccionado?',
        callback: function (result) {
            if (result) {

                //  documentos
                var filtros = null;
                filtros = new Object();

                filtros.Paso_Id = row.Paso_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/TramitesController.asmx/Eliminar_Paso_Tramite',
                    data: $data,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            var result = JSON.parse(datos.d);
                            if (result.Estatus == 'success') {
                                _Consultar_Pasos();

                            }
                            else {

                                _mostrar_mensaje(result.Titulo, result.Mensaje);
                            }
                        }
                    }
                });
            }
        }
    });
}


function _launch_modal(title_window) {
    _set_title_modal_(title_window);
    jQuery('#modal_vacunas').modal('show', { backdrop: 'static', keyboard: false });
}


function _set_title_modal_(Titulo) {
    $("#lbl_titulo_modal").html(Titulo);
}

function _cancelar_modal_click() {
    _set_close_modal(true);

}


function _set_close_modal(state) {
    closeModalEmbarqueVenta = state;
    jQuery('#modal_vacunas').modal('hide');
}



//  modla relacion
function _launch_modal_relacion(title_window) {
    _set_title_modal_relacion(title_window);
    jQuery('#modal_pasos').modal('show', { backdrop: 'static', keyboard: false });
}


function _set_title_modal_relacion(Titulo) {
    $("#lbl_titulo_modal_pasos").html(Titulo);
}

function _cancelar_modal_relacion_click() {
    _set_close_modal_relacion(true);

}

function _set_close_modal_relacion(state) {
    closeModalEmbarqueVenta = state;
    jQuery('#modal_pasos').modal('hide');
}



//  modla relacion
function _launch_adjunto(title_window) {
    _set_title_adjunto(title_window);
    jQuery('#adjuntar').modal('show', { backdrop: 'static', keyboard: false });
}


function _set_title_adjunto(Titulo) {
    $("#lbl_titulo_adjuntar").html(Titulo);
}

function _cancelar_adjunto_click() {
    _set_close_adjunto(true);

}

function _set_close_adjunto(state) {
    closeModalEmbarqueVenta = state;
    jQuery('#adjuntar').modal('hide');
}



//  modal ver adjunto
function _launch_veradjunto() {
    jQuery('#Ver').modal('show', { backdrop: 'static', keyboard: false });
}


function _cancelar_adjunto_click() {
    _set_close_veradjunto(true);

}

function _set_close_veradjunto(state) {
    closeModalEmbarqueVenta = state;
    jQuery('#Ver').modal('hide');
}


//  -----------------------------------------------------
//  -----------------------------------------------------

function expandTable($detail, row) {
    _crear_tbl_Expandir_Vacunas($detail.html('<table class="table table-responsive header-subtable table-dark" ></table>').find('table'), row);
}



//  -----------------------------------------------------
//  -----------------------------------------------------
function _crear_tbl_Expandir_Vacunas($el, rows) {

    var filtro = new Object();
    var Datos = [];

    try {

        filtro.Mes_Id = rows.Mes_Id;
        $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtro) });

        $.ajax({
            type: 'POST',
            url: 'controllers/TramitesController.asmx/Consultar_Vacunas_Meses_Relacion',
            data: $data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                Datos = JSON.parse(result.d);
            }
        });
        $el.bootstrapTable('destroy');
        $el.bootstrapTable({
            cache: false,
            striped: true,
            pagination: false,
            smartDisplay: false,
            search: false,
            showColumns: false,
            showRefresh: false,
            showHeader: true,
            minimumCountColumns: 2,

            columns: [

                { field: 'Vacuna', title: 'Vacuna', align: 'left', valign: 'top', visible: true, sortable: true },




            ], data: Datos,
        });

    } catch (e) {
        _mostrar_mensaje('Informe Técnico', e);
    }
}
