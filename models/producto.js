const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre:
    {
        type: String,
        required: [true, "El nombre es obligatorio"],
        unique: true
    },
    estado://Eliminado
    {
        type: Boolean,
        default: true,
        required: true
    },
    usuario:
    {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio:
    {
        type: Number,
        default: 0
    },
    categoria:
    {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    desc:
    {
        type: String,
        default: "Producto",
    },
    disponible://Si es de temporada, etc
    {
        type: Boolean,
        default: true,
    }
});

ProductoSchema.methods.toJSON = function()
{
    const {__v, estado, ...data } = this.toObject();
    return data
}

module.exports = model('Producto', ProductoSchema);