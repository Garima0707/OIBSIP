import React, { useEffect, useState } from "react";
import api from "../api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  const fetchOrders = async () => {
    try {
      const { startDate, endDate } = filters;
      const query = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : "";
      const res = await api.get(`/user/order-history${query}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading order history:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div>
      <h2>Your Order History 🍕</h2>

      <form onSubmit={handleFilter} style={{ marginBottom: "20px" }}>
        <label>
          From:{" "}
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        </label>
        <label style={{ marginLeft: "10px" }}>
          To:{" "}
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </label>
        <button type="submit" style={{ marginLeft: "10px" }}>Filter</button>
      </form>

      {orders.length === 0 ? (
        <p>No orders found for the selected date range.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Amount Paid:</strong> ₹{order.amount}</p>
            <p><strong>Pizza:</strong> {order.pizza?.base}, {order.pizza?.sauce}, {order.pizza?.cheese}, {order.pizza?.veggies?.join(", ")}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
