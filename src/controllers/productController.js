const Product = require("../models/Product")

const productsController = {
    //GET /products
    index: async (req, res, next) => {
        try {
            const products = await Product.findAll()
            return res.json(products)
        } catch (error) {
            next(error)
        }
    },

    //POST /products
    save: async (req, res, next) => {
        try {
            const newProduct = await Product.create(req.body)
            return res.status(201).json(newProduct)
        } catch (error) {
            next(error)
        }
    },

    //GET /products/:id
    show: async (req, res, next) => {
        try {
            const product = await Product.findById(req.params.id)
            return res.json(product)
        } catch (error) {
            next(error)
        }
    },

    // PUT /products/:id
    update: async (req, res, next) => {

        try {
            const updatedProduct = await Product.update(req.params.id, req.body)
            return res.json(updatedProduct)
        } catch (error) {
            next()
        }
    },

    // DELETE /products/:id
    delete: async (req, res, next) => {
        try {
            const result = await Product.delete(req.params.id)
            return res.json(result)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = productsController