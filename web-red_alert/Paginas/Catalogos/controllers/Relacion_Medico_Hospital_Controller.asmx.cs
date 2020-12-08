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
using web_red_alert.Models.Negocio;

namespace web_red_alert.Paginas.Catalogos.controllers
{
    /// <summary>
    /// Descripción breve de Relacion_Medico_Hospital_Controller
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // Para permitir que se llame a este servicio web desde un script, usando ASP.NET AJAX, quite la marca de comentario de la línea siguiente. 
    [System.Web.Script.Services.ScriptService]
    public class Relacion_Medico_Hospital_Controller : System.Web.Services.WebService
    {
        #region Métodos
        /// <summary>
        /// Se da de alta una elemento
        /// </summary>
        /// <param name="json_object">Variable que recibe los datos de los js</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Alta(String json_object)
        {
            //  variables
            Cls_Mensaje mensaje = new Cls_Mensaje();//  variable para contener el mensaje de la operación
            Cls_Cat_Relacion_Medico_Hospital_Negocio obj_datos = new Cls_Cat_Relacion_Medico_Hospital_Negocio();//  variable de negocio que contendrá la información recibida
            string json_resultado = "";//    variable para contener el resultado de la operación
            String color = "#8A2BE2";// variable con la que se le asignara un color para el mensaje de valor ya registrado
            String icono = "fa fa-close";// variable con la que se establece el icono que se mostrara en el mensaje de valor ya registrado

            try
            {
                //  se indica el nombre de la operación que se estará realizando
                mensaje.Titulo = "Alta";

                //  se carga la información
                obj_datos = JsonConvert.DeserializeObject<Cls_Cat_Relacion_Medico_Hospital_Negocio>(json_object);


                //  se abre el entity
                using (var dbContext = new ERP_EJE_CENTRALEntities())// variable que almacena la informacion del entity
                {
                    //  se inicializa la transacción
                    using (var transaction = dbContext.Database.BeginTransaction())//   variable que se utiliza para la transaccion
                    {
                        try
                        {

                            //  se consultara si existe informacion registrada con esa cuenta
                            var _consultar_cuenta = (from _cuenta_existente in dbContext.Cat_Relacion_Medico_Hospital
                                                     where _cuenta_existente.Medico_Id == obj_datos.Medico_Id
                                                     && _cuenta_existente.Hospital_Id == obj_datos.Hospital_Id
                                                     select _cuenta_existente
                                                     );//   vairable con la que se comparara si la cuenta ya existe

                            // validamos que el registro no este registrado
                            if (!_consultar_cuenta.Any())
                            {
                                //  *****************************************************************************************************************
                                //  *****************************************************************************************************************
                                //  se ingresa la informacion
                                //  *****************************************************************************************************************

                                //  se inicializan las variables que se estarán utilizando
                                Cat_Relacion_Medico_Hospital obj_cuenta_nueva = new Cat_Relacion_Medico_Hospital();//   variable para almacenar
                                Cat_Relacion_Medico_Hospital obj_cuenta_nueva_registrada = new Cat_Relacion_Medico_Hospital();//    variable con la cual se obtendra el id 

                                obj_cuenta_nueva.Medico_Id = Convert.ToInt32(obj_datos.Medico_Id);
                                obj_cuenta_nueva.Hospital_Id = Convert.ToInt32(obj_datos.Hospital_Id);
                                obj_cuenta_nueva.Costo_Consulta = obj_datos.Costo_Consulta;
                                //  se registra el nuevo elemento
                                obj_cuenta_nueva_registrada = dbContext.Cat_Relacion_Medico_Hospital.Add(obj_cuenta_nueva);

                                //  se guardan los cambios
                                dbContext.SaveChanges();

                                //  se ejecuta la transacción
                                transaction.Commit();

                                //  se indica que la operación se realizo bien
                                mensaje.Mensaje = "La operación se realizo correctamente.";
                                mensaje.Estatus = "success";
                            }
                            else//  se le notificara que el valor ya se encuentra registrado
                            {
                                mensaje.Estatus = "error";
                                mensaje.Mensaje = "<i class='" + icono + "'style = 'color:" + color + ";' ></i> &nbsp; Ya se encuentra registrado el elemento ingresado" + " <br />";
                            }
                        }
                        catch (Exception ex)
                        {
                            //  se realiza el rollback de la transacción
                            transaction.Rollback();

                            //  se indica cual es el error que se presento
                            mensaje.Mensaje = "Error Técnico. " + ex.Message;
                            mensaje.Estatus = "error";

                        }
                    }


                }
            }
            catch (Exception e)
            {
                //  se indica cual es el error que se presento
                mensaje.Mensaje = "Error Técnico. " + e.Message;
                mensaje.Estatus = "error";
            }
            finally
            {
                //   se convierte la información a json
                json_resultado = JsonMapper.ToJson(mensaje);
            }


            //   se envía la información de la operación realizada
            return json_resultado;
        }

