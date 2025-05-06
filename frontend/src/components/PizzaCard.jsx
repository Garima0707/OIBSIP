import React from 'react';
import '../styles/PizzaCard.css';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PizzaCard = ({ pizza, onAddToCart }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1);
    const [isAnimating, setIsAnimating] = React.useState(false);  // Use this for animation

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));  // Get current user from localStorage

    const getImagePath = (pizzaName) => {
        try {
            const filename = pizzaName.toLowerCase().replace(/\s+/g, '-');
            return `/images/${filename}.jpg`;
        } catch (error) {
            return '/images/default-pizza.jpg';
        }
    };

    const handleCardClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setQuantity(1);
    };

    const handleAddToCart = async () => {
      if (!currentUser) {
          toast.error('Please log in first');
          return;
      }
  
      try {
          const cartItem = {
              userId: currentUser.id, 
              pizzaId: pizza._id,
              name: pizza.name,
              description: pizza.description,
              price: pizza.price,
              quantity: quantity,
              image: getImagePath(pizza.name),
          };
  
          const response = await fetch('http://localhost:5000/api/cart', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(cartItem),
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              throw new Error(data.message || 'Failed to add to cart');
          }
  
          toast.success('Added to Cart', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
          });
  
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 500);
          setShowModal(false);
  
      } catch (error) {
          console.error('Error adding to cart:', error);
          toast.error('Failed to add to cart');
      }
  };
  

    return (
        <>
            <div className="pizza-card" onClick={handleCardClick}>
                {!imageLoaded && !imageError && (
                    <div className="image-placeholder">Loading...</div>
                )}
                <img 
                    src={getImagePath(pizza.name)}
                    alt={pizza.name}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageError(true);
                        setImageLoaded(true);
                    }}
                    style={{ display: imageLoaded ? "block" : "none" }}
                />
                <h4>{pizza.name}</h4>
                <p>{pizza.description}</p>
                <p>₹{pizza.price}</p>
                <button 
                    className={`cart-icon-button ${isAnimating ? 'cart-icon-animate' : ''}`} 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        handleAddToCart();
                    }}
                >
                    <FaShoppingCart />
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>{pizza.name}</h2>
                        <img 
                            src={getImagePath(pizza.name)}
                            alt={pizza.name}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <p>{pizza.description}</p>
                        <p><strong>Price:</strong> ₹{pizza.price}</p>
                        <div className="quantity-control">
                            <label>Quantity: </label>
                            <input 
                                type="number" 
                                min="1" 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))} 
                            />
                        </div>
                        <button className="add-cart-button" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button className="close-button" onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PizzaCard;
