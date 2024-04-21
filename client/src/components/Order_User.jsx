import React, { useState } from 'react'

const Order_User = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('user')
  return (
    <div className='flex-col flex items-center justify-center'>
      <div className="text-center mt-5 flex-col flex items-center justify-center gap-y-5">
        <input onChange={(e) => { setName(e.target.value) }} type="text" placeholder='name' name='name' required />
        <input onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder='email' name='email' required />
        <select onChange={(e) => { setType(e.target.value) }} className='w-48' name="type" id="type" required>
          <option value="user">User</option>
          <option value="delivery man">Delivery Man</option>
        </select>
        <button onClick={() => { type === 'user' ? window.location.href = '/user/order' : window.location.href = '/admin/order' }}>submit</button>
      </div>
    </div>
  )
}

export default Order_User