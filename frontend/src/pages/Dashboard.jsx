import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import PizzaCard from "../components/PizzaCard";
import SideMenu from "../components/SideMenu";
import "../styles/Dashboard.css";


const Dashboard = () => {
  const [pizzas, setPizzas] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPizzas = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user/pizzas");
        console.log("Fetched pizzas:", res.data);
        setPizzas(res.data);
        setLoading(false);
      } catch (err) {
        setError("Could not load pizzas");
        setLoading(false);
        console.error(err);
        if (err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchPizzas();
  }, [navigate]);

  const handleAddToCart = (pizza) => {
    console.log("Pizza added to cart:", pizza);
  };
  
  return (
    <div className="dashboard-container">
      <SideMenu />
      <h2>Welcome to the Pizza Dashboard 🍕</h2>
      <h3>Available Pizza Varieties</h3>
      {loading ? (  
        <p>Loading pizzas...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : pizzas.length === 0 ? (
        <p>No pizzas available</p>
      ) : (
        <div className="pizzas-grid">
  {pizzas.map((pizza) => (
    <PizzaCard pizza={pizza} onAddToCart={handleAddToCart} />
  ))}
</div>

      )}
    </div>
  );
};

export default Dashboard;
