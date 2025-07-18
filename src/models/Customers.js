const { query } = require("../database")
const ConflictError = require("../errors/ConflictError")
const NotFoundError = require("../errors/NotFoundError")
const ValidationError = require("../errors/ValidationError")
const Joi = require('joi')

class Customers {
    constructor(customersRow) {
        this.id = customersRow.id
        this.name = customersRow.name
        this.email = customersRow.email
        this.createdAt = customersRow.created_at
        this.updatedAt = customersRow.updated_at
    }

    static async create(attributes) {
        const customerExists = await query(`SELECT * FROM customers WHERE email = $1;`, [attributes.email])
        if (customerExists.rows[0]) throw new ConflictError("Email already in use!")

        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            email: Joi.string().email().required()
        })

        const { error, value: validAttributes } = schema.validate(attributes, { abortEarly: false })
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ')
            throw new ValidationError(`Invalid data: ${messages}`)
        }

        const result = await query(
            `INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *;`,
            [validAttributes.name, validAttributes.email]
        )
        return new Customers(result.rows[0])
    }

    static async findAll() {
        const result = await query(`SELECT * FROM customers;`)
        if (result.rows.length === 0) throw new NotFoundError("No customers found.")

        return result.rows.map(row => new Customers(row))
    }

    static async findById(id) {
        const { rows } = await query(`SELECT * FROM customers WHERE id = $1`, [id])
        if (!rows[0]) throw new NotFoundError('Customer not found.')

        const customer = new Customers(rows[0])
        return customer
    }

    static async update(id, atributes) {
        const { rows } = await query(`SELECT * FROM customers WHERE id = $1;`, [id])

        if (!rows[0]) throw new NotFoundError('Customer not found.')

        const customers = new Customers(rows[0])
        const schema = Joi.object({
            name: Joi.string().min(2).max(255),
            email: Joi.string().email()
        })

        const { error, value: validAttributes } = schema.validate(atributes, { abortEarly: false })
        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ')
            throw new ValidationError(`Invalid data: ${messages}`)
        }

        Object.assign(customers, validAttributes)
        customers.updatedAt = new Date()

        await query(
            `UPDATE customers SET name = $1, email = $2 WHERE id = $3;`, [customers.name, customers.email, customers.id])

        return customers
    }

    static async delete(id) {
        const { rows } = await query(`SELECT FROM customers WHERE id = $1`, [id])

        if (!rows[0]) throw new NotFoundError('Customer not found.')

        await query(`DELETE FROM customers WHERE id = $1`, [id])
        return rows[0]
    }
}

module.exports = Customers