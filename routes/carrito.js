const express = require('express');

const carritoController = require('../controllers/carrito');

const router = express.Router();

router.get('/carrito', carritoController.agregarAlCarrito);


module.exports = router;