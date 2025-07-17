const { Router } = require('express')
const customersController = require('../controllers/customersController')

const customersRoutes = Router()

customersRoutes.get('/customers', customersController.index)
customersRoutes.get('/customers/:id', customersController.show)
customersRoutes.post('/customers', customersController.create)
customersRoutes.put('/customers/:id', customersController.update)
customersRoutes.delete('/customers/:id', customersController.delete)

module.exports = customersRoutes
