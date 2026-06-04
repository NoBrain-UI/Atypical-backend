const pool = require("../config/db");

const {
  publishOrderEvent,
} = require("../services/orderPublisher");

// CREATE ORDER
async function createOrder(req, res) {
  try {
    const {
      customer_name,
      product_name,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO orders
      (
        customer_name,
        product_name,
        status
      )
      VALUES
      ($1,$2,$3)
      RETURNING *
      `,
      [
        customer_name,
        product_name,
        status,
      ]
    );

    const order = result.rows[0];

    await publishOrderEvent(
      "order.created",
      {
        event: "CREATE",
        data: order,
      }
    );

    res.status(201).json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error creating order",
    });
  }
}

// UPDATE ORDER
async function updateOrder(req, res) {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const result = await pool.query(
      `
      UPDATE orders
      SET
      status = $1,
      updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    const order = result.rows[0];

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await publishOrderEvent(
      "order.updated",
      {
        event: "UPDATE",
        data: order,
      }
    );

    res.json(order);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating order",
    });
  }
}

// DELETE ORDER
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM orders
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    const deletedOrder = result.rows[0];

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await publishOrderEvent(
      "order.deleted",
      {
        event: "DELETE",
        data: deletedOrder,
      }
    );

    res.json({
      message: "Deleted",
      order: deletedOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting order",
    });
  }
}

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
};