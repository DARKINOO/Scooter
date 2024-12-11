import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Captainsignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [CaptainData, setCaptainData] = useState({})

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullName: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')

  }
  return (
    <div className='pt-5 p-7 h-screen flex flex-col justify-between'>
    <div>
    <h1 className='w-14 mb-8 text-3xl font-bold text-black'>Goसफ़र</h1>
    <form onSubmit={(e)=>{
        submitHandler(e)
    }}>
         <h3 className='text-lg w-1/2  font-medium mb-2'>What's your name</h3>
            <div className='flex gap-4 mb-7'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2  rounded-lg px-4 py-2 border  text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />

            <button
              className='bg-yellow-400 text-black font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Create account</button>

          </form>
          <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
        </div>
        <div>
        <img className='ml-12 w-56' src="https://img.freepik.com/premium-vector/call-center-man-young-taxi-service_24877-10830.jpg?uid=R110055710&ga=GA1.1.259657936.1733899461&semt=ais_hybrid" alt="" />
          <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
        </div>
</div>
  )
}

export default Captainsignup