import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import FileUploading from './components/FileUploading';
// import Order_User from './components/Order_User';
import Order_Admin from './components/Order_Admin';
import OrderPage from './components/OrderPage';
import OrderDetails from './components/OrderDetails';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Home />} />
      <Route exact path='/signup' element={<Signup />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/file-uploading' element={<FileUploading />} />
      {/* <Route exact path='/order' element={<OrderPage />} /> */}
      <Route exact path='/admin/order' element={<Order_Admin />} />
      <Route exact path='/user/order' element={<OrderPage />} />
      <Route exact path='/orders/:orderId' element={<OrderDetails />} />
    </Routes>
  );
}

export default App;
