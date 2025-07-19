[Read in English](./README.md)

# API-With-Database

Uma API RESTful para gerenciamento de clientes, produtos e pedidos, desenvolvida com Node.js, Express e PostgreSQL. O projeto segue uma arquitetura modular com uma separação clara entre rotas, controladores, modelos, middleware e lógica de banco de dados.

## Funcionalidades

- CRUD de clientes e produtos
- Criação de pedidos com múltiplos produtos
- Cálculo automático do total do pedido
- Atualização de estoque ao finalizar pedidos
- Validação de dados e tratamento de erros
- Transações seguras com rollback em caso de falha

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- node-postgres
- Postman
- Joi (Validations)

## Estrutura do projeto

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
## Executando localmente

Clonar o projeto

```bash
  git clone https://link-para-o-projeto
```

Entre no diretório do projeto

```bash
  cd API-With-Database
```

Conectando ao PostgreSQL `src/database/index.js`

```
//Substitua o valor connectionString pela sua connectionString do PostgreSQL:

const pool = new Pool({
  connectionString: "postgres://user:password@localhost:5432/database_name",
  max: 2
})
```

Instalar dependências

```
  npm install
```

Após conectar ao banco de dados, sincronize as tabelas

```
npm run db:sync
```

Inicie o servidor

```
  npm run dev
```


## Endpoints

Lista os endpoints da API para gerenciamento de clientes, produtos e pedidos.

### Clientes (`/customers`)

| Método | Rotas             | Descrição               |
|--------|-------------------|---------------------------|
| GET    | `/customers`      | Lista todos os clientes   |
| GET    | `/customers/:id`  | Retorna um cliente pelo ID|
| POST   | `/customers`      | Cria um novo cliente      |
| PUT    | `/customers/:id`  | Atualiza um cliente       |
| DELETE | `/customers/:id`  | Remove um cliente         |

### Produtos (`/products`)

| Método | Rotas              | Descrição                 |
|--------|-------------------|---------------------------|
| GET    | `/products`       | Lista todos os produtos   |
| GET    | `/products/:id`   | Retorna um produto pelo ID|
| POST   | `/products`       | Cria um novo produto      |
| PUT    | `/products/:id`   | Atualiza um produto       |
| DELETE | `/products/:id`   | Remove um produto         |

### Ordens (`/orders`)

| Método | Rotas              | Descrição                          |
|--------|-------------------|------------------------------------|
| GET    | `/orders`         | Lista todos os pedidos             |
| GET    | `/orders/:id`     | Retorna um pedido e seus produtos  |
| POST   | `/orders`         | Cria um novo pedido                |
| DELETE | `/orders/:id`     | Remove um pedido e seus produtos   |

## Exemplos de uso

### Clientes

**Obter todos os clientes**  
- Método: `GET`  
- URL: `http://localhost:3000/customers`

**Obter um cliente por ID**  
- Método: `GET`  
- URL: `http://localhost:3000/customers/:id`

**Crie um novo cliente**  
- Método: `POST`  
- URL: `http://localhost:3000/customers`  
- Body (JSON):  
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Atualizar um cliente**  
- Método: `PUT`  
- URL: `http://localhost:3000/customers/:id`  
- Body (JSON):  
```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

**Deletar um cliente**  
- Método: `DELETE`  
- URL: `http://localhost:3000/customers/:id`

---

### Produtos

**Obter todos os produtos**  
- Método: `GET`  
- URL: `http://localhost:3000/products`

**Obter um produto por ID**  
- Método: `GET`  
- URL: `http://localhost:3000/products/:id`

**Crie um novo produto**  
- Método: `POST`  
- URL: `http://localhost:3000/products`  
- Body (JSON):  
```json
{
  "name": "Product Name",
  "price": 99.99,
  "stock": 100
}
```

### Criar pedido

```http
POST /orders
Content-Type: application/json

{
  "customerId": 1,
  "products": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

**Excluir um pedido**  
- Método: `DELETE`  
- URL: `http://localhost:3000/orders/:id`
---
#### Developed with by João Vitor

[LinkedIn](https://www.linkedin.com/in/jvssvj/) - [GitHub](https://github.com/jvssvj) - [Website](https://jvssvj.vercel.app/)