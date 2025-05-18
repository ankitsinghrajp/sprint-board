import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='mt-28 container mx-auto'>
        <div className='flex justify-center items-center mb-5'>
          {children}
        </div>
        </div>
  )
}

export default AuthLayout