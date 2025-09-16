import React from 'react'
import App from '../../App'
import useUserDistances from '../../hooks/useUserDistances'

const PathFinder = () => {
  const { getDisplayDistance, totalUsers, distances, isLoading, error, hasConnections } = useUserDistances();

  return (
    <div className='h-screen w-screen relative'>
      <App wd="100vw" ht="100vh" isPathFinder={true}/>
      
      {/* Distance Info Overlay */}
      <div className="absolute top-14 right-1 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg z-50">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Connected Users</h3>
        <div className="text-sm text-gray-600 ">
          <p><strong>Total Users:</strong> {isLoading ? '...' : totalUsers}</p>
          <p><strong>Distance:</strong> {getDisplayDistance()}</p>
          <p><strong>Status:</strong> {isLoading ? 'Loading...' : error ? 'Error' : hasConnections ? 'Connected' : 'No connections'}</p>
          {error && (
            <p className="text-red-500 text-xs mt-1">
              Error: {error}
            </p>
          )}
          {isLoading && (
            <p className="text-blue-500 text-xs mt-1">
              Loading distances...
            </p>
          )}
          {!isLoading && !error && distances.length > 0 && (
            <div className="mt-2">
              <p className="font-semibold">User Distances:</p>
              {distances.map((dist, index) => (
                <p key={index} className="text-xs">
                  {dist.user1.slice(0, 8)} ↔ {dist.user2.slice(0, 8)}: {dist.distance} km
                </p>
              ))}
            </div>
          )}
          {!isLoading && !error && distances.length === 0 && totalUsers > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {totalUsers === 1 ? 'Single user - no distances to calculate' : 'Calculating distances...'}
            </p>
          )}
          {!isLoading && !error && totalUsers === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              No users connected
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PathFinder
