const {Router} = require('express');
const {check} = require('express-validator');
const {Role} = require('../models/role');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controller/usuarios');
//const { validarCampos } = require('../middlewares/validar-campos');
//const { validarJWT } = require('../middlewares/validar-jwt');
const { esRoleValido, emailExiste, existeUsuarioPorId} = require('../helpers/db-validators');
const router = Router();
//const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');
const{validarCampos, validarJWT,esAdminRole, tieneRole}=require('../middlewares');

router.get('/', usuariosGet);

router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut );


router.post('/',[
    check('nombre','El Nombre es obligatorio').not().isEmpty(),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('password','El Password obligatorio y mas de 6 letras').isLength({min: 6}),
    //check('rol','No es un Rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
],usuariosPost);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE', 'MRK_ROLE'),
    check('id','No es un ID valido ').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
],usuariosDelete  );


router.patch('/', usuariosPatch );

module.exports = router;
