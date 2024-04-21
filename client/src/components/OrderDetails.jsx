import React, { useEffect, useState, } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {

    const [order, setOrder] = useState([]);
    const [error, setError] = useState('');

    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderId) {
                    setError('Order ID is missing');
                    return;
                }
                const response = await axios.get(`http://localhost:3000/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
                setError('Failed to fetch order. Please try again later.');
            }
        };

        fetchOrder();
    }, [orderId]);

    return (
        <div className="flex justify-center h-screen">
            <section className="text-gray-600 body-font overflow-hidden container mx-auto">
                <div className="container px-5 py-24 mx-auto ">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h1 className="text-gray-900 text-3xl font-medium mb-1">{order.itemName} - {order.quantity} piece(s)</h1>
                            <p className="leading-relaxed">
                                From <span className='font-bold text-xl'>{order.location}</span> <br /> To <span className='font-bold text-xl'>{order.destination}</span>
                            </p>
                            <div className="flex mt-5">
                                <span className="text-2xl text-gray-900 font-medium">${order.price || "500"}</span>
                                <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Take Order</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default OrderDetails