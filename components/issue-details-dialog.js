"use client"
import { usePathname } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { deleteIssue, updateIssue } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import statuses from "@/data/status"
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";

const priorityOptions = ["LOW","MEDIUM", "HIGH", "URGENT"];


const IssueDetailsDialog = ({
    isOpen,
    onClose,
    issue,
    onDelete = () =>{},
    onUpdate = () =>{},
    borderCol = "",
}) => {

  const [status,setStatus] = useState(issue.status);
  const [priority,setPriority] = useState(issue.priority);

  const {user} = useUser();
  const {membership} = useOrganization();

  const pathname = usePathname();
  const router = useRouter();

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);


  const canChange = user.id === issue.reporter.clerkUserId || membership.role === "org:admin";




  const isProjectPage = pathname.startsWith("/projects/");

  const handleGoToProject = ()=>{
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);

  }

  const handleStatusChange = async(newStatus) =>{
    setStatus(newStatus);
    updateIssueFn(issue.id,{status: newStatus, priority})

  }
  const handlePriorityChange = async(newPriority) =>{
    setPriority(newPriority);
    updateIssueFn(issue.id,{status, priority: newPriority});

  }

  const handleDelete = async () =>{

    if(window.confirm("Are you sure you want to delete this issue?")){
        deleteIssueFn(issue.id);
    }

  };

  useEffect(() =>{
    if(deleted){
      onDelete();
      onClose();
    }

    if(updated){
      onUpdate(updated);

    }
  },[deleted, updated, deleteLoading, updateLoading]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
 
  <DialogContent className={'dark:bg-black bg-[#e0f2ff]'}>
    <DialogHeader>
        <div className="flex justify-between items-center">
      <DialogTitle className={'text-3xl'}>{issue.title}</DialogTitle>
   </div>
   {!isProjectPage && (
    <Button
    variant={'ghost'}
    size={'icon'}
    onClick={handleGoToProject}
    title="Go to project"
    >
      <ExternalLink className="h-4 w-4"/>
    </Button>
   )}
    </DialogHeader>
    {(updateLoading || deleteLoading) && (
      <BarLoader width={'100%'} color="#36d7b7" />
    )}

    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select value={status} onValueChange = {handleStatusChange}>
  <SelectTrigger className="w-full border-2 dark:border-gray-400 border-gray-700">
    <SelectValue placeholder="Status" />
  </SelectTrigger>
  <SelectContent>
    {statuses.map((status)=>(
       <SelectItem key={status.key} value={status.key}>{status.name}</SelectItem>

    ))}
   

  </SelectContent>
</Select>
        <Select value={priority} onValueChange = {handlePriorityChange} disabled={!canChange}>
  <SelectTrigger className={`w-full border-2 ${borderCol} `}>
    <SelectValue placeholder="Priority" />
  </SelectTrigger>
  <SelectContent>
    {priorityOptions.map((option)=>(
       <SelectItem key={option} value={option}>{option}</SelectItem>

    ))}
   

  </SelectContent>
</Select>

      </div>
    </div>
    <div>
    <h4 className="font-sembold text-sm mb-2 ml-1">Description</h4>
    <MDEditor.Markdown
      className="rounded px-2 py-1" 
      source={issue.description? issue.description : "--"}
    />
    </div>
    <div className="flex justify-between">
      <div className="flex flex-col gap-2">
        <h4 className="font-semibold">
          Assignee
        </h4>
        <UserAvatar user={issue.assignee} />
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="font-semibold">Reporter</h4>
        <UserAvatar user ={issue.reporter} />
      </div>
    </div>
    {canChange && (
      <Button
        onClick={handleDelete}
        disabled={deleteLoading}
        variant={"destructive"}
      >
        {deleteLoading ? "Deleting..." :"Delete Issue"}

      </Button>
    )}
    {(deleteError || updateError ) && (
      <p className="text-red-500 text-center text-sm font-semibold">{deleteError?.message || updateError?.message}</p>
    )}
  </DialogContent>
</Dialog>

  )
}

export default IssueDetailsDialog