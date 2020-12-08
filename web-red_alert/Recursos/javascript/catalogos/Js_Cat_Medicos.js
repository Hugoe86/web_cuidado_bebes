var _index = null;
var row_partida = null;

$(document).on('ready', function () {
    _load_vistas();
  
});


function _load_vistas() {
    _launchComponent('vistas/Medicos/Principal.html', 'Principal');
    _launchComponent('vistas/Medicos/Operacion.html', 'Operacion');    
    _launchComponent('vistas/Medicos/Relacion.html', 'Relacion');
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
        crear_tabla_medicos();
        _set_location_toolbar('toolbar');
        _load_estatus('cmb_estatus_filtro');
        _load_cmbEspecialidad('cmb_especialidad_filtro');
        _eventos_principal();
        _mostrar_vista('Principal');

        _ConsultarFiltros();
       
    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


function _inicializar_grupo_radiobutton() {
    $('input.icheck-11').iCheck('destroy');
    $('input.icheck-11').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
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
        _load_cmb_hospital('cmb_hospitales');

        //  se limpian los controles
        _limpiar_todos_controles_modal_relacion();


    } catch (e) {
        //  se muestra el mensaje del error que se presento
        _mostrar_mensaje('Error Técnico' + ' [_inicializar_vista_modal_relacion] ', e);
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


function crear_tabla_medicos() {

    try {
        $('#tbl_medicos').bootstrapTable('destroy');
        $('#tbl_medicos').bootstrapTable({
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
                { field: 'Medico_Id', title: 'Medico_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Especialidad_Id', title: 'Especialidad_Id', align: 'center', valign: 'top', visible: false },
                { field: 'Estatus_Id', title: 'Estatus_Id', align: 'center', valign: 'top', visible: false },

                { field: 'Apellido_Paterno', title: 'Apellido Paterno', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Apellido_Materno', title: 'Apellido Materno', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Nombre', title: 'Nombre', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'No_Cedula', title: 'No_Cedula', align: 'center', valign: 'top', visible: false, sortable: true },
                { field: 'Especialidad', title: 'Especialidad', align: 'left', valign: 'top', visible: true, sortable: true },

                { field: 'Email', title: 'Correo Electónico', align: 'center', valign: 'top', visible: true, sortable: true },
                { field: 'Telefono', title: 'Teléfono', align: 'center', valign: 'top', visible: false, sortable: true },

                {
                    field: 'Medico_Id',
                    title: 'Editar',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-purple" id="' + row.Adjunto_ID + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_editar_click(this);" title="Editar"><i class="glyphicon glyphicon-edit"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
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
                         opciones = '<div style=" text-align: center;">';
                         opciones += '<div style="display:block"><a class="remove ml10 text-blue" id="' + row.Medico_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_relacionar_click(this);" title="Relacionar"><i class="glyphicon glyphicon-tags"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
                         opciones += '</div>';

                         return opciones;
                     }
                 },



                {
                    field: 'Medico_Id',
                    title: 'Eliminar',
                    align: 'right',
                    valign: 'top',
                    halign: 'center',

                    formatter: function (value, row) {

                        var opciones = '<div style=" text-align: center;">';
                        opciones += '<div style="display:block"><a class="remove ml10 text-red" id="' + row.Documento_Id + '" href="javascript:void(0)" data-orden=\'' + JSON.stringify(row) + '\' onclick="btn_eliminar_click(this);" title="Editar"><i class="glyphicon glyphicon-trash"></i>&nbsp;<span style="font-size:11px !important;"></span></a></div>';
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
            _inicializar_grupo_radiobutton();
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



function _load_cmbEspecialidad(cmb) {
    var filtros = null;
    try {

        filtros = new Object();
        filtros.Especialidad_Id = 0;
        filtros.Estatus_Id = 2;
        filtros.Especialidad = "";
        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        jQuery.ajax({
            type: 'POST',
            url: 'controllers/Especialidades_Controller.asmx/Consultar_EspecialidadesFiltro',
            data: $data,
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
                        options += '<option value="' + datos_combo[Indice_Estatus].Especialidad_Id + '">' + datos_combo[Indice_Estatus].Especialidad.toUpperCase() + '</option>';
                    }
                    select.append(options);
                }
                else {
                    var select = $('#' + cmb);
                    $('option', select).remove();

                    var options = '<option value=""><-SELECCIONE-></option>';
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
        filtros.Especialidad_Id = ($('#cmb_especialidad_filtro').val() === null || $('#cmb_especialidad_filtro').val() === "") ? 0 : parseInt($('#cmb_especialidad_filtro').val());
        filtros.Nombre = $("#txt_nombre_busqueda").val();
        filtros.Apellido_Paterno = $("#txt_apellido_paterno_busqueda").val();
        filtros.Apellido_Materno = $("#txt_apellido_materno_busqueda").val();
        filtros.Email = $("#txt_email_busqueda").val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/MedicosController.asmx/Consultar_Medicos_Filtro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_medicos').bootstrapTable('load', datos);
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
        _load_cmbEspecialidad('cmb_especialidad');
        _limpiar_todos_controles_procesos();
        _keyDownInt('txt_telefono');
        //_keyDownInt('txt_no_interior');
        //_keyDownInt('txt_no_exterior');
        _inicializar_controls_file_operacion();

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
        $('#img_foto_medico').attr('src', '../../../../Recursos/img/logo.jpg')
        $('#ck_urgencias').attr('checked',false);
        $('#cmb_especialidad').val('');
        $('#cmb_estatus').val('');
        $("#fl_adjuntar_archivo_operacion").val('');    
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
                    alta();
                }
                else {
                    actualizar();
                }

                $("#fl_adjuntar_archivo_operacion").fileinput('destroy');
                _inicializar_controls_file_operacion();
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
        /* =============================================
      --NOMBRE_FUNCIÓN:       btn_cargar_foto
      --DESCRIPCIÓN:          Evento con el que sube el archivo a la carpeta de temporales
      --PARÁMETROS:           e: parametro que se refiere al evento click
      --CREO:                 Hugo Enrique Ramírez Aguilera
      --FECHA_CREO:           24 Octubre de 2019
      --MODIFICÓ:
      --FECHA_MODIFICÓ:
      --CAUSA_MODIFICACIÓN:
      =============================================*/
        $('#btn_cargar_foto').on('click', function (e) {
            e.preventDefault();
        
            //  guarda el archivo en el servidor
            var guardar = _guardar_validar_archivo_importacion();

        });

        $('#btn_quitar_imagen').on('click', function (e) {
            alert('hola')
        })

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
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El nombre.<br />';
        }

        if ($('#txt_apellido_paterno').val() == '' || $('#txt_apellido_paterno').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El apellido paterno.<br />';
        }

        /*if ($('#txt_apellido_materno').val() == '' || $('#txt_apellido_materno').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El apellido materno.<br />';
        }*/

        if ($('#cmb_estatus').val() == '' || $('#cmb_estatus').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El estatus.<br />';
        }

        if ($('#cmb_especialidad').val() == '' || $('#cmb_especialidad').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La especialidad.<br />';
        }

        
        if ($('#txt_email').val() != '') {

            if (!_validar_email($('#txt_email').val())) {

                _output.Estatus = false;
                _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El correo no es válido.<br />';
            }            
        }

        if ($('#txt_telefono').val() != '') {

            if ($('#txt_telefono').val().length <= 9) {
                _output.Estatus = false;
                _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El teléfono.<br />';
            }
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
        obj.Especialidad_Id = $('#cmb_especialidad').val();
        obj.Nombre = $('#txt_nombre').val();
        obj.Apellido_Paterno = $('#txt_apellido_paterno').val();
        obj.Apellido_Materno = $('#txt_apellido_materno').val();

        obj.Email = $('#txt_email').val();
        obj.Telefono = $('#txt_telefono').val();
        obj.No_Cedula = $('#txt_nocedula').val();
        //nuevos campos
        obj.Imagen = $('#img_foto_medico').attr('src');
        obj.Imagen = obj.Imagen.split('../../../')[1];
        

        if ($('#ck_urgencias').attr('checked')) {
            obj.Emergencias = true;
        }
        else {
            obj.Emergencias = false;
        }
     

        //obj.Calle = $('#txt_calle').val();
        //obj.Num_Interior = $('#txt_no_interior').val();
        //obj.Num_Exterior = $('#txt_no_exterior').val();
        //obj.Cp = $('#txt_cp').val();
        //obj.Colonia = $('#txt_colonia').val();
        //obj.Municipio = $('#txt_municipio').val();
        //obj.Estado = $('#txt_estado').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/MedicosController.asmx/Alta',
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

        obj.Medico_Id = $('#txt_medico_id').val();
        obj.Estatus_Id = $('#cmb_estatus').val();
        obj.Especialidad_Id = $('#cmb_especialidad').val();
        obj.Nombre = $('#txt_nombre').val();
        obj.Apellido_Paterno = $('#txt_apellido_paterno').val();
        obj.Apellido_Materno = $('#txt_apellido_materno').val();

        obj.Email = $('#txt_email').val();
        obj.Telefono = $('#txt_telefono').val();
        obj.No_Cedula = $('#txt_nocedula').val();
        obj.Imagen = $('#img_foto_medico').attr('src');
        obj.Imagen = obj.Imagen.split('../../../')[1];

        //si el usuario eliminó la foto del medico, se vuelve a poner como NULL en la base de datos
        if (obj.Imagen == "../Recursos/img/logo.jpg") {
            obj.Imagen = null;
        }

        if ($('#ck_urgencias').attr('checked')) {
            obj.Emergencias = true;
        }
        else {
            obj.Emergencias = false;
        }

        //obj.Calle = $('#txt_calle').val();
        //obj.Num_Interior = $('#txt_no_interior').val();
        //obj.Num_Exterior = $('#txt_no_exterior').val();
        //obj.Cp = $('#txt_cp').val();
        //obj.Colonia = $('#txt_colonia').val();
        //obj.Municipio = $('#txt_municipio').val();
        //obj.Estado = $('#txt_estado').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(obj) });

        $.ajax({
            type: 'POST',
            url: 'controllers/MedicosController.asmx/Actualizar',
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

    $('#txt_medico_id').val(row.Medico_Id);
    $('#txt_nombre').val(row.Nombre);
    $('#txt_apellido_paterno').val(row.Apellido_Paterno);
    $('#txt_apellido_materno').val(row.Apellido_Materno);

    if (row.Estatus != null) {
        $('#cmb_estatus').val(row.Estatus_Id);
    }

    if (row.Especialidad_Id != null) {
        $('#cmb_especialidad').val(row.Especialidad_Id);
    }

    $('#txt_nocedula').val(row.No_Cedula);
    $('#txt_telefono').val(row.Telefono);
    $('#txt_email').val(row.Email);
    if (row.Imagen != null) {
        $('#img_foto_medico').attr('src', '../../../' + row.Imagen);
        $("#btn_eliminar_img").css("display", "block");
    }
    else {

        $('#').attr('src', '../../../../Recursos/img/logo.jpg')
        $("#btn_eliminar_img").css("display", "none");
    }

    if(row.Emergencias) {
        $('#ck_urgencias').attr('checked',true);
    }
    ////  datos de la direccion
    //$('#txt_calle').val(row.Calle);
    //$('#txt_no_interior').val(row.Num_Interior);
    //$('#txt_no_exterior').val(row.Num_Exterior);
    //$('#txt_cp').val(row.Cp);
    //$('#txt_colonia').val(row.Colonia);
    //$('#txt_municipio').val(row.Municipio);
    //$('#txt_estado').val(row.Estado);
    

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

                filtros.Medico_Id = row.Medico_Id;
                var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

                $.ajax({
                    type: 'POST',
                    url: 'controllers/MedicosController.asmx/Eliminar',
                    data: $data,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    cache: false,
                    success: function (datos) {
                        if (datos !== null) {
                            datos = JSON.parse(datos.d);

                            if (datos.Estatus == "error") {

                                _mostrar_mensaje("Error", "No se ha podido eliminar el registro, favor de intentarlo más tarde");
                            } else {

                                _mostrar_mensaje("Proceso Terminado", "Se ha eliminado el registro correctamente");
                            }                            

                            _ConsultarFiltros();
                        }
                    }
                });
            }
        }
    });
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
    $('#txt_medico_relacion_id').val(row.Medico_Id);

    //  se consultan la relacion con entridades
    _consultar_relacion();


    //  se muestra el modal
    _launch_modal_relacion('<i class="fa fa-list-alt" style="font-size: 25px; color: #0e62c7;"></i>&nbsp;&nbsp;Relacionar Medico-Hospital [' + row.Apellido_Paterno + ' ' + row.Apellido_Materno + ' ' + row.Nombre + ']');
}




/* =============================================
--NOMBRE_FUNCIÓN:       _guardar_validar_archivo_importacion
--DESCRIPCIÓN:          Guarda el archivo dentro del servidor
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           24 Octubre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _guardar_validar_archivo_importacion() {

    var archivos = $("#fl_adjuntar_archivo_operacion").get(0).files;//  variable con la que se obtiene el documento
    var data = new FormData();//    variabla para saber los bits del documento
    var ruta = '';//    variable para saber la ruta en donde se guardara el archivo
    var salida = new Object();//  variable para almacenar el resultado de la operacion
    var archivo_final;//    variable para el archivo final

    salida.Estatus = false;

    try {

        //  validamos que exista el documento
        if (archivos.length > 0) {

            var nombre = archivos[0].name;//    variable para obtener el nombre del documento
            var ruta_importacion = "Reportes/Importaciones";//  variable para obtener la ruta en donde se guardara el documento


            data.append("file", archivos[0]);
            data.append("nombre", nombre);
            data.append("url_", ruta_importacion);
            data.append("tipo", archivos[0].type);

            ruta = ruta_importacion + '/' + archivos[0].name;

            var guardar = _guardar_archivo_directorio(data);//  variable para guardar el valor resultante de la operacion

            //  validamos que la operacion sea exitos
            if (guardar.Estatus === "success") {

                $('#txt_nombre_archivo_xml').val(archivos[0].name);
                $('#txt_tipo_archivo_xml').val(archivos[0].type);                
                $("#img_foto_medico").attr("src", '../../../' + ruta_importacion + '/' + guardar.Titulo);
                
                //  ../../../../
               // alert('ok');

            }
        }
    } catch (e) {
        salida.Estatus = false;
    }

    return salida;
}

/* =============================================
--NOMBRE_FUNCIÓN:       _guardar_archivo_directorio
--DESCRIPCIÓN:          Guarda el archivo dentro de una carpeta temporal
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           24 Octubre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _guardar_archivo_directorio(data) {
    var estatus = false;//  variable para establecer el estatus de la accion realizada
    var resultado = '';//   variable para indicar el resultado obtenido
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
                //  validamos que tenga informacion recibida
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


/* =============================================
--NOMBRE_FUNCIÓN:       _inicializar_controls_file_operacion
--DESCRIPCIÓN:          Establece las propiedades del control de fileinput
--PARÁMETROS:           NA
--CREO:                 Hugo Enrique Ramírez Aguilera
--FECHA_CREO:           24 Octubre de 2019
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _inicializar_controls_file_operacion() {

    $("#fl_adjuntar_archivo_operacion").fileinput({

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
        removeIcon: '<i class="glyphicon glyphicon-remove"  onClick="_eliminar_imagen()"></i>',
        removeTitle: 'Cancelar',
        removeClass: 'btn btn-danger',
        uploadClass: 'btn btn-info',
        //msgErrorClass: 'alert alert-block alert-danger',
        allowedFileExtensions: ["jpg"]["png"],
        msgInvalidFileExtension: 'Extensión inválida para el archivo "{name}". Solo los archivos "{extensions}" son compatibles.',
        elErrorContainer: '#bugs',
    });
}

/* =============================================
--NOMBRE_FUNCIÓN:       _eliminar_imagen
--DESCRIPCIÓN:          Elimina la imagen del medico que se encuentra editando
--PARÁMETROS:           NA
--CREO:                 Juan Carlos Gómez Rangel
--FECHA_CREO:           31 de Agosto de 2020
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _eliminar_imagen() {

    //volvemos a establecer el icono de imagen del medico
    $('#img_foto_medico').attr('src', '../../../../Recursos/img/logo.jpg');
    //ocultamos el boton de eliminar imagen
    $("#btn_eliminar_img").css("display", "none");
    //limpiamos el input file de la imagen del medico
    $("#fl_adjuntar_archivo_operacion").val('');
    $("#fl_adjuntar_archivo_operacion").fileinput('destroy');
    //inicializamos el control del input file con el plugin fileinput
    _inicializar_controls_file_operacion();
}


/* =============================================
--NOMBRE_FUNCIÓN:       _validar_caracteres_email
--DESCRIPCIÓN:          valida que el usuario sólo pueda teclear caracteres validos en una direccion de email, (evento onkeypress html)
--PARÁMETROS:           evt: hace referencia al evento de precionar una tecla dentro del control
--CREO:                 Juan Carlos Gómez Rangel
--FECHA_CREO:           8 de Septiembre de 2020
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _validar_caracteres_email(evt) {

    //variable que almacena el codigo de la tecla que se preciona
    var code = evt.which ? evt.which : evt.keyCode;

    if (code == 8) {//evaluamos si es la tecla de retroceso
        return true;        
    } else if (code == 64 || code == 95 || code == 46 || code == 45){//evaluamos el (@|_|.|-)
        return true;
    } else if (code >= 65 && code <=90) {//evaluamos si son letras mayusculas
        return true;
    } else if (code >= 97 && code <= 122) {//evaluamos si son letras minusculas
        return true;
    } else if (code >= 48 && code <= 57) {//evaluamos si es un numero        
        return true;
    } else {//si no es ningun numero o tecla de retroceso invalidamos la accion
        return false;
    }
}



/* =============================================
--NOMBRE_FUNCIÓN:       _validar_email
--DESCRIPCIÓN:          valida que el email introducido tenga la estructura correcta
--PARÁMETROS:           email: cadena de texto con el email
--CREO:                 Juan Carlos Gómez Rangel
--FECHA_CREO:           8 de Septiembre de 2020
--MODIFICÓ:
--FECHA_MODIFICÓ:
--CAUSA_MODIFICACIÓN:
=============================================*/
function _validar_email(email) {    

    //evaluamos que la estructura del email sea: usuario + @ + servidor + dominio
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(email)) {
        return true;
    } else {
        return false;
    }
}