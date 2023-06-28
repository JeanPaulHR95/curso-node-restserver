const{Router}=require('express');
const{check}=require('express-validator');
const {esRolValido, emailExiste, existeUsuarioPorld} = require('../helpers/db-validators');
const{usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPath}=require('../controller/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();

router.get('/', usuariosGet)
router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorld),
    check('rol').custom(esRolValido),
    validarCampos
], usuariosPut);
router.post('/',[
    check('nombre', 'El Nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo NO es valido').isEmail(),
    check('correo').custom((correo)=>emailExiste(correo)),
    check('password', 'El PASSWORD es obligatorio y mas de 6 letras').isLength({min:6}),
    //check('rol','No es un ROl valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom((rol)=>esRolValido(rol)),
    validarCampos
],usuariosPost);
router.delete('/:id',[
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeUsuarioPorld),
    validarCampos
],usuariosDelete);
router.patch('/', usuariosPath);

module.exports = router;