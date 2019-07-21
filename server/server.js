require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// parse aplication/X-www-form-urlencode
app.use(express.urlencoded({ extended: false }));

// configuración global de rutas
app.use(require('./routes/index'));

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname , '../public')));

mongoose.connect(process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex: true },
                (err, res) => {
        
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});