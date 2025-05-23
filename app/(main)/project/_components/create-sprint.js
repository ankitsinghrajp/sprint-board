"use client"

import { createSprint } from '@/actions/sprint';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverTrigger,PopoverContent } from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDays, format } from 'date-fns';
import {  CalendarIcon, ChevronDown, X } from 'lucide-react';
import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker';
import { Controller, useForm } from 'react-hook-form';
import 'react-day-picker/dist/style.css'
import useFetch from '@/hooks/use-fetch';
import { toast } from 'sonner';
import {useRouter} from 'next/navigation';
import { sprintSchema } from '@/app/lib/validators';

const SprintCreationForm = ({
    projectTitle,
    projectKey,
    projectId,
    sprintKey,
}) => {

    const [showForm, setShowForm] = useState(false);
    //installing the package date-fns & react-day-picker
    const[dateRange,setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(),14),
    })

    const router = useRouter();
    const{register, handleSubmit,formState:{errors},control} = useForm({
        resolver:zodResolver(sprintSchema),
        defaultValues:{
            name:`${projectKey}-${sprintKey}`,
            startDate: dateRange.from,
            endDate: dateRange.to,
        }
    })

    const {
     loading: createSprintLoading,fn:createSprintFn
    } = useFetch(createSprint)

    const onsubmit = async(data)=>{
         await createSprintFn(projectId,{
              ...data,
              startDate: dateRange.from,
              endDate: dateRange.to,
         });
         setShowForm(false);
         toast.success("sprint created successfully!");
         router.refresh();
    }
  return (
    <> 
    <div className='flex md:justify-between md:flex-row flex-col'>
        <h1 className='text-4xl md:mb-8 gradient-title md:text-5xl font-extrabold bg-gradient-to-br from-gray-900 via-slate-600 to-gray-900 dark:from-blue-500 dark:via-blue-100 dark:to-blue-400 bg-clip-text tracking-tighter text-transparent  pr-2 pb-5'> {projectTitle}</h1>
        <Button className={'cursor-pointer mx-10 mt-2 mb-2 font-semibold dark:text-gray-950'} onClick={()=>setShowForm(!showForm)} variant={showForm?"destructive":"default"}>{showForm?<>Cancel Sprint Creation <X className='h-5 w-5'/></>:<>Create New Sprint <ChevronDown className='h-5 w-5'/></>}</Button>
    </div>

    {showForm && (
       <Card className={'pt-4 mb-4 border-2 border-gray-600 dark:border-gray-400 mx-4 mt-5 dark:bg-[#09090b]'}>
          <CardContent className={'px-3 '}>
            <form className='' onSubmit={handleSubmit(onsubmit)}>
                <div className='flex gap-4 items-end'>
               <div className='flex-1'>
                <label className='block text-sm font-bold ml-2 mb-2' htmlFor='name'>Sprint Name <span className='text-gray-600 dark:text-gray-400'>(Read Only)</span></label>
                <Input 
                className={'cursor-not-allowed border border-gray-500'}
                id="name"
                readOnly
                {...register("name")}
                />
                {errors.name && <span className='text-sm ml-2 mt-1 text-red-500'>{errors?.name?.message}</span>}
               </div>

               {/* React day picker component  */}

               <div className='flex-1'>
                <label className='block text-sm font-bold ml-2 mb-2' htmlFor="">Sprint Duration</label>
                <Controller 
                control={control}
                name='dateRange'
                render={({field})=>{
                    return <Popover>
                        <PopoverTrigger asChild>
                            <Button className={`border border-gray-500 w-full justify-start text-left font-normal ${!dateRange && 'text-muted-foreground'}`} variant={'outline'}>

                                <CalendarIcon className='mr-2 h-4 w-4'/>
                                 {dateRange.from && dateRange.to?(
                                    format(dateRange.from,"LLL dd, y")+" - "+format(dateRange.to,"LLL dd, y")
                                 ):(<div>
                                    Pick a date
                                 </div>)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className={'w-auto '}
                        align='start'>
                            <DayPicker
                            mode='range'
                            selected={dateRange}
                            onSelect={(range)=>{
                               if(range?.from && range.to){
                                   setDateRange(range);
                                   field.onChange(range);
                               }
                            }}
                            classNames={{
                                chevron: "fill-blue-500",
                                range_start: "bg-blue-700",
                                range_end: "bg-blue-700",
                                range_middle: "bg-blue-400",
                                day_button: "border-none",
                                today: "border-2 border-blue-700"

                            }}
                            />
                        </PopoverContent>
                    </Popover>
                }}
                />
               </div>
               </div>
               <div className='flex justify-center items-center mt-4'>
               <Button className={'md:w-1/2 border-1 border-gray-800 w-full'} type="submit" disabled={createSprintLoading}>{createSprintLoading?"Creating...":"Create Sprint"}</Button>
               </div>
            </form>
          </CardContent>
       </Card>
    )}
    </>
  )
}

export default SprintCreationForm