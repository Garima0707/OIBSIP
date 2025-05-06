import React, { useState } from "react";
import api from "../api";

const pizzaOptions = {
    bases: ["Thin Crust", "Thick Crust", "Cheese Burst", "Whole Wheat", "Gluten Free"],
    sauces: ["Tomato Basil", "Barbecue", "Pesto", "Alfredo", "Spicy Chipotle"],
    cheeses: ["Mozzarella", "Cheddar", "Parmesan", "Vegan", "No Cheese"],
    veggies: ["Onion", "Capsicum", "Tomato", "Mushroom", "Olives", "Corn", "Jalapeno"],
  };
const optionPrices = {
    bases: {
      "Thin Crust": 50,
      "Thick Crust": 60,
      "Cheese Burst": 80,
      "Whole Wheat": 70,
      "Gluten Free": 90,
    },
    sauces: {
      "Tomato Basil": 30,
      "Barbecue": 35,
      "Pesto": 40,
      "Alfredo": 45,
      "Spicy Chipotle": 50,
    },
    cheeses: {
      "Mozzarella": 40,
      "Cheddar": 50,
      "Parmesan": 60,
      "Vegan": 70,
      "No Cheese": 0,
    },
    veggies: {
      Onion: 10,
      Capsicum: 10,
      Tomato: 10,
      Mushroom: 15,
      Olives: 15,
      Corn: 10,
      Jalapeno: 15,
    },
  };  

const BuildPizza = () => {
  const [step, setStep] = useState(1);
  const [pizza, setPizza] = useState({
    base: "",
    sauce: "",
    cheese: "",
    veggies: [],
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSelect = (field, value) => {
    if (field === "veggies") {
      setPizza((prev) => ({
        ...prev,
        veggies: prev.veggies.includes(value)
          ? prev.veggies.filter((v) => v !== value)
          : [...prev.veggies, value],
      }));
    } else {
      setPizza((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleConfirm = async () => {
    const res = await loadRazorpayScript();

  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

    try {
        const amount = calculateTotal(); // Use the total amount calculated
      // Request to create the Razorpay order
      const res = await api.post("/user/create-order", {
        amount: amount * 100, // This is the amount in paise (i.e., ₹ amount * 100)
      });
  
      // Fetch the order details, including the Razorpay key
      const { orderId, currency, key } = res.data;
  
      // Initialize the Razorpay checkout
      const options = {
        key: "rzp_test_8TM57R2fwPg3s7", // Your Razorpay API key
        amount: amount * 100, // The total amount in paise
        currency: currency, // Currency type (INR)
        order_id: orderId, // Razorpay order ID
        name: "Pizza Order", // Display name on Razorpay checkout
        description: "Your custom pizza order",
        handler: async function (response) {
            // Payment was successful
        await api.post("/user/payment-success", {
            ...response,
            amount,
            orderId,
            pizza,
          });
          alert("Payment Successful!");
        },
        prefill: {
          name: "Customer Name", // Customer details can be auto-filled here
          email: "customer@example.com",
          contact: "1234567890",
        },
        theme: {
          color: "#F37254", // Set the theme color of the Razorpay popup
        },
        modal: {
            ondismiss: async function () {
              // Payment modal was closed (considered as failed/aborted)
              await api.post("/user/payment-failed", {
                orderId,
                amount,
              });
              alert("Payment Cancelled or Failed.");
            },
          },
      };
  
      // Open the Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  
  

  const resetBuilder = () => {
    setPizza({ base: "", sauce: "", cheese: "", veggies: [] });
    setStep(1);
  };
  
  const calculateTotal = () => {
    let total = 0;
    total += optionPrices.bases[pizza.base] || 0;
    total += optionPrices.sauces[pizza.sauce] || 0;
    total += optionPrices.cheeses[pizza.cheese] || 0;
    pizza.veggies.forEach((veg) => {
      total += optionPrices.veggies[veg] || 0;
    });
    return total;
  };
  
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3>Select Pizza Base</h3>
            {pizzaOptions.bases.map((base) => (
              <button
                key={base}
                onClick={() => handleSelect("base", base)}
                style={{ margin: "5px", background: pizza.base === base ? "#4caf50" : "" }}
              >
                {base}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Select Sauce</h3>
            {pizzaOptions.sauces.map((sauce) => (
              <button
                key={sauce}
                onClick={() => handleSelect("sauce", sauce)}
                style={{ margin: "5px", background: pizza.sauce === sauce ? "#4caf50" : "" }}
              >
                {sauce}
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Select Cheese</h3>
            {pizzaOptions.cheeses.map((cheese) => (
              <button
                key={cheese}
                onClick={() => handleSelect("cheese", cheese)}
                style={{ margin: "5px", background: pizza.cheese === cheese ? "#4caf50" : "" }}
              >
                {cheese}
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div>
            <h3>Select Veggies</h3>
            {pizzaOptions.veggies.map((veg) => (
              <button
                key={veg}
                onClick={() => handleSelect("veggies", veg)}
                style={{
                  margin: "5px",
                  background: pizza.veggies.includes(veg) ? "#4caf50" : "",
                }}
              >
                {veg}
              </button>
            ))}
          </div>
        );
      default:
        return (
          <div>
            <h3>Review Your Custom Pizza</h3>
            <pre>{JSON.stringify(pizza, null, 2)}</pre>
            <p><strong>Total Price: ₹{calculateTotal()}</strong></p>
            <button onClick={handleConfirm}>Confirm Pizza</button>
          </div>
        );
    }
  };

  return (
    <div>
      <h2>Build Your Custom Pizza 🍕</h2>
      {renderStep()}
      <div style={{ marginTop: "20px" }}>
        {step > 1 && <button onClick={handleBack}>Back</button>}
        {step < 5 && <button 
        onClick={handleNext} 
        disabled={
            (step === 1 && !pizza.base) ||
            (step === 2 && !pizza.sauce) ||
            (step === 3 && !pizza.cheese)
            }
            >
                Next
                </button>}
      </div>
    </div>
  );
};

export default BuildPizza;
