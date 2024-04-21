import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const OrderPage = () => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate()

    const handlePlaceOrder = async () => {
        console.log(itemName, quantity, location, destination);
        try {
            const order = await axios.post("http://localhost:3000/order", {
                itemName, quantity, location, destination
            });
            alert(order.data.msg);
            navigate('/')
        } catch (error) {
            setErrorMsg(error.response.data.msg);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <div className="flex flex-col items-center gap-y-4">
                <input
                    type="text"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center gap-x-4">
                    <select
                        value={quantity}
                        onChange={(e) => { setQuantity(e.target.value) }}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                    >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    placeholder="Enter delivery location"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                {errorMsg && <p className='text-red-500'>{errorMsg}</p>}

                <button
                    onClick={handlePlaceOrder}
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default OrderPage;
