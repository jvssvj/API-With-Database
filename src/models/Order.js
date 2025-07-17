const { query, getClient } = require("../database");
const ValidationError = require("../errors/ValidationError");
const Customers = require("./Custumers");
const Product = require("./Product");

class Order {
    constructor(orderRow, populateCustomer, populateProducts) {
        this.id = orderRow.id;
        this.customerId = orderRow.customer_id;
        this.total = +orderRow.total;
        this.createdAt = new Date(orderRow.created_at);
        this.updatedAt = new Date(orderRow.updated_at);

        // dessa vez nosso construtor incluirá a possibilidade de
        // popular propriedades com dados das tabelas associadas
        this.customer = undefined;
        if (populateCustomer) {
            this.customer = populateCustomer;
        }
        this.orderProducts = undefined;
        if (populateProducts) {
            this.orderProducts = populateProducts;
        }
    }

    // no método findAll() incluiremos os dados do cliente no pedido
    static async findAll() {
        const result = await query(
            `SELECT
        orders.*,
        customers.id AS "customer.id",
        customers.name AS "customer.name",
        customers.email AS "customer.email",
        customers.created_at AS "customer.created_at",
        customers.updated_at AS "customer.updated_at"
      FROM orders JOIN customers ON customers.id = orders.customer_id;`
        );
        return result.rows.map(row => new Order(row));
    }

    // no método create() veremos como usar uma transaction
    /**
   * 
   * @param {number} customerId 
   * @param {{ id: number, quantity: number }[]} orderProducts 
   */
    static async create(customerId, orderProducts) {

        //Buscar os dados dos produtos no banco
        const storedOrderProducts = await query(
            `SELECT * FROM products WHERE id = ANY($1::int[]);`,
            [orderProducts.map(product => product.id)]
        )



        //Multiplica price * quantity para cada produto
        //Soma tudo em totalOrder
        //Cria um array com os produtos e suas quantidades
        let totalOrder = 0;
        const populatedOrderProducts = storedOrderProducts.rows.map((row) => {
            const { quantity } = orderProducts.find((product) => product.id === row.id)
            totalOrder += +row.price * quantity

            return { product: new Product(row), quantity }
        })





        //Garante que todas as queries sejam executadas como uma única operação atômica
        //Se algo falhar, tudo é revertido(ROLLBACK)
        const dbClient = await getClient()
        let response;

        try {
            await dbClient.query("BEGIN")

            //Cria o pedido com o ID do cliente e o total calculado
            //Usa RETURNING * para pegar os dados do pedido recém-criado
            const orderCreationResult = await dbClient.query(
                `INSERT INTO orders (customer_id, total) VALUES ($1, $2) RETURNING *;`,
                [customerId, totalOrder]
            )

            const order = new Order(orderCreationResult.rows[0], null, populatedOrderProducts)

            //Para cada produto, cria um registro que liga o pedido ao produto e registra a quantidade
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


            //Salva tudo no banco de dados
            await dbClient.query("COMMIT")
            response = order
        } catch (error) {
            // Desfaz tudo em caso de erro
            await dbClient.query("ROLLBACK")
            response = { message: `Error while creating order: ${error.message}` }
        } finally {
            dbClient.release()
        }


        return response
    }

    // no método findById() incluiremos os dados do cliente e a lista dos produtos
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

        const orderProductsResult = await query(
            `SELECT order_products.*, products.*
      FROM order_products JOIN products ON order_products.product_id = products.id
      WHERE order_products.order_id = $1;`,
            [id]
        )



        const orderData = orderResult.rows[0]
        const customer = new Customers({
            id: orderData["customer.id"],
            name: orderData["customer.name"],
            email: orderData["customer.email"],
            created_at: orderData["customer.created_at"],
            updated_at: orderData["customer.updated_at"]
        })
        const orderReset = new Product(orderProductsResult.rows[0])

        return new Order(orderData, customer, orderReset)
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
};

module.exports = Order;