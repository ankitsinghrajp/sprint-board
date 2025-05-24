import { getUserIssues } from '@/actions/issues';
import IssueCard from '@/components/issue-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { Suspense } from 'react'

const UserIssues = async ({userId}) => {

    const issues = await getUserIssues(userId);

    if(issues.length === 0){
        return null;
    }

    const assignedIssues = issues.filter(
        (issue)=>issue.assignee.clerkUserId === userId
    );

    const reportedIssues = issues.filter(
        (issue)=>issue.reporter.clerkUserId === userId
    );

  return (
    <>
    <h1 className='text-4xl font-bold gradient-title ml-5 mb-4'>My Issues</h1>
    <Tabs defaultValue="assigned" className="w-full mb-4 bg-gray-200 dark:bg-black rounded-md mx-3 px-4 py-4">
  <TabsList className={'w-full mt-2 bg-gray-400 dark:bg-[#09090b]'}>
    <TabsTrigger value="assigned">Assign To You</TabsTrigger>
    <TabsTrigger value="reported">Reported By You</TabsTrigger>
  </TabsList>
  <TabsContent className={'py-10 px-5'} value="assigned">
    <Suspense fallback={
        <div>Loading...</div>
    }>
       <IssueGrid issues={assignedIssues}/>
    </Suspense>
  </TabsContent>
  <TabsContent className={'py-10 px-5'} value="reported">  <Suspense fallback={
        <div>Loading...</div>
    }>
       <IssueGrid issues={reportedIssues}/>
    </Suspense></TabsContent>
</Tabs>
</>
  )
};

function IssueGrid ({issues}){
     return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {issues.map((issue)=>(
               <IssueCard key={issue.id} issue={issue} showStatus/>
            ))}
        </div>
     )
}

export default UserIssues