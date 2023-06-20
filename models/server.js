const express = require('express');
const cors = require('cors');

class Server{

    constructor(){
        this.app4 = express();
        this.port = process.env.PORT||3000;
        this.usuariosPath = '/api/usuarios';
        //middleware
        this.middlewares();
        //Rutas de la aplicación
        this.routes();
    }
    //Definición del método middleware que publicará la carpeta public
    middlewares(){
        //CORS
        this.app4.use(cors());
        //lectura y parseo del body recibe lo que se envía
        this.app4.use(express.json());
        //directorio publico
        this.app4.use(express.static('public'));
    }
    routes(){
        this.app4.use(this.usuariosPath, require('../routes/usuarios'));

    }
    listen(){
        this.app4.listen(this.port,()=>{
            console.log('Servidor corriendo en el puerto ',this.port)
        })
    }
}

module.exports= Server;
