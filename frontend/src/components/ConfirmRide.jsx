import React, { useState } from 'react';

const ConfirmRide = ({ setConfirmRidePanel, setVehicleFound, vehicleType, pickup, destination, fare, createRide }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleConfirmRide = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check if user is authenticated
            const token = localStorage.getItem('token'); // or however you store your auth token
            if (!token) {
                throw new Error('Please login to book a ride');
            }

            console.log('Confirming ride with:', { vehicleType, pickup, destination });
            await createRide();
            setVehicleFound(true);
            setConfirmRidePanel(false);
        } catch (error) {
            console.error('Error creating ride:', error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || 'Failed to create ride');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5 ml-20'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center mb-1 gap-5 p-3 bg-gray-50 border-b-2 rounded-md'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{pickup}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>pickup</p>
                        </div>
                    </div>
                    <div className='flex items-center mb-1 gap-5 p-3 bg-gray-50 border-b-2 rounded-md'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{destination}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>destination</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 bg-gray-50 border-b-2 rounded-md'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{fare?.[vehicleType]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="w-full p-3 text-red-500 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <button 
                    onClick={handleConfirmRide}
                    disabled={isLoading}
                    className={`w-full mt-5 bg-black text-xl text-yellow-500 font-bold p-2 rounded-lg ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isLoading ? 'Creating Ride...' : 'Confirm'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmRide;