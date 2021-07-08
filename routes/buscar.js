const { Router } = require('express');
const {Buscar} = require('../controllers/buscar')

const router = new Router();

router.get('/:coleccion/:termino', Buscar);

module.exports = router;