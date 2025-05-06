import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Retrieve user info

  useEffect(() => {
    if (!currentUser) {
      toast.error('Please log in to view your cart');
      return;
    }

    const fetchCartItems = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/cart?userId=${currentUser.id}`);
          if (!res.ok) {
              throw new Error('Failed to fetch cart items');
          }
          const data = await res.json();
          console.log('Fetched Cart Items:', data);
          setCartItems(data);  // Ensure data is an array
        } catch (error) {
          console.error("Error fetching cart items", error);
          toast.error('Error fetching cart items');
        } finally {
          setLoading(false);
        }
    };

    fetchCartItems();
}, [currentUser]);


  const handleRemoveItem = async (itemId) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      setCartItems(cartItems.filter(item => item._id !== itemId));
      toast.success('Item removed from cart ✅');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item ❌');
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      setCartItems(cartItems.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      ));
      toast.success('Quantity updated ✅');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity ❌');
    }
  };

  if (!currentUser) {
    return <div>Please log in to view your cart.</div>; // Return early if no user is logged in
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-details">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>₹{item.price}</p>
                <div className="quantity">
                  <label>Quantity: </label>
                  <input 
                    type="number" 
                    value={item.quantity} 
                    min="1" 
                    onChange={(e) => handleQuantityChange(item._id, Number(e.target.value))}
                  />
                </div>
                <button 
                  className="remove-button" 
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <FaTrashAlt /> Remove
                </button>
                <button className="checkout-button">Proceed to Checkout</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
