const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {
    // Traer todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    console.log(desde, limite);

    Producto.
    find({ disponible: true }).
    sort('nombre').
    skip(desde).
    limit(limite).
    populate('categoria', 'descripcion').
    populate('usuario', 'nombre email').
    exec((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB || productosDB.length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'No hay productos para mostrar'
            });
        }

        Producto.countDocuments({ disponible: true }, (err, conteo) => {
            res.json({
                ok: true,
                productos: productoDB,
                cantidad: conteo
            });
        });

    });

});

// Obtener un producto por Id
app.get('/producto/:id', (req, res) => {
    // populate: usuario categoria

    const id = req.params.id;

    Producto.findById({ _id: id }).
    populate('categoria', 'descripcion').
    populate('usuario', 'nombre email').
    exec((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                message: 'El Id no es correcto'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// Buscar productos
app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // 'i' = Insensible a mayusculas y minisculas

    Producto.
    find({ nombre: regex }).
    populate('categoria', 'descripcion').
    exec((err, productosDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB || productosDB.length === 0) {
            return res.status(500).json({
                ok: false,
                message: `No existen productos con el termino ${ termino }`
            });
        }

        res.json({
            ok: true,
            productos: productosDB
        });

    });

});

// Crear un producto
app.post('/producto', verificaToken, (req, res) => {
    // Grabar el producto
    // Grabar una categoria del listado
    const body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

// Actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

// Borrar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const cambiarDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiarDisponible, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto desabilitado'
        });

    });

});

module.exports = app;
