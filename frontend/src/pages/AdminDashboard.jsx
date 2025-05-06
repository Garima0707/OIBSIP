import React, { useEffect, useState } from "react";
import api from "../api";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar, CartesianGrid, ResponsiveContainer } from "recharts";
import { ClipLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom"; // Import useNavigate hook

const COLORS = ["#00C49F", "#FF8042"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [payments, setPayments] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false); // State to manage redirection
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    const fetchStats = async () => {
      const res = await api.get("/admin/payment-stats");
      setStats(res.data.stats);
      setPayments(res.data.payments);
    };

    const fetchInventory = async () => {
      try {
        const res = await api.get("/admin/inventory");
        setInventory(res.data);
      } catch (err) {
        console.error("Failed to fetch inventory", err);
      }
    };

    fetchStats();
    fetchInventory();
  }, []);

  const updateInventory = async (orderDetails) => {
    setLoading(true);

    const { base, sauce, cheese, veggies, meat } = orderDetails;

    try {
      const res = await api.put("/admin/update-inventory", {
        base,
        sauce,
        cheese,
        veggies,
        meat,
      });

      // Update inventory state with the latest data
      setInventory(res.data);
      setLoading(false);
      alert("Inventory updated successfully!");
      setRedirect(true); // Trigger redirect

    } catch (err) {
      setLoading(false);
      console.error("Failed to update inventory", err);
      alert("Error updating inventory");
    }
  };

  if (redirect) {
    return <Navigate to="/dashboard" />; // Proper usage of Navigate component
  }

  if (!stats || !inventory) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
        <ClipLoader color="#00C49F" size={50} />
      </div>
    );
  }

  const pieData = [
    { name: "Successful", value: stats.success },
    { name: "Failed", value: stats.failed },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Admin Dashboard 📊</h2>
      <p>Total Orders: {stats.total}</p>
      <p>Total Revenue: ₹{stats.revenue}</p>

      <div style={{ display: "flex", gap: "4rem", marginTop: "2rem" }}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pieData}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ marginTop: "2rem" }}>All Payments</h3>
      <table border="1" cellPadding="10" style={{ marginTop: "1rem", width: "100%" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Pizza</th>
            <th>User</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.orderId}</td>
              <td>₹{p.amount}</td>
              <td style={{ color: p.status === "success" ? "green" : "red" }}>{p.status}</td>
              <td>{p.pizza?.base || "-"}</td>
              <td>{p.user?.name || "Guest"}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Inventory Section */}
      <h3 style={{ marginTop: "2rem" }}>Inventory Status</h3>
      <table border="1" style={{ marginTop: "20px", padding: "10px" }}>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Quantity Available</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pizza Base</td>
            <td>{inventory.base}</td>
          </tr>
          <tr>
            <td>Sauce</td>
            <td>{inventory.sauce}</td>
          </tr>
          <tr>
            <td>Cheese</td>
            <td>{inventory.cheese}</td>
          </tr>
          <tr>
            <td>Veggies</td>
            <td>{inventory.veggies}</td>
          </tr>
          <tr>
            <td>Meat</td>
            <td>{inventory.meat}</td>
          </tr>
        </tbody>
      </table>
      {/* Sample Order to Update Inventory */}
      <button onClick={() => updateInventory({ base: 1, sauce: 1, cheese: 1, veggies: 2, meat: 1 })}>
        Simulate Order (Update Inventory)
      </button>
    </div>
  );
};

export default AdminDashboard;
