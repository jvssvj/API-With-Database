const { query, getClient } = require("../database");
const NotFoundError = require("../errors/NotFoundError");
const ValidationError = require("../errors/ValidationError");
const Customers = require("./Customers");
const Product = require("./Product");

class Order {
    constructor(orderRow, populateCustomer, populateProducts) {
        this.id = orderRow.id;
        this.customerId = orderRow.customer_id;
        this.total = +orderRow.total;
        this.createdAt = new Date(orderRow.created_at);
        this.updatedAt = new Date(orderRow.updated_at);

        this.customer = undefined;
        if (populateCustomer) {
            this.customer = populateCustomer;
        }
        this.orderProducts = undefined;
        if (populateProducts) {
            this.orderProducts = populateProducts;
        }
    }

    static async findAll() {
        const result = await query(`
            SELECT
                orders.id AS "order.id",
                orders.total AS "order.total",
                orders.status AS "order.status",
                orders.created_at AS "order.created_at",
                orders.updated_at AS "order.updated_at",
                customers.id AS "customer.id",
                customers.name AS "customer.name",
                customers.email AS "customer.email",
                customers.created_at AS "customer.created_at",
                customers.updated_at AS "customer.updated_at"
            FROM orders
            JOIN customers ON customers.id = orders.customer_id
            ORDER BY orders.created_at DESC;
        `);

        if (result.rows.length === 0) throw new NotFoundError('Orders not found.')

        return result.rows.map(row => new Order(row));
    }

    static async create(customerId, orderProducts) {
        const storedOrderProducts = await query(
            `SELECT * FROM products WHERE id = ANY($1::int[]);`,
            [orderProducts.map(product => product.id)]
        )

        let totalOrder = 0;
        const populatedOrderProducts = storedOrderProducts.rows.map((row) => {
            const { quantity } = orderProducts.find((product) => product.id === row.id)
            totalOrder += +row.price * quantity

            return { product: new Product(row), quantity }
        })

        const dbClient = await getClient()
        let response;

        try {
            await dbClient.query("BEGIN")

            const orderCreationResult = await dbClient.query(
                `INSERT INTO orders (customer_id, total) VALUES ($1, $2) RETURNING *;`,
                [customerId, totalOrder]
            )

            const order = new Order(orderCreationResult.rows[0], null, populatedOrderProducts)

            for (const entry of populatedOrderProducts) {
                if (entry.product.stockQuantity < entry.quantity) {
                    throw new ValidationError(`The product ${entry.product.name} does not have sufficient stock`)
                }

                await dbClient.query(
                    `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3);`,
                    [order.id, entry.product.id, entry.quantity]
                )

                const newStockQuantity = entry.product.stockQuantity - entry.quantity
                await dbClient.query('UPDATE products SET stock_quantity = $1 WHERE id = $2;', [newStockQuantity, entry.product.id])
            }

            await dbClient.query("COMMIT")
            response = order
        } catch (error) {
            await dbClient.query("ROLLBACK")
            response = { message: `Error while creating order: ${error.message}` }
        } finally {
            dbClient.release()
        }

        return response
    }

    static async findById(id) {
        const orderResult = await query(
            `SELECT
        orders.*,
        customers.id AS "customer.id",
        customers.name AS "customer.name",
        customers.email AS "customer.email",
        customers.created_at AS "customer.created_at",
        customers.updated_at AS "customer.updated_at"
      FROM orders JOIN customers ON customers.id = orders.customer_id
      WHERE orders.id = $1;`,
            [id]
        )

        if (orderResult.rows.length === 0) throw new NotFoundError(`Order with ID ${id} not found`)

        const orderProductsResult = await query(
            `SELECT order_products.*, products.*
      FROM order_products JOIN products ON order_products.product_id = products.id
      WHERE order_products.order_id = $1;`,
            [id]
        )

        if (orderProductsResult.rows.length === 0) throw new NotFoundError(`No products found for order with ID ${id}.`)

        const orderData = orderResult.rows[0]
        const customer = new Customers({
            id: orderData["customer.id"],
            name: orderData["customer.name"],
            email: orderData["customer.email"],
            created_at: orderData["customer.created_at"],
            updated_at: orderData["customer.updated_at"]
        })

        const products = orderProductsResult.rows.map(row => new Product(row))

        return new Order(orderData, customer, products)
    }

    static async delete(id) {
        const dbClient = await getClient()
        let result
        try {
            await dbClient.query("BEGIN")
            await dbClient.query(`DELETE FROM order_products WHERE order_id = $1;`, [id])
            await dbClient.query(`DELETE FROM orders WHERE id = $1`, [id])
            await dbClient.query("COMMIT")
            result = { message: "Order deleted successfully" }
        } catch (error) {
            await dbClient.query("ROLLBACK")
            result = { message: "Error while deleting order" }
        } finally {
            dbClient.release()
        }
        return result
    }
}

module.exports = Order;