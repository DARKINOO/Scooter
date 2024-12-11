import React, { useState } from 'react'
import { Link } from 'react-router-dom';
 
const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captainData, setCaptainData] = useState({})

  const submitHandler =(e)=>{
   e.preventDefault();
   setCaptainData({
    email:email,
    password:password
   })
   console.log(captainData);
   setEmail('')
   setPassword('')
  }
  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
        <h1 className='w-14 mb-8 text-3xl font-bold text-black'>Goसफ़र</h1>
        <form onSubmit={(e)=>{
            submitHandler(e)
        }}>
            <h3 className='text-xl mb-2'>What's your email</h3>
            
            <input
             required 
             value={email}
             onChange={(e)=>{
                setEmail(e.target.value);
             }}
             className='bg-[#eeeeee] rounded px-4 py-2 mb-7 border w-full text-lg placeholder:text-base'
             type="email" placeholder='email@example.com'
            />
            
            <h3 className='text-xl mb-2'>Enter Password</h3>
            <input className='bg-[#eeeeee] rounded px-4 py-2 mb-7 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e)=>{
                setPassword(e.target.value);
             }}
            required type="password" placeholder='password'/>
            
            <button className='flex items-center justify-center w-full bg-yellow-400 text-black font-bold text-xl py-3 rounded mt-5'>Login</button>
        </form>
        <p className='text-center mt-4'>Join our revolution?
            <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p> 
        </div>
        <div className='mb-9'>
        <img className='ml-16 w-44 h-50' src="https://img.freepik.com/premium-vector/call-center-man-young-taxi-service_24877-10830.jpg?uid=R110055710&ga=GA1.1.259657936.1733899461&semt=ais_hybrid" alt="" />
        <Link to='/login' className='flex items-center justify-center w-full bg-pink-400 text-black font-bold text-xl py-3 rounded mt-5'>Log in as User</Link>
        </div>
    </div>
  )
}

export default CaptainLogin