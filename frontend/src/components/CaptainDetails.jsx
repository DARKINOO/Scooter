import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext)

    if (!captain) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹295.20</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-yellow-300 rounded-xl justify-center gap-12 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>3.2 hr</h5>
                    <p className='text-sm text-gray-600'>Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>20.5 Km</h5>
                    <p className='text-sm text-gray-600'>Travel</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-star-line"></i>
                    <h5 className='text-lg font-medium'>4.3</h5>
                    <p className='text-sm text-gray-600'>Rating</p>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails