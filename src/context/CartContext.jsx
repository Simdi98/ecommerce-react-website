import React, { createContext, useState, useContext } from "react";
import { getProductsById } from "../data/products";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

 function addToCart(productId) {
  setCartItems((prevItems) => {
    const existing = prevItems.find((item) => item.id === productId);
    if (existing) {
      return prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }
    return [...prevItems, { id: productId, quantity: 1 }];
  });
}

function getCartItemsWithProducts(products) {
  return cartItems
  .map(item => ({
    ...item, 
    product: getProductsById(item.id), 
  }))
  .filter(item => item.product);
}


function removeFromCart(productId) {
  setCartItems(cartItems.filter((item) => item.id !== productId));
  
}


function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId)
    return;

  }
   setCartItems(
    cartItems.map((item) =>
    item.id === productId ? { ...item, quantity} : item)
  );
}


function getCartTotal() {
  const total = cartItems.reduce((total, item) => {
    const product = getProductsById(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
  return total;
}

function clearCart() {
  setCartItems([]);
}


  return (
    <CartContext.Provider 
    value={{ 
      cartItems, 
      addToCart, 
      getCartItemsWithProducts, 
      removeFromCart, 
      updateQuantity,
      getCartTotal,
      clearCart
      }}
      >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  return context;
}
