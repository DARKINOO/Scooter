import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1656725361582-b05ef3906f2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHllbGxvdyUyMHNjb290ZXJ8ZW58MHx8MHx8fDA%3D)] h-screen pt-8 flex justify-between flex-col w-full">
            <h1 className='w-14 ml-8 text-3xl font-bold text-white'>Goसफ़र</h1>
            <div className='bg-white py-5 px-6'>
                <h2 className='text-3xl font-bold'>Get Started with Goसफ़र </h2>
                <Link to='/login' className='flex items-center justify-center w-full bg-yellow-400 text-black font-bold text-lg py-3 rounded mt-5'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Home