        /// <summary>
        /// Método que elimina el registro seleccionado.
        /// </summary>
        /// <param name="json_object">Variable que recibe los datos de los js</param>
        /// <returns>Objeto serializado con los resultados de la operación</returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Eliminar(string json_object)
        {
            Cls_Cat_Relacion_Medico_Hospital_Negocio obj_datos = new Cls_Cat_Relacion_Medico_Hospital_Negocio();//variable para obtener la informacion ingresada en el javascript
            string json_resultado = string.Empty;//variable para guardar el resultado de la función
            Cls_Mensaje mensaje = new Cls_Mensaje();//variable para guardar el mensaje de salida

            try
            {
                mensaje.Titulo = "Eliminar registro";
                obj_datos = JsonMapper.ToObject<Cls_Cat_Relacion_Medico_Hospital_Negocio>(json_object);

                using (var dbContext = new ERP_EJE_CENTRALEntities())//variable para manejar el entity
                {
                    //variable para guardar la información del dato a eliminar
                    var _relacion = dbContext.Cat_Relacion_Medico_Hospital.Where(u => u.Relacion_Id == obj_datos.Relacion_Id).First();
                    dbContext.Cat_Relacion_Medico_Hospital.Remove(_relacion);

                    dbContext.SaveChanges();

                    mensaje.Estatus = "success";
                    mensaje.Mensaje = "La operación se completó sin problemas.";
                }
            }
            catch (Exception Ex)
            {
                mensaje.Mensaje = "Informe técnico: " + Ex.Message;
            }
            finally
            {
                json_resultado = JsonMapper.ToJson(mensaje);
            }
            return json_resultado;
        }
        #endregion




        #region Consultas


        /// <summary>
        /// Se realiza la consulta de la relacion
        /// </summary>
        /// <param name="json_object">Variable que recibe los datos de los js</param>
        /// <returns></returns>
        [WebMethod(EnableSession = true)]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string Consultar_Relacion_Medico_Hospital_Filtros(string json_object)
        {
            //  declaración de variables
            Cls_Cat_Relacion_Medico_Hospital_Negocio obj_datos = new Cls_Cat_Relacion_Medico_Hospital_Negocio();//  variable de negocio que contendrá la información recibida
            string json_resultado = "";//    variable para contener el resultado de la operación
            Cls_Mensaje mensaje = new Cls_Mensaje();//  variable para contener el mensaje de la operación

            try
            {
                //  se carga la información
                obj_datos = JsonMapper.ToObject<Cls_Cat_Relacion_Medico_Hospital_Negocio>(json_object);

                //  se abre el entity
                using (var dbContext = new ERP_EJE_CENTRALEntities())// variable que almacena la informacion del entity
                {
                    //  se realiza la consulta
                    var consulta = (from _relacion in dbContext.Cat_Relacion_Medico_Hospital

                                    join _medicos in dbContext.Cat_Medicos on _relacion.Medico_Id equals _medicos.Medico_Id

                                    join _hospitales in dbContext.Cat_Ubicaciones on _relacion.Hospital_Id equals _hospitales.Ubicacion_Id

                                    //  medico id
                                    where (obj_datos.Medico_Id != 0 ? _relacion.Medico_Id == (obj_datos.Medico_Id) : true)//

                                    //  hospital id
                                    && (obj_datos.Hospital_Id != 0 ? _relacion.Hospital_Id == (obj_datos.Hospital_Id) : true)//



                                    select new Cls_Cat_Relacion_Medico_Hospital_Negocio
                                    {
                                        Relacion_Id = _relacion.Relacion_Id,
                                        Medico_Id = _relacion.Medico_Id,
                                        Hospital_Id = _relacion.Hospital_Id,
                                        Medico = _medicos.Apellido_Paterno + " " + _medicos.Apellido_Materno + " " + _medicos.Nombre,
                                        Hospital = _hospitales.Nombre,
                                        Costo_Consulta = _relacion.Costo_Consulta
                                    }).OrderBy(u => u.Medico).ToList();//   variable que almacena la consulta



                    //   se convierte la información a json
                    json_resultado = JsonMapper.ToJson(consulta);
                }
            }
            catch (Exception Ex)
            {
                //  se indica cual es el error que se presento
                mensaje.Estatus = "error";
                mensaje.Mensaje = "<i class='fa fa-times' style='color:#FF0004;'></i>&nbsp;Informe técnico: " + Ex.Message;
            }

            //   se envía la información de la operación realizada
            return json_resultado;
        }


        #endregion

    }
}
