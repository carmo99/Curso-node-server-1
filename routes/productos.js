const { Router } = require('express');
const { check } = require('express-validator');

const {validarCampos,
    validarJWT,
    tieneRole} = require('../middlewares');

const {existeCategoria,
    existeProducto} = require('../helpers/db-validators')

const {CrearProducto,
    ObtenerProductos,
    ObtenerProducto,
    ActualizarProducto,
    BorrarProducto} = require('../controllers/productos')

const router = Router();

router.get('/', ObtenerProductos);

router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
] ,ObtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo Valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
],CrearProducto);

router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria no es un ID de Mongo Valido').isMongoId(),
    check('categoria').custom(existeCategoria),
    validarCampos
] ,ActualizarProducto);

router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROL'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
] ,BorrarProducto);


module.exports = router;
