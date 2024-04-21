import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { email, password });
            console.log(response.data);
            toast.success(`Welcome ${response.data.user.name}`);
            
            // Set the 'token' cookie with the received token
            Cookies.set('token', response.data.token, { expires: 7 }); // Expires in 7 days
            
            // Optionally, redirect to another page after successful login
            // window.location.href = '/';
        } catch (error) {
            console.error(error.response.data);
            toast.error(error.response.data.msg);
        }
    };

    return (
        <div className="container bg-red-500">
            <form className='felx flex-col items-center justify-center bg-blue-400 text-black w-screen h-screen' action="/login" method="post" encType='multipart/formdata'>
                <div className="input flex flex-col items-center justify-center text-center">
                    <input type="email" name='email' id='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name='password' id='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleLogin} type="submit">Log in</button>
                <Link className='m-10' to={'/'}>Homepage</Link>
            </form>
        </div>
    )
}

export default Login