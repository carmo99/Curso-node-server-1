const { response } = require('express');
const {Producto} = require('../models');

const CrearProducto = async(req, res=response) =>
{
    try
    {
        const nombre = req.body.nombre.toUpperCase();
        const porductoDB = await Producto.findOne({nombre});
        if(porductoDB)
        {
            return res.status(400).json({
                msg: `El producto ${nombre} ya existe`
            })
        }
        const data = {
            nombre,
            usuario:req.usuario._id,
            precio:req.body.precio,
            categoria: req.body.categoria,
            desc: req.body.desc,
        }
        const producto = await new Producto(data);
        await producto.save();
        res.status(201).json(producto);
    }
    catch (err)
    {
        console.error(err)
    }
}

const ObtenerProductos = async(req, res = response) =>
{
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true};
    const [ total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    res.json({
        total,
        productos
    });
}

const ObtenerProducto = async(req, res = response) =>
{
    const {id} = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    res.json({
        producto
    });
}

const ActualizarProducto = async(req, res = response) =>
{
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const productoBD = await Producto.findOne({nombre});
    if(productoBD)
    {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        })
    }
    const data = {
        nombre,
        usuario:req.usuario._id,
        precio:req.body.precio,
        categoria: req.body.categoria,
        desc: req.body.desc,
    }
    const producto = await Producto.findByIdAndUpdate(id, data);
    res.json(producto);
}

const BorrarProducto = async(req, res = response) =>
{
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado:false});
    res.json(producto);
}

module.exports =
{
    CrearProducto,
    ObtenerProductos,
    ObtenerProducto,
    ActualizarProducto,
    BorrarProducto
}