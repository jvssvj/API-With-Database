const Joi = require("joi")
const { query } = require("../database/index")
const NotFoundError = require("../errors/NotFoundError")
const ValidationError = require("../errors/ValidationError")

class Product {
    constructor(productRow) {
        this.id = productRow.id
        this.name = productRow.name
        this.description = productRow.description
        this.price = +productRow.price
        this.stockQuantity = +productRow.stock_quantity
        this.isActive = productRow.is_active
        this.createdAt = new Date(productRow.created_at)
        this.updatedAt = new Date(productRow.updated_at)
    }

    static async findAll() {
        const products = await query(`SELECT * FROM products;`)
        if (products.rows.length === 0) throw new NotFoundError('No products found.')

        return products.rows.map(row => new Product(row))
    }

    static async create(atributes) {
        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            description: Joi.string().required(),
            price: Joi.number().required(),
            stockQuantity: Joi.number().required(),
            isActive: Joi.boolean().required()
        })

        const { error, value: validAttributes } = schema.validate(atributes, {
            abortEarly: false
        })

        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ')
            throw new ValidationError(`Invalid data: ${messages}`) //Essas mensagens vêm diretamente do Joi.
        }

        const product = await query(
            `INSERT INTO products (name, description, price, stock_quantity, is_active)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`, [validAttributes.name, validAttributes.description, validAttributes.price, validAttributes.stockQuantity, validAttributes.isActive])

        return new Product(product.rows[0])
    }

    static async findById(id) {
        const { rows } = await query(`SELECT * FROM products WHERE id = $1`, [id])
        if (!rows[0]) throw new NotFoundError('Product not found.')

        const product = new Product(rows[0])
        return product
    }

    static async update(id, atributes) {
        const { rows } = await query(`SELECT * FROM products WHERE id = $1`, [id])
        if (!rows[0]) throw new NotFoundError('Product not found.')

        const product = new Product(rows[0])

        const schema = Joi.object({
            name: Joi.string().min(2).max(255),
            description: Joi.string(),
            price: Joi.number(),
            stockQuantity: Joi.number(),
            isActive: Joi.boolean()
        })

        const { error, value: validAttributes } = schema.validate(atributes, {
            abortEarly: false
        })

        if (error) {
            const messages = error.details.map(detail => detail.message).join(', ')
            throw new ValidationError(`Invalid data: ${messages}`) //Essas mensagens vêm diretamente do Joi.
        }

        Object.assign(product, validAttributes)
        product.updatedAt = new Date()

        await query(
            `UPDATE products SET
                name = $1,
                description = $2,
                price = $3,
                stock_quantity = $4,
                is_active = $5,
                updated_at = CURRENT_TIMESTAMP
                WHERE id  = $6`,
            [
                product.name,
                product.description,
                product.price,
                product.stockQuantity,
                product.isActive,
                product.id
            ])

        return product
    }

    static async delete(id) {
        const { rows } = await query(`SELECT FROM products WHERE id = $1;`, [id])
        if (!rows[0]) throw new NotFoundError("Product not found.")

        await query(`DELETE FROM products WHERE id = $1`, [id])
        return rows[0]
    }
}

module.exports = Product