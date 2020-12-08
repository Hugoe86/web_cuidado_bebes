var _index = null;
var row_partida = null;

$(document).on('ready', function () {
    _load_vistas();
});


function _load_vistas() {
    _launchComponent('vistas/Cartilla/Principal.html', 'Principal');
    _launchComponent('vistas/Cartilla/Modal.html', 'Modal');
    _launchComponent('vistas/Cartilla/ModalAsignacion.html', 'Modal_Asignacion');
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

            case 'Modal_Asignacion':
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
        _eventos_principal();
        _mostrar_vista('Principal');
        _keyDownInt('txt_no_mes_busqueda');

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
            _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Alta');
            _habilitar_controles("Nuevo");

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


/* =============================================
--NOMBRE_FUNCIÓN:       _habilitar_controles_relacion
--DESCRIPCIÓN:          Se le otorga un nombre al botón de nuevo con el que se estarán realizando las acciones de alta, modificar
--PARÁMETROS:           opc: sirve para establecer que acciones se realizan al botón
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           24 Octubre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _habilitar_controles_relacion(opc) {

    try {
        //  se le asignara el titulo al botón de nuevo
        switch (opc) {
            case 'Nuevo':
                //  se le otorga el nombre de guardar
                $('#btn_agregar').attr('title', 'Agregar');
                $('#btn_agregar span').html('Agregar');
                break;

            case 'Modificar':
                //  se le otorga el nombre de actualizar
                $('#btn_agregar').attr('title', 'Actualizar');
                $('#btn_agregar span').html('Actualizar');
                break;
        }

    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [_habilitar_controles] ', e);
    }

}


function crear_tabla() {

    try {
        $('#tbl_meses').bootstrapTable('destroy');
        $('#tbl_meses').bootstrapTable({
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

            detailView: true,
            onExpandRow: function (index, row, $detail) {
                expandTable($detail, row);
            },

            columns: [
                { field: 'Mes_Id', title: 'Vacuna_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Estatus_Id', title: 'Estatus_Id', align: 'center', valign: 'top', visible: false },
                { field: 'No_Mes', title: 'No. Meses', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Estatus', title: 'Estatus', align: 'left', valign: 'top', visible: true, sortable: true },


                {
                    field: 'Mes_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Mes_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;">Editar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },


                {
                    field: 'Mes_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-blue" id="' + row.Mes_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_relacion_click(this);" title="relacion"><i class="fa-plus-square"></i>&nbsp;<span style="font-size:11px !important;">Vacunas</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

                {
                    field: 'Mes_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Mes_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Editar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
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


function crear_tabla_relacion_Vacuna() {

    try {
        $('#tbl_relacion').bootstrapTable('destroy');
        $('#tbl_relacion').bootstrapTable({
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

                { field: 'Relacion_Id', title: 'Relacion_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Mes_Id', title: 'Vacuna_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Mes_Id', title: 'Vacuna_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Vacuna_Id', title: 'Estatus_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Vacuna', title: 'Vacuna', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Dosis', title: 'Dosis', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Enfermedad', title: 'Enfermedad que previene', align: 'left', valign: 'top', visible: true, sortable: true },


                {
                    field: 'Relacion_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Mes_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_vacuna_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;">Editar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

                {
                    field: 'Relacion_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Relacion_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_vacuna_click(this);" title="EliminarVacuna"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
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
                }
            }
        });
    } catch (e) {

    }
}



function _load_vacunas(cmb) {
    var filtros = null;
    try {
        jQuery.ajax({
            type: 'POST',
            url: 'controllers/VacunasController.asmx/ConsultarVacunasCombo',
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
                        options += '<option value="' + datos_combo[Indice_Estatus].Vacuna_Id + '">' + datos_combo[Indice_Estatus].Nombre.toUpperCase() + '</option>';

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

        filtros.Mes_Id = 0;
        filtros.Estatus_Id = ($('#cmb_estatus_filtro').val() === null || $('#cmb_estatus_filtro').val() === "") ? 0 : parseInt($('#cmb_estatus_filtro').val());
        filtros.No_Mes = ($('#txt_no_mes_busqueda').val() === null || $('#txt_no_mes_busqueda').val() === "") ? 0 : parseInt($('#txt_no_mes_busqueda').val()); // $("#txt_nombre_busqueda").val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/CartillaVacunacionController.asmx/Consultar_MesesFiltro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_meses').bootstrapTable('load', datos);
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
function _Consultar_RelacionVacunas() {
    var filtros = null;
    try {
        filtros = new Object();

        filtros.Mes_Id = parseInt($('#txt_mes_relacion_id').val());


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/CartillaVacunacionController.asmx/Consultar_Vacunas_Meses_Relacion',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_relacion').bootstrapTable('load', datos);
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
        _load_estatus('cmb_estatus');
        _limpiar_todos_controles_modal();
        _keyDownInt('txt_no_mes');

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


//  -----------------------------------------------------
//  -----------------------------------------------------
function _inicializar_vista_modal_relacion() {
    try {
        crear_tabla_relacion_Vacuna();
        _load_vacunas('cmb_vacuna');
        _eventos_modal_relacion();

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


function _limpiar_todos_controles_modal_editar() {

    try {
        $('input[type=text]').each(function () { $(this).val(''); });

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


function _eventos_modal_relacion() {

    try {
        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------
        $('#btn_agregar').on('click', function (e) {
            e.preventDefault();            

            var title = $('#btn_guardar').attr('title');//  almacenara el titulo que tiene el botón de nuevo

            var valida_datos_requerido = new Object();
            valida_datos_requerido = _validarDatos_vacuna();            

            if (valida_datos_requerido.Estatus) {
                

                //  validamos si es un nuevo registro, en caso contrario sera una actualización
                if (title == "Guardar") {
                    
                    //  se ejecuta el evento de alta
                    alta_relacion();
                }
                else {
                    //  se ejecuta el evento de actualización
                    actualizar_relacion('salir');
                }


            }
            else {
                _mostrar_mensaje('Información', valida_datos_requerido.Mensaje);
            }

        });

        //  ---------------------------------------------------------------------------------
        //  ---------------------------------------------------------------------------------

    } catch (ex) {
        _mostrar_mensaje('Error Técnico', ex);
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
        if ($('#txt_no_mes').val() == '' || $('#txt_no_mes').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El número del mes.<br />';
        }
        //if ($('#txt_meses').val() == '' || $('#txt_meses').val() == undefined) {
        //    _output.Estatus = false;
        //    _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El numero de meses.<br />';
        //}
        if ($('#cmb_estatus').val() == '' || $('#cmb_estatus').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El estatus.<br />';
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
function _validarDatos_vacuna() {
    var _output = new Object();

    try {
        _output.Estatus = true;
        _output.Mensaje = '';

        if ($('#cmb_vacuna').val() == '' || $('#cmb_vacuna').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La vacuna.<br />';
        }


        //  filtro para la dosis
        if ($('#txt_dosis').val() == '' || $('#txt_dosis').val() == undefined) {

            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La dosis.<br />';
        }

        //  filtro para la dosis
        if ($('#txt_enfermedad_cura').val() == '' || $('#txt_enfermedad_cura').val() == undefined) {

            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La enfermedad que cura.<br />';
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

        obj.Estatus_Id = parseInt($('#cmb_estatus').val());
        obj.No_Mes = parseInt($('#txt_no_mes').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/CartillaVacunacionController.asmx/Alta',
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


function alta_relacion() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Mes_Id = parseInt($('#txt_mes_relacion_id').val());
        obj.Vacuna_Id = parseInt($('#cmb_vacuna').val());
        obj.Dosis = $('#txt_dosis').val();
        obj.Enfermedad = $('#txt_enfermedad_cura').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/CartillaVacunacionController.asmx/Alta_Relacion',
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
                        _Consultar_RelacionVacunas();
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


function actualizar_relacion() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Relacion_Id = parseInt($('#txt_relacion_id').val());
        obj.Mes_Id = parseInt($('#txt_mes_relacion_id').val());
        obj.Vacuna_Id = parseInt($('#cmb_vacuna').val());
        obj.Dosis = ($('#txt_dosis').val());
        obj.Enfermedad = ($('#txt_enfermedad_cura').val());

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/CartillaVacunacionController.asmx/Actualizar_Relacion',
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
                        _Consultar_RelacionVacunas();

                        _limpiar_todos_controles_modal_editar();
                        _habilitar_controles_relacion("Nuevo");

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


        obj.Mes_Id = parseInt($('#txt_mes_id').val());
        obj.Estatus_Id = parseInt($('#cmb_estatus').val());
        obj.No_Mes = parseInt($('#txt_no_mes').val());



        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/CartillaVacunacionController.asmx/Actualizar',
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


    $('#txt_mes_id').val(row.Mes_Id);
    $('#txt_no_mes').val(row.No_Mes);

    if (row.Estatus != null) {
        $('#cmb_estatus').val(row.Estatus_Id);
    }

    _habilitar_controles("Modificar");
    _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Actualizar');
}



function btn_editar_vacuna_click(tab) {
    var row = $(tab).data('orden');

    _limpiar_todos_controles_modal_editar();

   
    $('#txt_relacion_id').val(row.Relacion_Id);

    if (row.Vacuna_Id != null) {
        $('#cmb_vacuna').val(row.Vacuna_Id);
    }


    $('#txt_dosis').val(row.Dosis);
    $('#txt_enfermedad_cura').val(row.Enfermedad);


    _habilitar_controles_relacion("Modificar");

}


function btn_relacion_click(tab) {

    var row = $(tab).data('orden');    

    $('#txt_mes_relacion_id').val(row.Mes_Id);
    _Consultar_RelacionVacunas();

    _habilitar_controles_relacion("Nuevo");

    _launch_modal_relacion('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Agregar vacuna [No. Meses: ' + row.No_Mes + ']');
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

                filtros.Mes_Id = row.Mes_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/CartillaVacunacionController.asmx/Eliminar',
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




function btn_eliminar_vacuna_click(tab) {
    var row = $(tab).data('orden');

    bootbox.confirm({
        title: 'ELIMINAR Registro',
        message: 'Esta seguro de Eliminar el registro seleccionado?',
        callback: function (result) {
            if (result) {

                //  documentos
                var filtros = null;
                filtros = new Object();

                filtros.Relacion_Id = row.Relacion_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/CartillaVacunacionController.asmx/Eliminar_Vacuna',
                    data: $data,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            var result = JSON.parse(datos.d);
                            if (result.Estatus == 'success') {
                                _Consultar_RelacionVacunas();
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
    jQuery('#modal_relacion').modal('show', { backdrop: 'static', keyboard: false });
}


function _set_title_modal_relacion(Titulo) {
    $("#lbl_titulo_modal_relacion").html(Titulo);
}

function _cancelar_modal_relacion_click() {
    _set_close_modal_relacion(true);

}

function _set_close_modal_relacion(state) {
    closeModalEmbarqueVenta = state;
    jQuery('#modal_relacion').modal('hide');
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
            url: 'controllers/CartillaVacunacionController.asmx/Consultar_Vacunas_Meses_Relacion',
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
