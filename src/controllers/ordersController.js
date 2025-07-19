const Order = require("../models/Order")

const ordersController = {
    // GET /orders
    index: async (req, res) => {
        const orders = await Order.findAll()
        res.json(orders)
    },

    // POST /orders
    create: async (req, res) => {
        try {
            const newOrder = await Order.create(req.body.customerId, req.body.products)
            return res.status(201).json(newOrder)
        } catch (error) {
            next()
        }
    },

    // GET /orders/:id
    show: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id)
            return res.json(order)
        } catch (error) {
            next()
        }
    },

    // DELETE /orders/:id
    delete: async (req, res) => {
        try {
            const result = await Order.delete(req.params.id)
            return res.json(result)
        } catch (error) {
            next()
        }
    }
}

module.exports = ordersController