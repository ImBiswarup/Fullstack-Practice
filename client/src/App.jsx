import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import FileUploading from './components/FileUploading';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/signup' element={<Signup />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/file-uploading' element={<FileUploading />} />
    </Routes>
  );
}

export default App;
