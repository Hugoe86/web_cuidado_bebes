﻿<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>

<%@ Page Title="" Language="C#" MasterPageFile="~/Paginas/Paginas_Generales/MasterPage.Master" AutoEventWireup="true" CodeBehind="Frm_Cat_Registro_Civil.aspx.cs" Inherits="web_red_alert.Paginas.Catalogos.Frm_Cat_Registro_Civil" %>

<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">


    <link href="../../Recursos/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <link href="../../Recursos/bootstrap-table/extensions/editable/bootstrap-editable.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/center_loader.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/demo_form.css" rel="stylesheet" />
    <link href="../../Recursos/plugins/toastr/toastr.css" rel="stylesheet" />
    <link href="../../Recursos/bootstrap-combo/select2.css" rel="stylesheet" />
    <script src="../../Recursos/lightbox/ekko-lightbox.min.js"></script>
    <script src="../../Recursos/jquery-validate/jquery.validate.min.js"></script>
    <script src="../../Recursos/xenon/js/xenon-widgets.js"></script>
    <script src="../../Recursos/xenon/js/xenon-custom.js"></script>
    <script src="../../Recursos/bootstrap-table-current/bootstrap-table.js"></script>
    <script src="../../Recursos/bootstrap-table-current/locale/bootstrap-table-es-MX.js"></script>
    <script src="../../Recursos/bootstrap-table/extensions/editable/bootstrap-editable.js"></script>
    <script src="../../Recursos/bootstrap-table/extensions/editable/bootstrap-table-editable.min.js"></script>
    <script src="../../Recursos/bootstrap-table-current/extensions/editable/bootstrap-table-editable.js"></script>
    <script src="../../Recursos/bootstrap-combo/select2.js"></script>
    <script src="../../Recursos/bootstrap-combo/es.js"></script>
    <script src="../../Recursos/plugins/center-loader.min.js"></script>
    <script src="../../Recursos/plugins/parsley.js"></script>
    <script src="../../Recursos/jquery-numeric/jquery.numeric.js"></script>
    <script src="../../Recursos/jquery-numeric/accounting.min.js"></script>
    <script src="../../Recursos/jquery-numeric/jquery.formatCurrency-1.4.0.min.js"></script>

    <script src="../../Recursos/icon-picker/js/iconPicker.js"></script>
    <link href="../../Recursos/icheck/skins/all.css" rel="stylesheet" />
    <script src="../../Recursos/icheck/icheck.min.js"></script>

    <link href="../../Recursos/bootstrap-date/bootstrap-datetimepicker.css" rel="stylesheet" />
    <script src="../../Recursos/bootstrap-date/bootstrap-datetimepicker.min.js"></script>
    <link href="../../Recursos/bootstrap-date/bootstrap-datetimepicker.css" rel="stylesheet" />

   

    <script src="../../Recursos/javascript/seguridad/Js_Controlador_Sesion.js"></script>
    <script src="../../Recursos/javascript/catalogos/Js_Cat_Registro_Civil.js"></script>
    <script src="../../Recursos/javascript/catalogos/Js_Cat_Ubicaciones_Relacion_Medico_Hospital.js"></script>
    <link href="../../Recursos/javascript/Mapas/Css_Estilo_Mapa_Ubicaciones.css" rel="stylesheet" />

</asp:Content>


<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">

    <div class="container-fluid" style="height: 100vh;">
        <div class="page-header">
            <h3 style="font-family: 'Roboto Light', cursive !important; font-size: 24px; font-weight: bold; color: #808080;">Cat&aacute;logo de Registro Civil </h3>
        </div>
        <div id="Principal"></div>
        <div id="Operacion"></div>
    </div>

    
    <div id="Relacion"></div>

    <%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
    <%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
    <%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>

    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDaX0vUlW5Q9A_apjIGCBowdndPCL7np5Q&callback=iniciar&libraries=places&v=weekly" defer></script>


    <%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
    <%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
    <%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
</asp:Content>

<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>



