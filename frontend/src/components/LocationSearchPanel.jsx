import React from 'react'

const LocationSearchPanel = (props) => {

    //sample array for location
    const locations = [
        "221B, Baker's Street, Park Avenue, London, UK",
        "Avengers Tower, Manhatton, New York, USA",
        "Block-B, Gokuldham Society, Andheri, Mumbai",
        "Wayne Mansion, Square Park, Gotham, USA"
    ]
  return (
    <div>
        {
            locations.map(function(elem, idx){
                return  <div key={idx} onClick={()=>{
                    props.setVehiclePanel(true)
                    props.setPanelOpen(false)
                }} className='flex mt-0 my-4  border-2 active:border-yellow-400 p-3 rounded-xl  items-center justify-start gap-4'>
                <h2 className='bg-gray-700 h-8 w-8 flex items-center justify-center rounded-full'><i className='ri-map-pin-fill text-xl text-yellow-500'></i></h2>
                <h4 className='text-lg font-medium'>{elem}</h4>
            </div>
            })
        }

       
    </div>
  )
}

export default LocationSearchPanel