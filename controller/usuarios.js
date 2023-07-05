const {response,request}= require('express');
const bcryptjs = require('bcryptjs');
const Usuario =require('../models/usuario');
const regex = /^[0-9]*$/;


const usuariosGet = async(req = request, res = response) => {
    // const {q,nombre = 'no envia',apikey} = req.query;
    const {limite=5, desde=0} = req.query; // indicamos que vamos ha recibir un parametro: limite,con volor por defecto 5
    const query={estado:true};

    //Validación de ingreso de las variables "limite" y "desde" sean solo números
    if(!regex.test(limite)||!regex.test(desde)){
        throw new Error(`Verificar que el la variable "desde" o "limite" sea un número`)
    }
    else{
        const [total,usuarios] = await Promise.all([
            Usuario.countDocuments(query), //retorna total
            Usuario.find(query) //retorna los usuarios
            .skip(Number(desde))
            .limit(Number(limite))            
        ]);
        res.json({
            total,
            usuarios
        });
    } 
 };



const usuariosPut = async(req, res= response) => {
    const {id} = req.params; // params puede traer muchos datos.
    //excluyo password, google y correo (no se actualizan) y todo lo demas lo almaceno es resto
    const {_id,password,google,correo, ...resto} = req.body;
    //POR HACER validar id contra la DB 
    if (password){
        //encritar la contrasena en caso que venga en el body
        const salt = bcryptjs.genSaltSync();//cantidad de vueltas que hara la encriptacion por def.10
        resto.password = bcryptjs.hashSync(password); //encripta el password
    }
    //actualiza el registro: lo busca por id y actualiza con los valores de resto
    const usuario = await Usuario.findOneAndUpdate({ _id: id }, resto, { new: true });

    res.json({
        msg: 'put API - controller',
        usuario
    });
}



const usuariosPost = async(req, res = response) => {

    const {nombre,correo,password,rol}= req.body;
    const usuario = new Usuario({nombre,correo,password,rol});


    //Encritar la contrasenia
    const salt = bcryptjs.genSaltSync();//cantidad de vueltas que hara la encriptacion por def.10
    usuario.password = bcryptjs.hashSync(password); //encripta el password

    await usuario.save(); // esto es para grabar en BD
    res.json({
        msg: 'post API - controller',
        usuario
    });
}


const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;
    const uid = req.uid;
    //borrado fisico.
    //const usuario = await Usuario.findByIdAndDelete(id);
    //borrado logico:
   
    const usuario = await Usuario.findByIdAndUpdate({ _id: id }, {estado: false}, { new: true });
    //obtener al usuario autenticado
    const usuarioAutenticado = await Usuario.findById(uid);
    res.json({
       usuario,
       usuarioAutenticado
    });
    
}


const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controller'
    });
}

//se exporta un objeto pues van haber muchos
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}
