const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');

// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    });

});

// Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    
    const id = req.params.id;
    
    Categoria.findById({ _id: id }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                message: 'El ID no es correcto'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Actualizar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de la categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Borrar categoria permanentemente
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un administrador puede borrar categorias

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de la categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });

    });

});

module.exports = app;
