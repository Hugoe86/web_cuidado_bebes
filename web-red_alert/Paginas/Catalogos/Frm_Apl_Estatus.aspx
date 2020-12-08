﻿<%@  Page Title="Catálogo de Estatus" Language="C#" MasterPageFile="~/Paginas/Paginas_Generales/MasterPage.Master" AutoEventWireup="true" CodeBehind="Frm_Apl_Estatus.aspx.cs" Inherits="web_red_alert.Paginas.Catalogos.Frm_Apl_Estatus" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../../Recursos/bootstrap-table/bootstrap-table.min.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/center_loader.css" rel="stylesheet" />
    <link href="../../Recursos/estilos/demo_form.css" rel="stylesheet" />

    <script src="../../Recursos/plugins/center-loader.min.js"></script>
    <script src="../../Recursos/plugins/parsley.js"></script>
    <script src="../../Recursos/bootstrap-table/bootstrap-table.min.js"></script>
    <script src="../../Recursos/javascript/seguridad/Js_Controlador_Sesion.js"></script>
    <script src="../../Recursos/javascript/catalogos/Js_Apl_Estatus.js"></script>
 
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <%--<div class="progress progress-striped active"></div>--%>
    <div class="container-fluid" style="height:100vh;">

        <div class="page-header">
            <h3 style="font-family: 'Roboto Light', cursive !important; font-size: 24px; font-weight: bold; color: #808080;">Cat&aacute;logo de Estatus</h3>
        </div>

        <div class="panel panel-color panel-info collapsed" id="panel1">
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
                    <div class="col-md-1" style="margin-top: 8px;">
                        <label>Nombre</label>
                    </div>
                    <div class="col-md-3">
                        <input type="text" id="txt_busqueda_por_nombre" class="form-control" placeholder="Busque por nombre" />
                    </div>
                    <div class="col-md-8" style="text-align:right">
                        <button type="button" id="btn_busqueda" class="btn btn-secondary btn-icon btn-icon-standalone btn-lg">
                            <i class="fa fa-search"></i>
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div id="toolbar" style="margin-left: 5px;">
            <div class="btn-group" role="group" style="margin-left: 5px;">
                <button id="btn_salir" type="button" class="btn btn-info btn-sm" title="Home"><i class="glyphicon glyphicon-home"></i></button>
                <button id="btn_nuevo" type="button" class="btn btn-info btn-sm" title="New"><i class="glyphicon glyphicon-plus"></i></button>
            </div>
        </div>
        <table id="tbl_estatus" data-toolbar="#toolbar" class="table table-responsive"></table>
    </div>
</asp:Content>