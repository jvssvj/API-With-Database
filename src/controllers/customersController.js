const Customers = require("../models/Custumers")

const customersController = {
    // GET /customers
    index: async (req, res, next) => {
        try {
            const customers = await Customers.findAll()
            return res.status(200).json(customers)
        } catch (error) {
            next(error)
        }
    },

    // POST /customers
    create: async (req, res, next) => {
        try {
            const newCustomer = await Customers.create(req.body)
            return res.status(201).json({ message: `Customer created sucessfully:`, data: newCustomer })
        } catch (error) {
            next(error)
        }
    },

    // GET /customers/:id
    show: async (req, res, next) => {
        try {
            const customer = await Customers.findById(req.params.id)
            return res.status(200).json({ message: `Customer found:`, data: customer })
        } catch (error) {
            next(error)
        }
    },

    // PUT /customers/:id
    update: async (req, res, next) => {
        try {
            const updateCustomer = await Customers.update(req.params.id, req.body)
            return res.status(200).json({ message: "Customer updated successfully", data: updateCustomer })
        } catch (error) {
            next(error)
        }
    },

    // DELETE /customers/:id
    delete: async (req, res, next) => {
        try {
            const deleteCustomer = await Customers.delete(req.params.id)
            return res.status(200).json({ message: "Customer successfully deleted." })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = customersController