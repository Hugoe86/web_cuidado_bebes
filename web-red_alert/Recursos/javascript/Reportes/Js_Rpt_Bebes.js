var _index = null;
var row_partida = null;

$(document).on('ready', function () {
    _load_vistas();
});


function _load_vistas() {
    _launchComponent('vistas/Bebes/Principal.html', 'Principal');
}


function _launchComponent(component, id) {

    $('#' + id).load(component, function () {

        switch (id) {
            case 'Principal':
                _inicializar_vista_principal();
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
        crear_tabla_reporte();
        _inicializar_fechas();
        _set_location_toolbar('toolbar');
        _eventos_principal();
        _mostrar_vista('Principal');
        _limpiar_todos_controles_procesos();
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

        $('#btn_pdf').on('click', function (e) {
            e.preventDefault();
            _generar_pdf();
        });



        $('#btn_excel').on('click', function (e) {
            e.preventDefault();
            _generar_excel();
        });

        $('#btn_busqueda').on('click', function (e) {
            e.preventDefault();
            _ConsultarFiltros();
        });

    } catch (e) {
        _mostrar_mensaje('Error Técnico', e);
    }
}


//  *******************************************************************************************************************************
//  *******************************************************************************************************************************
//  fechas
//  *******************************************************************************************************************************
function _inicializar_fechas() {
    $('#dtp_txt_fecha_inicio').datetimepicker({
        defaultDate: new Date(),
        viewMode: 'days',
        locale: 'es',
        format: "DD/MM/YYYY"
    });
    $("#dtp_txt_fecha_inicio").datetimepicker("useCurrent", true);

    $('#dtp_txt_fecha_termino').datetimepicker({
        defaultDate: new Date(),
        viewMode: 'days',
        locale: 'es',
        format: "DD/MM/YYYY"
    });
    $("#dtp_txt_fecha_termino").datetimepicker("useCurrent", true);


}

function _habilitar_controles(opc) {

    try {
        switch (opc) {
            case 'Nuevo':
                $('#btn_guardar').attr('title', 'Guardar');
                break;

            case 'Modificar':
                $('#btn_guardar').attr('title', 'Actualizar');
                break;
        }

    } catch (e) {
        _mostrar_mensaje('Error Técnico' + ' [_habilitar_controles] ', e);
    }

}


function crear_tabla_reporte() {

    try {
        $('#tbl_bebes').bootstrapTable('destroy');
        $('#tbl_bebes').bootstrapTable({
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
                { field: 'BebeId', title: 'BebeId', align: 'center', valign: 'top', visible: false },


                { field: 'Apellidos', title: 'Apellidos', align: 'left', valign: 'top', visible: true, sortable: true },
                { field: 'Nombre', title: 'Nombre', align: 'left', valign: 'top', visible: true, sortable: true },

                {
                    field: 'StrFechaNacimiento', title: 'Fecha de nacimiento', align: 'center', valign: 'top', visible: true, sortable: true,
                },

                {
                    field: 'Peso', title: 'Peso', align: 'left', valign: 'right', visible: true, sortable: true,
                    formatter: function (value, row, index) {
                        return formatNumber(value);
                    }
                },
                {
                    field: 'EstaturaCm', title: 'Estatura en cm', align: 'left', valign: 'right', visible: true, sortable: true,
                    formatter: function (value, row, index) {
                        return formatNumber(value);
                    }
                },
                {
                    field: 'Sexo', title: 'Sexo', align: 'left', valign: 'right', visible: true, sortable: true,
                    formatter: function (value, row, index) {
                        if (row.Sexo == true) {
                            return 'FEMENINO';
                        }
                        else {
                            return 'MASCULINO'
                        }
                    }},
                { field: 'Padecimientos', title: 'Padecimientos', align: 'left', valign: 'top', visible: true, sortable: true },


            ]
        });
    } catch (e) {
        _mostrar_mensaje('Informe Técnico' + '[crear_tabla_reporte]', e.message);
    }
}


function formatNumber(num) {
    if (!num || num == 'NaN') return '-';
    if (num == 'Infinity') return '&#x221e;';
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num + '.' + cents);
}



