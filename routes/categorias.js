const { Router } = require('express');
const { check } = require('express-validator');


const {validarCampos,
    validarJWT,
    tieneRole} = require('../middlewares');

const {existeCategoria,} = require('../helpers/db-validators')

const {crearCategoria, 
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria} = require('../controllers/categorias')

const router = Router();


//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoria);

//Crear categoria - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar categoria - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//Borrar categoria - Admim
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROL'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria);


module.exports = router;