import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userData, setUserData] = useState({})
  
  const { user,setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e)=>{
   e.preventDefault();
   
   const userData ={
    email:email,
    password:password
   }

  const response = await axios.post(`${import.meta.env.VITE_BASE_URL_AUTH}/users/login`, userData)

  if(response.status === 200){
    console.log(response.data);

    const data = response.data
    setUser(data.user)
    localStorage.setItem('token', data.token)
    navigate('/home')
  }
  
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
            
            <button type="submit" className='flex items-center justify-center w-full bg-yellow-400 text-black font-bold text-xl py-3 rounded mt-5 placeholder:text-base'>Login</button>
        </form>
        <p className='text-center mt-4'>New here?<Link to='/signup' className='text-blue-600'>Create New Account</Link></p> 
        </div>
        <div className='mb-9'>
          <img className='ml-12 w-56' src="https://img.freepik.com/free-vector/taxi-app-concept_23-2148491009.jpg?uid=R110055710&ga=GA1.1.259657936.1733899461&semt=ais_hybrid" alt="" />
        <Link to='/captain-login' className='flex items-center justify-center w-full bg-orange-400 text-black font-bold text-xl py-3 rounded mt-5'>Log in as Captain</Link>
        </div>
    </div>
  )
}

export default UserLogin