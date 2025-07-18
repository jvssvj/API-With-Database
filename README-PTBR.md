[Read in English](./README.md)

# API-Com-Banco-de-Dados

Uma API RESTful para gerenciamento de clientes, produtos e pedidos, construída com Node.js, Express e PostgreSQL. O projeto segue uma arquitetura modular com separação clara entre rotas, controllers, models, middlewares e lógica de banco de dados.

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
- node-postgres (pg)
- Postman
- Joi (validações)

## Estrutura do projeto

```
API-COM-BANCO-DE-DADOS/
├── node_modules/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── errors/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
├── package-lock.json
└── README.md
```

## Executando localmente

Clone o projeto:

```bash
git clone https://link-para-o-projeto
```

Acesse o diretório do projeto:

```bash
cd API-With-Database
```

Configure a conexão PostgreSQL em `src/database/index.js`:

```js
const pool = new Pool({
  connectionString: "postgres://usuario:senha@localhost:5432/nome_do_banco",
  max: 2
});
```

Instale as dependências:

```bash
npm install
```

Sincronize as tabelas com o banco:

```bash
npm run db:sync
```

Inicie o servidor:

```bash
npm run dev
```

## Endpoints

### Clientes (`/customers`)

| Método | Rota              | Descrição                 |
|--------|-------------------|---------------------------|
| GET    | `/customers`      | Lista todos os clientes   |
| GET    | `/customers/:id`  | Retorna um cliente pelo ID|
| POST   | `/customers`      | Cria um novo cliente      |
| PUT    | `/customers/:id`  | Atualiza um cliente       |
| DELETE | `/customers/:id`  | Remove um cliente         |

### Produtos (`/products`)

| Método | Rota              | Descrição                 |
|--------|-------------------|---------------------------|
| GET    | `/products`       | Lista todos os produtos   |
| GET    | `/products/:id`   | Retorna um produto pelo ID|
| POST   | `/products`       | Cria um novo produto      |
| PUT    | `/products/:id`   | Atualiza um produto       |
| DELETE | `/products/:id`   | Remove um produto         |

### Pedidos (`/orders`)

| Método | Rota              | Descrição                          |
|--------|-------------------|------------------------------------|
| GET    | `/orders`         | Lista todos os pedidos             |
| GET    | `/orders/:id`     | Retorna um pedido e seus produtos  |
| POST   | `/orders`         | Cria um novo pedido                |
| DELETE | `/orders/:id`     | Remove um pedido e seus produtos   |

## Exemplos de uso

### Criar cliente

```http
POST /customers
Content-Type: application/json

{
  "name": "João da Silva",
  "email": "joao@email.com"
}
```

### Criar produto

```http
POST /products
Content-Type: application/json

{
  "name": "Pizza",
  "price": 29.99,
  "stock": 10
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

---

### Desenvolvido por João Vitor

[LinkedIn](https://www.linkedin.com/in/jvssvj/) - [GitHub](https://github.com/jvssvj) - [Website](https://jvssvj.vercel.app/)
