const { Router } = require("express");
const ordersController = require("../controllers/ordersController");

const orderRoutes = Router();

orderRoutes.get("/orders", ordersController.index);
orderRoutes.get("/orders/:id", ordersController.show);
orderRoutes.post("/orders", ordersController.create);
orderRoutes.delete("/orders/:id", ordersController.delete);

module.exports = orderRoutes;