const fs = require('fs');
const path = require('path');

const raizDir = require('../utils/path');

const p = path.join(raizDir, 'data', 'carrito.json');


const getCarritoFromFile = (cb) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb({ productos: [] });  // Si hay error, inicializamos con un carrito vacío
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Carrito {

    static addProducto(id, producto) {
        // Leer el carrito desde el archivo
        getCarritoFromFile(carrito => {
            // Encontrar si el producto ya está en el carrito
            const prodIndex = carrito.productos.findIndex(p => p.id === id);
            const prodExistente = carrito.productos[prodIndex];
            
            // Inicializamos la cantidad en 1 si no existe
            let cantidadNueva = 1;
            const precio = producto.precio;

            if (prodExistente) {
                // Si ya está en el carrito, incrementamos la cantidad
                cantidadNueva = prodExistente.cantidad + 1;
                carrito.productos[prodIndex].cantidad = cantidadNueva;
            } else {
                // Si no está, lo agregamos con cantidad 1
                carrito.productos.push({ ...producto, id: id, cantidad: cantidadNueva });
            }

            carrito.total = carrito.productos.reduce((total, prod) => total + prod.cantidad * prod.precio, 0);

            // Guardar el carrito actualizado en el archivo
            fs.writeFile(p, JSON.stringify(carrito), err => {
                console.log(err);
            });
        });
    }

    static fetchCarrito(cb) {
        getCarritoFromFile(cb);
    }

    static deleteProducto(id) {
        getCarritoFromFile(carrito => {
            const productosActualizados = carrito.productos.filter(prod => prod.id !== id);
            carrito.productos = productosActualizados;
            carrito.total = carrito.productos.reduce((total, prod) => total + prod.cantidad * prod.precio, 0);

            fs.writeFile(p, JSON.stringify(carrito), err => {
                console.log(err);
            });
        });
    }

    static updateCantidad(id, nuevaCantidad) {
        getCarritoFromFile(carrito => {
            const producto = carrito.productos.find(p => p.id === id);
            if (producto) {
                producto.cantidad = nuevaCantidad;
                carrito.total = carrito.productos.reduce((total, prod) => total + prod.cantidad * prod.precio, 0);

                fs.writeFile(p, JSON.stringify(carrito), err => {
                    console.log(err);
                });
            }
        });
    }

    static calcularEnvio(pais, departamento, ciudad, distrito, cb) {
        // Aquí podrías implementar la lógica para calcular el costo del envío según los datos ingresados
        const costoEnvio = 10; // Puedes ajustar esto según tu lógica
        cb(costoEnvio);
    }

    static finalizarPedido(cb) {
        getCarritoFromFile(carrito => {
            if (carrito.productos.length === 0) {
                return cb('Carrito vacío, no se puede finalizar pedido.');
            }

            // Aquí podrías agregar lógica para procesar el pedido
            // Por ejemplo, enviar los detalles del pedido a un sistema de pagos, etc.
            carrito.productos = [];
            carrito.total = 0;

            // Guardar carrito vacío después de finalizar el pedido
            fs.writeFile(p, JSON.stringify(carrito), err => {
                if (err) {
                    console.log(err);
                    cb('Error al procesar el pedido');
                } else {
                    cb('Pedido finalizado exitosamente');
                }
            });
        });
    }
};

const express = require('express');
const router = express.Router();

router.post('/agregar-al-carrito', (req, res, next) => {
    res.send('Producto agregado al carrito');
});

module.exports = router;
