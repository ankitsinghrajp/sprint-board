import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";


const page = async ({params}) => {
    const {projectId} = await params;
    
    const project = await getProject(projectId);
    if(!project){
       notFound();
    }
  return (
    <div className="container mx-auto">
        
        {/* {Sprint Creation} */}
        <SprintCreationForm
          projectTitle = {project.name}
          projectId = {projectId}
          projectKey = {project.key}
          sprintKey = {project.sprints?.length + 1}
        />

        {/* {Sprint Board} */}
        {project.sprints.length > 0? (
        <></>
        ):<div>
          Create a Sprint from button above
          </div>}
    </div>
  )
}

export default page