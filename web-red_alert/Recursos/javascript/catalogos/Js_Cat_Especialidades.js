var _index = null;
var row_partida = null;

$(document).on('ready', function () {
    _load_vistas();
});


function _load_vistas() {
    _launchComponent('vistas/Especialidades/Principal.html', 'Principal');
    _launchComponent('vistas/Especialidades/Modal.html', 'Modal');
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
            _habilitar_controles("Nuevo");
            _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Alta');

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
        $('#tbl_especialidades').bootstrapTable('destroy');
        $('#tbl_especialidades').bootstrapTable({
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
                { field: 'Especialidad_Id', title: 'Especialidad_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Estatus_Id', title: 'Estatus_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Especialidad', title: 'Especialidad', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Estatus', title: 'Estatus', align: 'left', valign: 'top', visible: true, sortable: true },
               

                {
                    field: 'Especialidad_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Adjunto_ID + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;">Editar</span></a></div>';
                        opciones += '</div>';

                        return opciones;
                    }
                },

                {
                    field: 'Especialidad_Id',
                    title: '',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Documento_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Editar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;">Eliminar</span></a></div>';
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


        filtros.Especialidad = $("#txt_nombre_busqueda").val();
        filtros.Estatus_Id = ($('#cmb_estatus_filtro').val() === null || $('#cmb_estatus_filtro').val() === "") ? 0 : parseInt($('#cmb_estatus_filtro').val());
       
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Especialidades_Controller.asmx/Consultar_EspecialidadesFiltro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_especialidades').bootstrapTable('load', datos);
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
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El nombre de la especialidad.<br />';
        }
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



///********************BD***************///
function alta() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Estatus_Id = $('#cmb_estatus').val();
        obj.Especialidad = $('#txt_nombre').val();
    
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Especialidades_Controller.asmx/Alta',
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

function actualizar() {
    var obj = new Object();
    var clave = "";

    try {

        obj.Especialidad_Id = $('#txt_especialidad_id').val();
        obj.Estatus_Id = $('#cmb_estatus').val();
        obj.Especialidad = $('#txt_nombre').val();
       

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/Especialidades_Controller.asmx/Actualizar',
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

    _habilitar_controles('Modificar');

    $('#txt_especialidad_id').val(row.Especialidad_Id);
    $('#txt_nombre').val(row.Especialidad);
   
    if (row.Estatus != null) {
        $('#cmb_estatus').val(row.Estatus_Id);
    }

    _habilitar_controles("Modificar");
    _launch_modal('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Actualizar');
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

                filtros.Especialidad_Id = row.Especialidad_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/Especialidades_Controller.asmx/Eliminar',
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


function _launch_modal(title_window) {
    _set_title_modal_(title_window);
    jQuery('#modal_especialidad').modal('show', { backdrop: 'static', keyboard: false });
}

function _set_title_modal_(Titulo) {
    $("#lbl_titulo_modal").html(Titulo);
}

function _cancelar_modal_click() {
    _set_close_modal(true);

}


function _set_close_modal(state) {
    closeModalEmbarqueVenta = state;
    jQuery('#modal_especialidad').modal('hide');
}


