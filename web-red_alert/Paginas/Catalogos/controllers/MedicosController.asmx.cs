using datos_red_alert;
using LitJson;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using web_red_alert.Models.Ayudante;
using web_red_alert.Models.Negocio;

namespace web_red_alert.Paginas.Catalogos.controllers
{
    /// <summary>
    /// Descripción breve de MedicosController
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class MedicosController : System.Web.Services.WebService
    {


        #region Eventos
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Medicos_Negocio Obj_Datos = new Cls_Cat_Medicos_Negocio();
            string jsonResultado = "";


            try
            {
                Mensaje.Titulo = "Alta de medico";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Medicos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Medicos Obj_Medico = new Cat_Medicos();

                            Obj_Medico.Especialidad_Id = Convert.ToInt32(Obj_Datos.Especialidad_Id);
                            Obj_Medico.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Medico.Nombre = Obj_Datos.Nombre;
                            Obj_Medico.Apellido_Paterno = Obj_Datos.Apellido_Paterno;
                            Obj_Medico.Apellido_Materno = Obj_Datos.Apellido_Materno;
                            Obj_Medico.Telefono = Obj_Datos.Telefono;
                            Obj_Medico.No_Cedula = Obj_Datos.No_Cedula;
                            Obj_Medico.Email = Obj_Datos.Email;
                            //Obj_Medico.Calle = Obj_Datos.Calle;
                            //Obj_Medico.Num_Interior = Obj_Datos.Num_Interior;
                            //Obj_Medico.Num_Exterior = Obj_Datos.Num_Exterior;
                            //Obj_Medico.Colonia = Obj_Datos.Colonia;
                            //Obj_Medico.Cp = Obj_Datos.Cp;
                            //Obj_Medico.Municipio = Obj_Datos.Municipio;
                            //Obj_Medico.Estado = Obj_Datos.Estado;
                            Obj_Medico.Imagen = Obj_Datos.Imagen;
                            Obj_Medico.Emergencias = Obj_Datos.Emergencias;
                            Obj_Medico.Usuario_Creo = Cls_Sesiones.Usuario;
                            Obj_Medico.Fecha_Creo = DateTime.Now;

                            dbContext.Cat_Medicos.Add(Obj_Medico);

                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }

        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Actualizar(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Medicos_Negocio Obj_Datos = new Cls_Cat_Medicos_Negocio();
            string jsonResultado = "";
            Int32 Int_Medico = 0;

            try
            {
                Mensaje.Titulo = "Actualizar medico";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Medicos_Negocio>(jsonObject);



                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Medicos Obj_Medico = new Cat_Medicos();
                            Int_Medico = Convert.ToInt32(Obj_Datos.Medico_Id);

                            Obj_Medico = dbContext.Cat_Medicos.Where(w => w.Medico_Id == Int_Medico).FirstOrDefault();


                            Obj_Medico.Especialidad_Id = Convert.ToInt32(Obj_Datos.Especialidad_Id);
                            Obj_Medico.Estatus_Id = Convert.ToInt32(Obj_Datos.Estatus_Id);
                            Obj_Medico.Nombre = Obj_Datos.Nombre == "" ? null : Obj_Datos.Nombre;
                            Obj_Medico.Apellido_Paterno = Obj_Datos.Apellido_Paterno == "" ? null : Obj_Datos.Apellido_Paterno;
                            Obj_Medico.Apellido_Materno = Obj_Datos.Apellido_Materno == "" ? null : Obj_Datos.Apellido_Materno;
                            Obj_Medico.Telefono = Obj_Datos.Telefono == "" ? null : Obj_Datos.Telefono;
                            Obj_Medico.No_Cedula = Obj_Datos.No_Cedula == "" ? null : Obj_Datos.No_Cedula;
                            Obj_Medico.Email = Obj_Datos.Email == "" ? null : Obj_Datos.Email;
                            //Obj_Medico.Calle = Obj_Datos.Calle == "" ? null : Obj_Datos.Calle;
                            //Obj_Medico.Num_Interior = Obj_Datos.Num_Interior == "" ? null : Obj_Datos.Num_Interior;
                            //Obj_Medico.Num_Exterior = Obj_Datos.Num_Exterior == "" ? null : Obj_Datos.Num_Exterior;
                            //Obj_Medico.Colonia = Obj_Datos.Colonia == "" ? null : Obj_Datos.Colonia;
                            //Obj_Medico.Cp = Obj_Datos.Cp == "" ? null : Obj_Datos.Cp;
                            //Obj_Medico.Municipio = Obj_Datos.Municipio == "" ? null : Obj_Datos.Municipio;
                            //Obj_Medico.Estado = Obj_Datos.Estado == "" ? null : Obj_Datos.Estado;
                            Obj_Medico.Imagen = Obj_Datos.Imagen;
                            Obj_Medico.Emergencias = Obj_Datos.Emergencias;
                            Obj_Medico.Usuario_Modifico = Cls_Sesiones.Usuario;
                            Obj_Medico.Fecha_Modifico = DateTime.Now;


                            dbContext.SaveChanges();


                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar(String jsonObject)
        {
            Cls_Mensaje Mensaje = new Cls_Mensaje();
            Cls_Cat_Medicos_Negocio Obj_Datos = new Cls_Cat_Medicos_Negocio();
            string jsonResultado = "";
            Int32 Int_Medico = 0;

            

            try
            {
                Mensaje.Titulo = "Eliminar";

                Obj_Datos = JsonConvert.DeserializeObject<Cls_Cat_Medicos_Negocio>(jsonObject);
                Int_Medico = Convert.ToInt32(Obj_Datos.Medico_Id);


                //eliminar la relacion medio hospital primero                       
                using (var db_context = new ERP_EJE_CENTRALEntities())
                {
                    var relacion = (from _relacion in db_context.Cat_Relacion_Medico_Hospital
                                    where _relacion.Medico_Id == Int_Medico select _relacion).FirstOrDefault();

                    if (relacion != null)
                    {
                        db_context.Cat_Relacion_Medico_Hospital.Remove(relacion);
                        db_context.SaveChanges();
                    }
                }




                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {
                    using (var transaction = dbContext.Database.BeginTransaction())
                    {
                        try
                        {
                            Cat_Medicos Obj_Medico = new Cat_Medicos();                            

                            Obj_Medico = dbContext.Cat_Medicos.Where(w => w.Medico_Id == Int_Medico).FirstOrDefault();
                            dbContext.Cat_Medicos.Remove(Obj_Medico);
                            dbContext.SaveChanges();

                            transaction.Commit();

                            Mensaje.Mensaje = "La operación se realizo correctamente.";
                            Mensaje.Estatus = "success";

                        }// fin try
                        catch (Exception ex)
                        {
                            transaction.Rollback();

                            Mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            Mensaje.Estatus = "error";

                        }// fin catch

                    }// fin transaction

                }// fin using

            }// fin try
            catch (Exception e)
            {
                Mensaje.Mensaje = "Error Técnico. " + e.Message;
                Mensaje.Estatus = "error";

            }// fin catch
            finally
            {
                jsonResultado = JsonMapper.ToJson(Mensaje);

            }// fin finally

            return jsonResultado;
        }

        #endregion




        #region Consultas


        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Medicos_Filtro(string jsonObject)
        {
            string Json_Resultado = string.Empty;
            Cls_Cat_Medicos_Negocio Obj = new Cls_Cat_Medicos_Negocio();

            try
            {

                Obj = JsonConvert.DeserializeObject<Cls_Cat_Medicos_Negocio>(jsonObject);

                using (var dbContext = new ERP_EJE_CENTRALEntities())
                {

                    var _medicos = (from _med in dbContext.Cat_Medicos

                                    join _estatus in dbContext.Apl_Estatus on _med.Estatus_Id equals _estatus.Estatus_ID
                                    join _espec in dbContext.Cat_Especialidades on _med.Especialidad_Id equals _espec.Especialidad_Id

                                    where ((Obj.Medico_Id > 0) ? _med.Medico_Id == Obj.Medico_Id : true)
                                    && ((Obj.Nombre != "") ? _med.Nombre.ToString().Contains(Obj.Nombre.ToString()) : true)
                                    && ((Obj.Apellido_Paterno != "") ? _med.Apellido_Paterno.ToString().Contains(Obj.Apellido_Paterno.ToString()) : true)
                                    && ((Obj.Apellido_Materno != "") ? _med.Apellido_Materno.ToString().Contains(Obj.Apellido_Materno.ToString()) : true)
                                    && ((Obj.Email != "") ? _med.Email.ToString().Contains(Obj.Email.ToString()) : true)
                                    && ((Obj.Estatus_Id > 0) ? _med.Estatus_Id == Obj.Estatus_Id : true)
                                    && ((Obj.Especialidad_Id > 0) ? _med.Especialidad_Id == Obj.Especialidad_Id : true)

                                    select new Cls_Cat_Medicos_Negocio
                                    {
                                        Medico_Id = _med.Medico_Id,
                                        Especialidad_Id = _med.Especialidad_Id,
                                        Estatus_Id = _med.Estatus_Id,
                                        Nombre = _med.Nombre,
                                        Apellido_Paterno = _med.Apellido_Paterno,
                                        Apellido_Materno = _med.Apellido_Materno,
                                        Email = _med.Email,
                                        Telefono = _med.Telefono,
                                        No_Cedula = _med.No_Cedula,
                                        //Calle = _med.Calle,
                                        //Num_Interior = _med.Num_Interior,
                                        //Num_Exterior = _med.Num_Exterior,
                                        //Colonia = _med.Colonia,
                                        //Cp = _med.Cp,
                                        //Municipio = _med.Municipio,
                                        //Estado = _med.Estado,
                                        Imagen = _med.Imagen,
                                        Emergencias = _med.Emergencias,
                                        Estatus = _estatus.Estatus,
                                        Especialidad = _espec.Especialidad,

                                    })
                                          .OrderBy(x => x.Apellido_Paterno).ToList();

                  
                    Json_Resultado = JsonConvert.SerializeObject(_medicos.ToList());
                }
            }
            catch (Exception e)
            {

            }

            return Json_Resultado;
        }




        /// <summary>
        /// Se consultan la informacion de las entidades registradas
        /// </summary>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void Consultar_Hospitales_Combo()
        {
            //  declaración de variables
            string json_resultado = "";//    variable para contener el resultado de la operación
            string parametro = string.Empty;//  variable para contener la información de la variable respuesta["q"]
            NameValueCollection respuesta = Context.Request.Form;//   variable para obtener el request del formulario
            Cls_Mensaje mensaje = new Cls_Mensaje();//  variable para contener el mensaje de la operación
            Int32 parametro_ubicacion = 0;//  variable para contener la información de la variable respuesta["q"]


            try
            {


                //  validación para saber si tiene algo esta variable nvc_respuesta["q"]
                if (!String.IsNullOrEmpty(respuesta["q"]))
                {
                    parametro = respuesta["q"].ToString().Trim();
                }

                //  validación para saber si tiene algo esta variable nvc_respuesta["cuenta_id"]
                if (!String.IsNullOrEmpty(respuesta["ubicacion_id"]))
                {
                    parametro_ubicacion = Convert.ToInt32(respuesta["ubicacion_id"].ToString().Trim());
                }

                //  se abre el entity
                using (var dbContext = new ERP_EJE_CENTRALEntities())// variable que almacena la informacion del entity
                {
                    //  se realiza la consulta
                    var _consulta = (from _ubicacion in dbContext.Cat_Ubicaciones

                                     

                                     where (!String.IsNullOrEmpty(parametro) ?
                                               (_ubicacion.Nombre.Contains(parametro))
                                               : true)


                                     && ((parametro_ubicacion != 0) ?
                                                                (_ubicacion.Ubicacion_Id == (parametro_ubicacion))
                                                                               : true)
                                                                               
                                     && _ubicacion.Tipo_Instalacion_Id == 1

                                     && _ubicacion.Estatus_Id == 2

                                     select new Cls_Select2
                                     {
                                         id = _ubicacion.Ubicacion_Id.ToString(),
                                         text = _ubicacion.Nombre,

                                     }).OrderBy(o => o.text);//   variable que almacena la consulta

                    //   se convierte la información a json
                    json_resultado = JsonMapper.ToJson(_consulta.ToList());
                }
            }
            catch (Exception Ex)
            {
                //  se indica cual es el error que se presento
                mensaje.Estatus = "error";
                mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }
            finally
            {
                //   se envía la información
                Context.Response.Write(json_resultado);
            }
        }


        /// <summary>
        /// Se consultan la informacion de las entidades registradas
        /// </summary>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void Consultar_Medicos_Combo()
        {
            //  declaración de variables
            string json_resultado = "";//    variable para contener el resultado de la operación
            string parametro = string.Empty;//  variable para contener la información de la variable respuesta["q"]
            NameValueCollection respuesta = Context.Request.Form;//   variable para obtener el request del formulario
            Cls_Mensaje mensaje = new Cls_Mensaje();//  variable para contener el mensaje de la operación
            

            try
            {


                //  validación para saber si tiene algo esta variable nvc_respuesta["q"]
                if (!String.IsNullOrEmpty(respuesta["q"]))
                {
                    parametro = respuesta["q"].ToString().Trim();
                }


                //  se abre el entity
                using (var dbContext = new ERP_EJE_CENTRALEntities())// variable que almacena la informacion del entity
                {
                    //  se realiza la consulta
                    var _consulta = (from _medicos in dbContext.Cat_Medicos



                                     where (!String.IsNullOrEmpty(parametro) ?
                                               (_medicos.Nombre.Contains(parametro))
                                               : true)



                                     && _medicos.Estatus_Id == 2


                                     select new Cls_Select2
                                     {
                                         id = _medicos.Medico_Id.ToString(),
                                         text = _medicos.Apellido_Paterno + " " +_medicos.Apellido_Materno + " " + _medicos.Nombre,

                                     }).OrderBy(o => o.text);//   variable que almacena la consulta

                    //   se convierte la información a json
                    json_resultado = JsonMapper.ToJson(_consulta.ToList());
                }
            }
            catch (Exception Ex)
            {
                //  se indica cual es el error que se presento
                mensaje.Estatus = "error";
                mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }
            finally
            {
                //   se envía la información
                Context.Response.Write(json_resultado);
            }
        }

        #endregion

    }
}
