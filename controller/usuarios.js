const{response}=require('express');
const usuariosGet = (req, res = response)=>{
    const {q,nombre='no envia',apikey} = req.query;
    res.json({
        msg: 'get API-controller',
        q,
        nombre,
        apikey
    });
};

const usuariosPut = (req, res = response)=>{
    const {id }=req.params; //params puede traer muchos recursos
    res.json({ 
        msg: 'put API-controller',
        id
    });
};
const usuariosPost=(req, res = response)=>{
    const {nombre, edad} = req.body;
    res.json({ 
        msg: 'post API-controller',
        nombre,
        edad
    });
};
const usuariosDelete = (req, res = response)=>{
    res.json({ 
        msg: 'delete API-controller'
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