//  -----------------------------------------------------
//  -----------------------------------------------------
function _mostrar_vista(vista_) {

    switch (vista_) {
        case "Principal":
            $('#Operacion').hide();
            $('#Principal').show();
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

        filtros.BebeId = 0;
        filtros.Nombre = $("#txt_nombre_busqueda").val();
        filtros.Apellidos = $("#txt_apellidos_busqueda").val();

        filtros.Fecha_Inicio = $('#txt_fecha_inicio').val();
        filtros.Fecha_Termino = $('#txt_fecha_termino').val();


        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/RptBebesController.asmx/Consultar_Bebes_Filtro',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    datos = JSON.parse(datos.d);
                    $('#tbl_bebes').bootstrapTable('load', datos);
                }
            }
        });
    } catch (e) {
        _mostrar_mensaje('Error ', e);
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



    } catch (e) {
        _mostrar_mensaje('Error Técnico', 'limpiar controles. ' + e);
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

        if ($('#txt_apellido_materno').val() == '' || $('#txt_apellido_materno').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El apellido materno.<br />';
        }

        if ($('#cmb_estatus').val() == '' || $('#cmb_estatus').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El estatus.<br />';
        }

        if ($('#cmb_especialidad').val() == '' || $('#cmb_especialidad').val() == undefined) {
            _output.Estatus = false;
            _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;La especialidad.<br />';
        }


        //if ($('#txt_email').val() == '' || $('#txt_email').val() == undefined) {
        //    _output.Estatus = false;
        //    _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El correo.<br />';
        //}
        //if ($('#txt_telefono').val() == '' || $('#txt_telefono').val() == undefined) {
        //    _output.Estatus = false;
        //    _output.Mensaje += '&nbsp;<i class="fa fa-angle-double-right"></i>&nbsp;El teléfono.<br />';
        //}



        if (_output.Mensaje != "") {
            _output.Mensaje = "Favor de proporcionar lo siguiente: <br />" + _output.Mensaje;
        }


    } catch (e) {
        _mostrar_mensaje('Informe técnico' + '[_validarDatos_Nuevo]', e);
    } finally {
        return _output;
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




//******************Exportaciones*********************///
function _generar_pdf() {

    var filtros = new Object();

    try {

        filtros.UsuarioMovilId = 0;
        filtros.Nombre = $("#txt_nombre_busqueda").val();
        filtros.Apellidos = $("#txt_apellidos_busqueda").val();
        filtros.Correo = $("#txt_email_busqueda").val();

        filtros.Fecha_Inicio = $('#txt_fecha_inicio').val();
        filtros.Fecha_Termino = $('#txt_fecha_termino').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/RptBebesController.asmx/Genere_Reporte_PDF_Bebes',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var result = datos.d;

                    window.open(result.Url_PDF, "", "", true);

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
                }
            }
        });
    }
    catch (e) {
        //_showMessageWarning("Error Tecnico", e);
    }
}



function _generar_excel() {

    var filtros = new Object();

    try {

        filtros.UsuarioMovilId = 0;
        filtros.Nombre = $("#txt_nombre_busqueda").val();
        filtros.Apellidos = $("#txt_apellidos_busqueda").val();
        filtros.Correo = $("#txt_email_busqueda").val();

        filtros.Fecha_Inicio = $('#txt_fecha_inicio').val();
        filtros.Fecha_Termino = $('#txt_fecha_termino').val();

        var $data = JSON.stringify({ 'jsonObject': JSON.stringify(filtros) });

        $.ajax({
            type: 'POST',
            url: 'controllers/RptBebesController.asmx/Genere_Reporte_Excel_Usuarios',
            data: $data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            async: false,
            cache: false,
            success: function (datos) {
                if (datos !== null) {
                    var result = datos.d;

                    //window.open(result.Url_PDF, "", "", true);

                    window.location = "../Ayudante/Frm_Ayudante_Descarga_Excel.aspx?Url=" + result.Url_Excel + "&Nombre=" + result.Nombre_Excel;

                    setTimeout(function () {
                        $.ajax({
                            url: '../Reporting/Frm_Eliminar_Archivos.aspx?accion=delete_pdf&url_pdf=' + result.Ruta_Archivo_Excel,
                            type: 'POST',
                            async: false,
                            cache: false,
                            contentType: 'application/json; charset=utf-8',
                            datatype: 'json',
                            success: function (data) { }
                        });
                    }, 3000);
                }
            }
        });
    }
    catch (e) {
        //_showMessageWarning("Error Tecnico", e);
    }
}