const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción de la categoria es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId, ref: 'usuario'
    }

});

module.exports = mongoose.model('categoria', categoriaSchema);
