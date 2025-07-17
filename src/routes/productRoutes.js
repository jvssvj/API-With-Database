const { Router } = require('express')
const productsController = require('../controllers/productController')


const productRoutes = Router()

productRoutes.get('/products', productsController.index)
productRoutes.get('/products/:id', productsController.show)
productRoutes.post('/products', productsController.save)
productRoutes.put('/products/:id', productsController.update)
productRoutes.delete('/products/:id', productsController.delete)

module.exports = productRoutes
