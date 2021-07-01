
const {Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    contrasenia: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        default: 'USER_ROL',
        emun: ['ADMIN_ROL', 'USER_ROL']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: 
    {
        type: Boolean,
        default: false   
    }
});

usuarioSchema.methods.toJSON = function()
{
    const {__v, contrasenia,_id, ...usuario } = this.toObject();
    usuario.uid = _id;

    return usuario
}

module.exports = model('Usuario', usuarioSchema);