
import { getProjects } from '@/actions/organization'
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Link from 'next/link';
import React from 'react'
import DeleteProject from './delete-project';
// import { useTheme } from 'next-themes';

const ProjectList = async ({orgId}) => {

    // const { theme, setTheme, systemTheme } = useTheme();

    const projects = await getProjects(orgId);

   
    if(projects.length === 0){
        return<div>
               No Projects Found{" "}
               <Link href={'/project/create'} className='text-blue-500 underline'>
                Create new project
               </Link>
        </div>
    }

    return <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mx-5'>
        {projects.map((project)=>{
            return <Card className={'dark:bg-black'} key={project.id}>
  <CardHeader>
    <CardTitle className={'flex text-xl justify-between items-center'}>{project.name}
        <DeleteProject projectId={project.id}/>
    </CardTitle>
  </CardHeader>
  <CardContent className={'flex flex-col'}>
    <p className='text-sm text-gray-600 dark:text-gray-300 h-20 overflow-hidden text-ellipsis whitespace-pre-line break-words line-clamp-3'>{project.description}</p>
    <Link className='py-2' href={`/project/${project.id}`}>
    <Button className={'w-full dark:bg-gray-900 cursor-pointer font-semibold text-gray-300'}>View Project</Button>
    </Link>
  </CardContent>

</Card>

        })}
    </div>
}

export default ProjectList