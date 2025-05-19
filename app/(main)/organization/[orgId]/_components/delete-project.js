"use client"
import { deleteProject } from '@/actions/projects'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { useOrganization } from '@clerk/nextjs'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

const DeleteProject = ({projectId}) => {

    const {
        data: deleted,
        loading,
        error,
        fn: deleteProjectFn
    } = useFetch(deleteProject);
    
    const {membership} = useOrganization();
    const router = useRouter();

 
    const handleClick = async ()=>{
        if(window.confirm("Are you sure you want to delete this project?")){
             await deleteProjectFn(projectId);
        }

    }

    const isAdmin = membership?.role === "org:admin";


    useEffect(()=>{
       
        if(deleted?.success){
            toast.success("Project deleted successfully...");
             router.refresh();
        }

    },[deleted])

            
      if(!isAdmin) return null;

  return <div className=''><Button disabled={loading} onClick={handleClick} className={loading?"animate-pulse":'cursor-pointer'} size={'sm'} variant={'destructive'}><Trash2 className='h-5 w-5 text-white'/></Button>
 
  </div>
}

export default DeleteProject