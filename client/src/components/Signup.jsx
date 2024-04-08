import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const Signup = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signup', { name, email, password });
            console.log(response.data)
            toast.success(response.data.msg);

            Cookies.set('token', response.data.token);
        } catch (error) {
            console.log(error);
            toast.error(error.response.error.msg);
        }
    }

    return (
        <div className="container bg-red-500">
            <form className='felx flex-col items-center justify-center bg-blue-400 text-black w-screen h-screen' action="/signup" method="post" encType='multipart/formdata'>
                <div className="input flex flex-col items-center justify-center text-center">
                    <input type="text" name="name" id="name" placeholder='name' onChange={(e) => setName(e.target.value)} />
                    <input type="email" name='email' id='email' placeholder='email' onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" name='password' id='password' placeholder='password' onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleCreateAccount} type="submit">Sign up</button>
                <button className='m-10' onClick={(e) => { Cookies.remove('token') }} type="submit">Log out</button>
                <Link className='text-center bg-green-500 m-10' to='/login'>
                    Log in
                </Link>
                <Link to={'/'}>Homepage</Link>
            </form>

        </div>
    )
}

export default Signup