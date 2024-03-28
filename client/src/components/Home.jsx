import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/');
            console.log(response.data);
            setData(response.data.posts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        try {
            const response = await axios.get('http://localhost:3000/users');
            console.log(response.data);
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/', { text });
            setText('');
            fetchData();
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="posts-container">
                <h2 className='text-xl font-bold'>Posts:</h2>
                <ul>
                    {data.map((post, index) => (
                        <li key={index}>{post.text}</li>
                    ))}
                </ul>
            </div>
            <div className="posts-container">
                <h2 className='text-xl font-bold'>Users:</h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.name}</li>
                    ))}
                </ul>
            </div>
            <div className="w-screen h-screen bg-red-200 flex items-center justify-center">
                <form onSubmit={handleSubmit}>
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className='pl-1'
                        type="text"
                        name="text"
                        id="text"
                        placeholder='Enter name here'
                    />
                    <button className='bg-blue-500 rounded' type="submit">Submit</button>
                    <Link to={'/signup'}>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Home;
