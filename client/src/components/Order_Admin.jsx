import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios';
const Order_Admin = () => {
  const [order, setOrder] = useState([]);
  const getOrder = async () => {
    try {
      const response = await axios.get('http://localhost:3000/');
      setOrder(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/order/${orderId}`);
      setOrder(order.filter(item => item._id !== orderId));
      console.log('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      {order.length >= 1 ? (
        order.map((item, index) => (
          <Link to={`/orders/${item._id}`} key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 block hover:shadow-lg transition duration-300">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{index + 1}. <span className="text-xl">{item.itemName}</span> - {item.quantity} piece(s)</h2>
              <button onClick={() => deleteOrder(item._id)} className="text-gray-500 hover:text-red-500 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600">Location: <span className='font-bold'>{item.location}</span> Destination: <span className="font-bold">{item.destination}</span></p>
          </Link>
        ))
      ) : (
        <div className="text-center text-4xl">
          No orders
        </div>
      )}
    </div>
  );
};

export default Order_Admin;
