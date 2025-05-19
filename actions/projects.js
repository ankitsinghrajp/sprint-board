"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

export async function createProject(data){
    const {userId,orgId} = await auth();
    const apiKey = process.env.CLERK_SECRET_KEY;
    
    if(!userId){
        throw new Error("Unautorized!");
    }
    if(!orgId){
        throw new Error("No Organization Selected!");
    }

    const membershipResponse = await fetch(
        `https://api.clerk.dev/v1/organizations/${orgId}/memberships`,
        {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!membershipResponse.ok) {
        throw new Error(`Failed to fetch organization memberships. Error: ${membershipResponse.status}`);
    }
    
    const membershipData = await membershipResponse.json();

    if(!membershipData || !membershipData.role === 'org:admin'){
        throw new Error("Only Organization admins can create project!");
    }

    try {
      
        const project = await db.project.create({
            data:{
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,

            }
        });

        return project;
        
    } catch (error) {
        throw new Error("Error creating project! Server is busy."+error.message);
    }
}


export async function deleteProject(projectId) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true };
}


export async function getProject(projectId){
    
      const {userId,orgId} = await auth();

      if(!userId || !orgId){
         throw new Error("Unauthorized!");
      }

      const user = await db.user.findUnique({
        where:{
          clerkUserId: userId,
        },
      })

      if(!user){
        throw new Error("User not found!");
      }

      const project = await db.project.findUnique({
          where:{id: projectId},
          include:{
            sprints:{
              orderBy:{createdAt: "desc"}
            }
          }
      })

      if(!project){
        throw new Error("Project not found!");
      }
    
      //Verify project belongs to the organization
      if(project.organizationId !== orgId){
         throw new Error("Unauthorized! Project does not belong to your organization.");
      }

      return project;
}