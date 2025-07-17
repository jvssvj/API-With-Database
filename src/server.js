const express = require('express')
const customersRoutes = require('./routes/customersRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')

const { errorHandler } = require('./middlewares/errorHandler')


const app = express()

app.use(express.json())

app.use(productRoutes)
app.use(customersRoutes)
app.use(orderRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))