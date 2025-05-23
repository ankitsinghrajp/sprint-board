"use client"
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import  { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useFetch from '@/hooks/use-fetch';
import { updateSprintStatus } from '@/actions/sprint';
import { BarLoader } from 'react-spinners';


const SprintManager = ({sprint,setSprint,sprints,projectId}) => {

    const [status,setStatus] = useState(sprint.status);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();


    const canStart = isBefore(now,endDate) && isAfter(now,startDate) && status ==="PLANNED";
    const canEnd = status ==="ACTIVE";

    const {
      fn: updateStatus,
      loading,
      data: updatedStatus,

    } = useFetch(updateSprintStatus);

    const handleStatusChange = async (newStatus)=>{
        updateStatus(sprint.id,newStatus);
        
    }

    useEffect(()=>{

      if(updatedStatus && updatedStatus.success){
          setStatus(updatedStatus.sprint.status);
          setSprint({
          ...sprint,
          status: updatedStatus.sprint.status,
        })
      }
       
    },[updatedStatus,loading])

    const handleSprintChange = (value)=>{
      const selectedSprint = sprints.find((s)=>s.id === value);
      setSprint(selectedSprint);
      setStatus(selectedSprint.status);
    }

    const getStatusText = ()=>{
          if(status === "COMPLETED"){
            return "Sprint Ended";
          }
          if(status === "ACTIVE" && isAfter(now,endDate)){
            return `Overdue by ${formatDistanceToNow(endDate)}`;
          }
          if(status === "PLANNED" && isBefore(now,startDate)){
            return `Sprint Starts in ${formatDistanceToNow(startDate)}`;
          }
          return null;
    }
  return (
    <>
    <div className='flex md:justify-between justify-center md:flex-row flex-col mr-4 md:items-center gap-4'>
     <Select className="" value={sprint?.id} onValueChange={handleSprintChange}>
  <SelectTrigger className="dark:bg-[#09090b] w-full ml-2 font-bold self-start bg-white">
    <SelectValue placeholder="Select Sprint" />
  </SelectTrigger>
  <SelectContent>
    {sprints.map((sprint)=>{

   return <SelectItem key={sprint.id} value={sprint.id} >
    {sprint.name} ({format(sprint.startDate,"MMM d, yyyy")}) to {" "}
    ({format(sprint.endDate,"MMM d, yyyy")})
   </SelectItem>

    })}
  
  </SelectContent>
</Select>

{canStart && (
  <Button className={'bg-green-900 mx-4 text-white'}
    onClick = {()=>handleStatusChange("ACTIVE")}
    disabled={loading}
  >Start Sprint</Button>
)}
{canEnd && (
  <Button variant={'destructive'}
  onClick ={()=>handleStatusChange("COMPLETED")}
  disabled={loading}
  >End Sprint</Button>
)}
    
    </div>

    {loading && <BarLoader width={'100%'} className='mt-2 px-5' color='#36d7b7'/>}
     {getStatusText() && (
      <Badge className='ml-3 mt-2 self-start'>
      {getStatusText()}
      </Badge>
    )}

    </>
  )
}

export default SprintManager