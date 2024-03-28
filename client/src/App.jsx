import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home';
import Signup from './Signup';
import Login from './components/Login';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/signup' element={<Signup />} />
      <Route exact path='/login' element={<Login />} />
    </Routes>
  );
}

export default App;
