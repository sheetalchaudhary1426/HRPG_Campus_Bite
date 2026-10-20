
import { useEffect, useState } from "react";
import { orderAPI } from "../../services/api";

function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await orderAPI.getAll();

        const orderList = Array.isArray(response)
          ? response
          : response.orders ?? response.data?.orders ?? response.data ?? [];

        if (!Array.isArray(orderList)) {
          throw new Error("Unexpected orders response from server.");
        }

        if (active) {
          setError("");
          setOrders(orderList);
        }
      } catch (err) {
        if (active) setError(err.message || "Failed to load orders.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, [refreshCount]);

  async function changeStatus(orderId, status) {
    setError("");
    setUpdatingOrderId(orderId);

    try {
      const response = await orderAPI.updateStatus(orderId, status);

      const updatedOrder =
        response.order ??
        response.data?.order ??
        response.data ??
        response;

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                ...(updatedOrder &&
                typeof updatedOrder === "object"
                  ? updatedOrder
                  : {}),
                status,
              }
            : order
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div>
      <h2>Orders Management</h2>

      {error && (
        <p role="alert" style={{ color: "red" }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          setLoading(true);
          setRefreshCount((current) => current + 1);
        }}
      >
        Refresh Orders
      </button>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Token #{order.tokenNumber ?? "N/A"}</h3>

            <p>
              Student:{" "}
              {order.user?.name ??
                order.userId?.name ??
                "Unknown"}
            </p>

            <p>Total: ₹{order.totalAmount ?? 0}</p>

            <p>
              Status: {order.status ?? "pending"}
            </p>

            <select
              aria-label={`Update status for order ${order.tokenNumber ?? order._id}`}
              value={order.status ?? "pending"}
              disabled={updatingOrderId === order._id}
              onChange={(event) =>
                changeStatus(order._id, event.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {updatingOrderId === order._id && (
              <span> Updating...</span>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersManagement;
