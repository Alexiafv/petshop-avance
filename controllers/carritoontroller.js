const Carrito = require('../models/carrito');
const Producto = require('../models/producto');

exports.agregarAlCarrito = (req, res, next) => {
    const productoId = req.body.productoId;
    const cantidad = req.body.cantidad || 1;

    // Encontrar el producto por su ID
    Producto.findById(productoId, (producto) => {
        if (!producto) {
            return res.redirect('/productos'); // Si el producto no existe
        }

        // Lógica para agregar el producto al carrito
        Carrito.addProducto(productoId, producto.precio, cantidad);

        // Redirigir o enviar una respuesta
        res.redirect('/carrito');
    });
};

