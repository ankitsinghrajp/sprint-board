"use client"
import { OrganizationSwitcher, SignedIn, useOrganization, useUser } from '@clerk/nextjs'
import React from 'react'
import { usePathname } from 'next/navigation'
const OrgSwitcher = () => {
    const {isLoaded} = useOrganization();
    const {isLoaded:isUserLoaded} = useUser();
    const pathname = usePathname();
    if(!isLoaded || !isUserLoaded){
        return null;
    }
  return (

    <div className='border border-gray-300 rounded-md px-2 pt-1 bg-gray-800 dark:bg-black'>
        <SignedIn>
            <OrganizationSwitcher 
            hidePersonal
            afterCreateOrganizationUrl={"/organization/:slug"}
            afterSelectOrganizationUrl={"/organization/:slug"}
            createOrganizationMode={
                pathname === '/onboarding'?"navigation":"modal"
            }

            createOrganizationUrl="/onboarding"
            appearance={
                {
                    elements: {
                        organizationSwitcherTrigger: "border border-gray-300 rounded-md px-5 py-2",
                        organizationSwitcherTriggerIcon: "text-white"
                    }
                }

            }

            />
        </SignedIn>
    </div>
  )
}

export default OrgSwitcher