const {response,request}= require('express');
const Role = require('../models/role');
const Usuario =require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB`)
    }
};
//Verficiar si existe correo
const emailExiste = async( correo = '',res=response) => {
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya está registrado`)
    }
};
//Verificar usuario (ID)
const existeUsuarioPorId = async(id) =>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
       throw new Error(`El Usuario con  ${id} no existe en la DB`)
       
    };
};

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId 
}