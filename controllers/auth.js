const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res= response) => {

    const {correo, contrasenia} = req.body;
    try {

        //Verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(! usuario)
        {
            return res.status(400).json({
                msg:'Correo / Contraseña no son correctos - correo'
            });
        }

        //Verificar si el usuario está activo
        if(! usuario.estado)
        {
            return res.status(400).json({
                msg:'Correo / Contraseña no son correctos - estado:false'
            });
        }

        //Verificar la contrasenia
        const validContrasenia = bcryptjs.compareSync(contrasenia, usuario.contrasenia);
        if(!validContrasenia)
        {
            return res.status(400).json({
                msg:'Correo / Contraseña no son correctos - contrasenia'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ 
            msg:'Hable con el administrador'
        })
    }
}

module.exports =
{
    login
}