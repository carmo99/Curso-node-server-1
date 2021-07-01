const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleverify } = require('../helpers/google-verify');

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

const GoogleLogIn = async(req, res = response) =>
{
    const {id_token} = req.body;

    try
    {
        const {correo, nombre, imagen} = await googleverify(id_token);

        let usuario = await Usuario.findOne({correo});
        if(!usuario)
        {
            //Tengo que crearlo

            const data = 
            {
                nombre,
                correo,
                contrasenia: ':P',
                imagen,
                google:true

            }
            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.estado)
        {
            return res.status(400).json({
                msg:'Hable con el administrador - Usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
    }
    catch (err) 
    {
        return res.status(400).json({
            msg:'Token de Google no es valido'
        });
    }
}

module.exports =
{
    login,
    GoogleLogIn
}