const express = require("express");

const router = express.Router();

const {
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

module.exports = router;