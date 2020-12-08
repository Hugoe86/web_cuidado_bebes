﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Paginas/Paginas_Generales/MasterPage.Master" AutoEventWireup="true" CodeBehind="Frm_Apl_Usuarios.aspx.cs" Inherits="web_red_alert.Paginas.Catalogos.Frm_Apl_Usuarios" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script src="../../Recursos/bootstrap-date/moment.min.js"></script>
    <link href="../../Recursos/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/center_loader.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/demo_form.css" rel="stylesheet" />

    <script src="../../Recursos/plugins/center-loader.min.js"></script>
    <script src="../../Recursos/plugins/parsley.js"></script>
    <script src="../../Recursos/bootstrap-table/bootstrap-table.min.js"></script>
    <link href="../../Recursos/bootstrap-date/bootstrap-datetimepicker.min.css" rel="stylesheet" />
    <script src="../../Recursos/bootstrap-date/bootstrap-datetimepicker.min.js"></script>
    <link href="../../Recursos/bootstrap-date/datepicker.css" rel="stylesheet" />
    <script src="../../Recursos/bootstrap-date/bootstrap-datepicker.js"></script>
    <script src="../../Recursos/javascript/seguridad/Js_Controlador_Sesion.js"></script>
    <script src="../../Recursos/javascript/seguridad/Js_Apl_Usuarios.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
     <div class="container-fluid" style="height:100vh;">

        <div class="page-header" align="left">
            <h3 style="font-family: 'Roboto Light', cursive !important; font-size: 24px; font-weight: bold; color: #808080;">Cat&aacute;logo de Usuarios</h3>
        </div>

        <div class="panel panel-color panel-info expanded" id="panel1">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <i style="color: white;" class="glyphicon glyphicon-filter"></i>&nbsp;Filtros de B&uacute;squeda
                </h3>
                <div class="panel-options">
                    <a href="#" data-toggle="panel">
                        <span class="collapse-icon">–</span>
                        <span class="expand-icon">+</span>
                    </a>
                </div>
            </div>
            <div class="panel-body">
                <div class="row">
                      <div class="col-md-1">
                        <label>Usuarios</label>
                    </div>
                    <div class="col-md-3">
                        <input type="text" id="txt_busqueda_por_usuario" class="form-control" placeholder="Busqueda por usuario" />
                    </div>
                    <div class="col-md-8" align="right">
                    </div>
                </div>
                    <div class="row">
                        <div class="col-md-1" style="margin-top: 8px;">
                            <label>Estatus</label>
                        </div>
                        <div class="col-md-3">
                             <select id="cmb_estatusfiltro" name="cmb_estatusfiltro" class="form-control input-sm" style="border-radius:inherit"></select>
                        </div>
                      
                    <div class="col-md-8" align="right">
                        <button type="button" id="btn_busqueda" class="btn btn-secondary btn-icon btn-icon-standalone btn-lg">
                            <i class="fa fa-search"></i>
                            <span>Buscar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="toolbar" style="margin-left: 5px;">
            <div class="btn-group" role="group" style="margin-left: 5px;">
                <button id="btn_salir" type="button" class="btn btn-info btn-sm" title="Salir"><i class="glyphicon glyphicon-home"></i></button>
                <button id="btn_nuevo" type="button" class="btn btn-info btn-sm" title="Nuevo"><i class="glyphicon glyphicon-plus"></i></button>
            </div>
        </div>
        <table id="tbl_usuarios" data-toolbar="#toolbar" class="table table-responsive"></table>
    </div>
</asp:Content>
