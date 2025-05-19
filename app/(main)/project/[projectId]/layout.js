import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const projectLayout = async ({children}) => {
  return (
    <div className='mx-auto py-5'>
        <Suspense fallback={<div className='flex flex-col gap-5'>
            <BarLoader width={"100%"} color='#36d7b7'/>
        <span>Loading Project...</span>
        </div>}>
        {children}
        </Suspense>
        </div>
  )
}

export default projectLayout