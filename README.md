
# API-With-Database

A RESTful API for customer, product, and order management, built with Node.js, Express, and PostgreSQL. The project follows a modular architecture with a clear separation between routes, controllers, models, middleware, and database logic.

## Features

- Customer and Product CRUD
- Creating orders with multiple products
- Automatic order total calculation
- Inventory update upon order completion
- Data validation and error handling
- Secure transactions with rollback in case of failure
## Technologies used

- Node.js
- Express
- PostgreSQL
- node-postgres
- Postman
- Joi (Validations)
## Project structure

```
API-WITH-DATABASE/
├── node_modules/
├── src/
│   ├── controllers/
│   │   ├── customersController.js
│   │   ├── ordersController.js
│   │   └── productController.js
│   ├── database/
│   │   ├── index.js
│   │   └── syncDatabase.js
│   ├── errors/
│   │   ├── ConflictError.js
│   │   ├── NotFoundError.js
│   │   └── ValidationError.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Custumers.js
│   │   ├── Order.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── customersRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   └── server.js
├── package.json
├── package-lock.json
└── README.md
```
## Running locally

Clone the project

```bash
  git clone https://link-para-o-projeto
```

Enter the project directory

```bash
  cd API-With-Database
```

Connecting to PostgreSQL `src/database/index.js`
```
//Replace the connectionString value with your PostgreSQL connection string:

const pool = new Pool({
  connectionString: "postgres://user:password@localhost:5432/database_name",
  max: 2
})
```

Install dependencies

```
  npm install
```

After connecting to the database, synchronize the tables
```
npm run db:sync
```

Start the server

```
  npm run dev
```


## Endpoints

His document lists the main API endpoints for managing customers, products, and orders.

### Customers (`/customers`)

| Method | Route             | Description               |
|--------|-------------------|---------------------------|
| GET    | `/customers`      | List all customers         |
| GET    | `/customers/:id`  | Get a customer by ID       |
| POST   | `/customers`      | Create a new customer      |
| PUT    | `/customers/:id`  | Update an existing customer|
| DELETE | `/customers/:id`  | Remove a customer          |

### Products (`/products`)

| Method | Route           | Description              |
|--------|-----------------|--------------------------|
| GET    | `/products`     | List all products        |
| GET    | `/products/:id` | Get a product by ID      |
| POST   | `/products`     | Create a new product     |
| PUT    | `/products/:id` | Update an existing product|
| DELETE | `/products/:id` | Remove a product         |

### Orders (`/orders`)

| Method | Route          | Description                      |
|--------|----------------|---------------------------------|
| GET    | `/orders`      | List all orders                  |
| GET    | `/orders/:id`  | Get an order with its products   |
| POST   | `/orders`      | Create a new order               |
| DELETE | `/orders/:id`  | Remove an order and its products |

## Usage examples

### Customers

**Get all customers**  
- Method: `GET`  
- URL: `http://localhost:3000/customers`

**Get a customer by ID**  
- Method: `GET`  
- URL: `http://localhost:3000/customers/:id`

**Create a new customer**  
- Method: `POST`  
- URL: `http://localhost:3000/customers`  
- Body (JSON):  
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Update a customer**  
- Method: `PUT`  
- URL: `http://localhost:3000/customers/:id`  
- Body (JSON):  
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Delete a customer**  
- Method: `DELETE`  
- URL: `http://localhost:3000/customers/:id`

---

### Products

**Get all products**  
- Method: `GET`  
- URL: `http://localhost:3000/products`

**Get a product by ID**  
- Method: `GET`  
- URL: `http://localhost:3000/products/:id`

**Create a new product**  
- Method: `POST`  
- URL: `http://localhost:3000/products`  
- Body (JSON):  
```json
{
  "name": "Product Name",
  "price": 99.99,
  "stock": 100
}
```

**Update a product**  
- Method: `PUT`  
- URL: `http://localhost:3000/products/:id`  
- Body (JSON):  
```json
{
  "price": 89.99,
  "stock": 80
}
```

**Delete a product**  
- Method: `DELETE`  
- URL: `http://localhost:3000/products/:id`

---

### Orders

**Get all orders**  
- Method: `GET`  
- URL: `http://localhost:3000/orders`

**Get an order by ID**  
- Method: `GET`  
- URL: `http://localhost:3000/orders/:id`

**Create a new order**  
- Method: `POST`  
- URL: `http://localhost:3000/orders`  
- Body (JSON):  
```json
{
  "customerId": 1,
  "products": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

**Delete an order**  
- Method: `DELETE`  
- URL: `http://localhost:3000/orders/:id`
---
#### Developed with by João Vitor

[LinkedIn](https://www.linkedin.com/in/jvssvj/) - [GitHub](https://github.com/jvssvj) - [Website](https://jvssvj.vercel.app/)