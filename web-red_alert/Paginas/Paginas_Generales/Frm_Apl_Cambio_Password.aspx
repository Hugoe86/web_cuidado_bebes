<%@ Page Title="" Language="C#" MasterPageFile="~/Paginas/Paginas_Generales/MasterPage.Master" AutoEventWireup="true" CodeBehind="Frm_Apl_Cambio_Password.aspx.cs" Inherits="web_red_alert.Paginas.Paginas_Generales.Frm_Apl_Cambio_Password" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="../../Recursos/estilos/demo_form.css" rel="stylesheet" />
    <script src="../../Recursos/plugins/parsley.js"></script>
    <script src="../../Recursos/javascript/seguridad/Js_Cambio_Password.js"></script>
    <style>
        .panel-body {
            background-color: #fff !important;
        }
        .panel-footer {
            background-color: #fff !important;
            border-top: 2px solid #f5f5f5;
        }
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div class="container" style="height:100vh;" align="left">

        <div class="panel panel-default" style="max-width:50%;">
            <div class="panel-heading">
                <h3 class="panel-title"><i class="fa fa-key"></i>&nbsp;Change user password</h3>
                <div class="panel-options">
                    <a href="" data-toggle="panel">
                        <span class="collapse-icon">–</span>
                        <span class="expand-icon">+</span>
                    </a>
                    <a href="" data-toggle="remove">×
                    </a>
                </div>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-md-12">
                        <label class="fuente_lbl_controles">(*) Current password</label>
                        <input type="password" id="txt_actual_password" name="txt_actual_password" class="form-control" placeholder="(*) Enter the current password" data-parsley-required="true" />
                    </div>
                </div>
                <div class="row">
                     <div class="col-md-12">
                        <label class="fuente_lbl_controles">(*) New Password</label>
                        <input type="password" id="txt_nuevo_password" name="txt_nuevo_password" class="form-control" placeholder="(*) Enter the new password" data-parsley-required="true" />
                    </div>
                </div>
                <div class="row">
                     <div class="col-md-12">
                        <label class="fuente_lbl_controles">(*) Confirm new password</label>
                        <input type="password" id="txt_confirmar_password" name="txt_confirmar_password" class="form-control" placeholder="(*) Confirm new password" data-parsley-required="true" />
                    </div>
                </div>
            </div>
            <div class="row" style="margin-top: 20px;"></div>
            <div class="panel-footer">
                <div class="row">
                    <div class="col-md-12 text-right">
                        <button id="btn_guardar" class="btn btn-lg btn-info btn-icon btn-icon-standalone btn-icon-standalone-right" type="button" onclick="_guardar_datos">
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                            <span>Update</span>
                        </button>

                        <button id="btn_cancelar" class="btn btn-lg btn-primary btn-icon btn-icon-standalone btn-icon-standalone-right" type="button" onclick="_guardar_datos" onclick="_close_page">
                            <i class="fa fa-close" aria-hidden="true"></i>
                            <span>Cancel</span>
                        </button>

                        <input type="hidden" id="txt_password_id" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
