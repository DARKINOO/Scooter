import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
         <h5 onClick={()=>{
          props.setVehiclePanel(false)
        }} className='p-1 w-[93%] text-center absolute top-0'><i className='ri-arrow-down-wide-line text-3xl text-gray-400'></i></h5>
        <h3 className='text-2xl font-bold mb-5'>Choose Your Vehicle</h3>
        <div onClick={()=>{
            props.setConfirmRidePanel(true)
        }} className='flex border-2 bg-white active:border-yellow-700 mb-2 rounded-xl p-3 w-full items-center justify-between'>
          <img className='h-16' src="https://static.vecteezy.com/system/resources/previews/029/915/296/original/white-city-car-isolated-on-transparent-background-3d-rendering-illustration-free-png.png" alt="" />
          <div className='w-1/2'>
            <h4 className='font-medium text-lg'>Safari <span><i className='ri-user-3-fill'></i>4</span></h4>
            <h5 className='font-medium text-sm'>6 mins away</h5>
            <p className='font-medium text-xs text-gray-600'>Affordable rides</p>
          </div>
          <h2 className='text-2xl font-semibold'>₹210.2</h2>
        </div>
        <div onClick={()=>{
            props.setConfirmRidePanel(true)
        }} className='flex border-2 bg-white  active:border-yellow-700 mb-2 rounded-xl p-3 w-full items-center justify-between'>
          <img className='h-12' src="https://clipart-library.com/2023/Uber_Auto_312x208_pixels_Mobile.png" alt="" />
          <div className='w-1/2'>
            <h4 className='font-medium text-lg'>Auto <span><i className='ri-user-3-fill'></i>3</span></h4>
            <h5 className='font-medium text-sm'>5 mins away</h5>
            <p className='font-medium text-xs text-gray-600'>Safe rides</p>
          </div>
          <h2 className='text-2xl font-semibold'>₹134.2</h2>
        </div>
        <div onClick={()=>{
            props.setConfirmRidePanel(true)
        }} className='flex border-2 bg-white  active:border-yellow-700 mb-2 rounded-xl p-3 w-full items-center justify-between'>
          <img className='h-12' src="https://th.bing.com/th/id/OIP.znY96OhfmQ9RecEw45FS_AHaE7?pid=ImgDet&w=178&h=118&c=7&dpr=1.5" alt="" />
          <div className='w-1/2'>
            <h4 className='font-medium text-lg'>Motorbike <span><i className='ri-user-3-fill'></i>1</span></h4>
            <h5 className='font-medium text-sm'>2 mins away</h5>
            <p className='font-medium text-xs text-gray-600'>fast and thrill</p>
          </div>
          <h2 className='text-2xl font-semibold'>₹90.6</h2>
        </div>
    </div>
  )
}

export default VehiclePanel