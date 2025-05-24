import { formatDistanceToNow } from "date-fns"
import { Badge } from "./ui/badge"
import UserAvatar from "./user-avatar"
import { useState } from "react"
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./issue-details-dialog";

const { Card, CardHeader, CardTitle, CardContent, CardFooter } = require("./ui/card");


const priorityColor = {
    LOW: "border-green-600",
    MEDIUM: "border-yellow-400",
    HIGH: "border-orange-500",
    URGENT: "border-red-500",

}
const IssueCard = ({issue,
    showStatus = false,
    onDelete = () => {},
    onUpdate = () => {},
}) => {

    const [isDialogOpen,setIsDialogOpen] = useState(false);
    const router = useRouter();

    const onDeleteHandler = (...params)=>{
      router.refresh();
      onDelete(...params);
    }

    const onUpdateHandler = (...params)=>{
      router.refresh();
      onUpdate(...params);
    }


    const created = formatDistanceToNow(new Date(issue.createdAt),{
        addSuffix: true,
    })
  return (
    <>
       <Card className={`dark:bg-[#09090b] hover:shadow-md transition-shadow bg-[#e0f2ff] border-b-0 border-l-0 border-r-0 border-t-3 ${priorityColor[issue.priority]} rounded-lg`}
       onClick={() => setIsDialogOpen(true)}>
  <CardHeader className={``}>
    <CardTitle>{issue.title}</CardTitle>
      </CardHeader>
  <CardContent className={'flex gap-2 -mt-3'}>
    {showStatus && <Badge>{issue.status}</Badge>}
    <Badge variant={'outline'} className={'-ml-1 '}>{issue.priority}</Badge>
  </CardContent>
  <CardFooter className={'flex flex-col items-center justify-between'}>
   <UserAvatar user = {issue.assignee}/>
   
  </CardFooter>
  <div className="text-xs ml-8 dark:text-gray-500 font-semibold text-gray-700">Created {created}</div>
</Card>
   
   {isDialogOpen && <IssueDetailsDialog
    isOpen={isDialogOpen}
    onClose={() => setIsDialogOpen(false)}
    issue={issue}
    onDelete={onDeleteHandler}
    onUpdate={onUpdateHandler}
    borderColor = {priorityColor[issue.priority]}
    />}
    </>
  )
}

export default IssueCard