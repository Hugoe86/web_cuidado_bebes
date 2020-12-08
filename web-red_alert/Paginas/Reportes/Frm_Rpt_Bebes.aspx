﻿
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>


<%@ Page Language="C#" 
    AutoEventWireup="true" 
    MasterPageFile="~/Paginas/Paginas_Generales/MasterPage.Master"
    CodeBehind="Frm_Rpt_Bebes.aspx.cs" 
    Inherits="web_red_alert.Paginas.Reportes.Frm_Rpt_Bebes" %>


<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <link href="../../Recursos/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <link href="../../Recursos/bootstrap-table/extensions/editable/bootstrap-editable.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/center_loader.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/demo_form.css" rel="stylesheet" />
    <link href="../../Recursos/plugins/toastr/toastr.css" rel="stylesheet" />
    <link href="../../Recursos/bootstrap-date/bootstrap-datetimepicker.css" rel="stylesheet" />
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

    <script src="../../Recursos/javascript/seguridad/Js_Controlador_Sesion.js"></script>
    <script src="../../Recursos/javascript/Reportes/Js_Rpt_Bebes.js"></script>


</asp:Content>


<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div class="container-fluid" style="height: 100vh;">
        <div class="page-header">
            <h3 style="font-family: 'Roboto Light', cursive !important; font-size: 24px; font-weight: bold; color: #808080;">Reporte de Bebes</h3>
        </div>
        <div id="Principal"></div>
    </div>

</asp:Content>

<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>
<%-- --------------------------------------------------------------------------------------------------------------------------------------- --%>


