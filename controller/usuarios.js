const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const {emailExiste} = require('../helpers/db-validators');

//CON PROMESAS
const usuariosGet = async(req = request, res = response)=>{
    //const {q,nombre='no envia',apikey} = req.query;
    const {limite = 15, desde = 0}=req.query;//se indica que se va recibir un parámetro con valor por defecto de 5
    const query = {estado:true};
    //encuentra "desde" al "limite" registros de la bd
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),//retorna total
        Usuario.find(query)//retorna los usuarios
        .skip(Number(desde)) 
        .limit(Number(limite))//ENcuentra todos los registros de la BD
    ]);
    res.json({
        total,
        usuarios
    });
};


/* SIN RESOLVER AWAIT
const usuariosGet = async(req = request, res = response)=>{
    //const {q,nombre='no envia',apikey} = req.query;
    const {limite = 4, desde = 0}=req.query;//se indica que se va recibir un parámetro con valor por defecto de 5
    const query = {estado:true};
    //encuentra "desde" al "limite" registros de la bd
    const usuarios = await Usuario.find()
    .skip(Number(desde))
    .limit(Number(limite));//ENcuentra todos los registros de la BD
    const total = await Usuario.countDocuments(query);
    res.json({
        total,
        usuarios
    });
};*/

/* VALIDACIÓN DE NÚMEROS
const usuariosGet = async (req = request, res = response) => {
    const { limite = '4', desde = '0' } = req.query;
    const parsedDesde = parseInt(desde, 10);
    const parsedLimite = parseInt(limite, 10);
  
    if (isNaN(parsedDesde) || isNaN(parsedLimite)) {
      res.status(400).json({ error: 'Los valores de "desde" y "limite" deben ser números enteros válidos' });
      return;
    }
  
    const usuarios = await Usuario.find()
      .skip(parsedDesde)
      .limit(parsedLimite);
    res.json({
      usuarios
    });
  };*/
  

const usuariosPut = async (req, res = response) => {
    const {id} = req.params; //params puede traer muchos recursos
    //excluyo password, google y correo (no se actualizan) todo lo demás lo almaceno en resto
    const {_id,password, google, correo, ...resto } = req.body;
    //Por HACER VALIDADR id contra la DB
    if (password) {
        //encriptar la contraseña en caso de que venga en el body
        const salt = bcryptjs.genSaltSync(); //cantidad de vueltas que hara la encriptación por def 10
        resto.password = bcryptjs.hashSync(password); //encripta el password
    }
    //actualiza el registro: lo busca por id y actualiza con los valores de resto
    const usuario = await Usuario.findOneAndUpdate({ _id: id }, resto, { new: true });

    res.json({
        usuario
    });
};

const usuariosPost= async(req, res = response)=>{

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
    //verificar si existe correo
    await emailExiste(correo);

    //encriptar la contraseña
    const salt = bcryptjs.genSaltSync();//Cantidad de vueltas que hará la encriptación por def.10
    usuario.password = bcryptjs.hashSync(password); //Encripta el password
    await usuario.save(); //Para GRABAR en BD
    res.json({ 
        usuario
    });
};
const usuariosDelete = async(req, res = response)=>{
    const {id} = req.params;
    //BORRADO FÍSICO
    //const usuario = await Usuario.findByIdAndDelete(id);
    //BORRADO LÓGICO
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    res.json({ 
        usuario
    });
};
const usuariosPath = (req, res = response)=>{
    res.json({ 
        msg: 'path API-controller'
    });
};

//Exportación de un objeto (van a haber muchos)
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPath
}