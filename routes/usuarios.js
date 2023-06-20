const{Router}=require('express');
const{usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPath}=
require('../controller/usuarios')
const router = Router();

router.get('/', usuariosGet)
router.put('/:id', usuariosPut);
router.post('/',usuariosPost);
router.delete('/',usuariosDelete);
router.patch('/', usuariosPath);

module.exports = router;