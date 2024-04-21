import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';


const Home = () => {
    const [data, setData] = useState([]);
    const [text, setText] = useState('');
    const [users, setUsers] = useState([]);
    const [images, setImages] = useState([]);


    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/');
            setData(response.data.posts);
            setUsers(response.data.users);
            setImages(response.data.images);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const textResponse = await axios.post('http://localhost:3000/upload', { text }, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`
                }
            });
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
                        <li key={index}>{post.text} - {post.createdBy}</li>
                    ))}
                </ul>
            </div>

            {users.length >= 1 && (
                <div className="posts-container">
                    <h2 className='text-xl font-bold'>Users:</h2>
                    <ul>
                        {users.map((user, index) => (
                            <li key={index}>{user.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <h1>Images</h1>
            {images.map((image, index) => (
                <img key={index} src={image.imageUrl} alt={`Image ${index}`} />
            ))}
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
                    <Link className='ml-5' to={'/file-uploading'}>Upload files</Link>
                    <Link className='ml-5' to={'/user/order'}>Order here</Link>
                    <Link className='ml-5' to={'/admin/order'}>Order Admin</Link>
                </form>
            </div>
        </div>
    );
}

export default Home;
