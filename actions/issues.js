"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data){
    const {userId,orgId} = await auth();

    if(!userId || !orgId){
        throw new Error("Unauthorized!");
    }

    let user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        }
    })
    if(!user){
        throw new Error("User not found!");
    }

    //we need to place this issue from the last issue so we need to find the 
    //index of its previous issue so...

    const lastIssue = await db.issue.findFirst({
        where:{
            projectId, status: data.status
        },
        orderBy:{
            order: "desc",
        }
    })

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await db.issue.create({
        data:{
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            projectId: projectId,
            sprintId: data.sprintId,
            reporterId: user.id,
            assigneeId: data.assigneeId || null,
            order: newOrder,
        },
        
        include:{
            assignee: true,
            reporter: true,
        }   
    });

    return issue;
}

export async function getIssuesForSprint(sprintId){
    const {userId, orgId} = await auth();

    if(!userId || !orgId){
        throw new Error("Unauthorized!");
    }

    const issues = await db.issue.findMany({
        where:{
            sprintId: sprintId,
        },
        orderBy:[
            {
                order: "asc",
            },
            {
                status: "asc",
            }
        ],
        include:{
            assignee: true,
            reporter: true,
        }
    })

    return issues;
}


// Now this is something the big operation there might be a lot of issues that are updated
// lot of cards that have their orders changed
// To handle such big operations we need to use a transaction concept

export async function updateIssueOrder(updatedIssues){
      const {userId, orgId} = await auth();

      if(!userId || !orgId){
        throw new Error("Unauthorized!");
      }

      await db.$transaction(async (prisma)=>{

        for(const issue of updatedIssues){
            await prisma.issue.update({
                where:{
                    id: issue.id,
                },
                data:{
                    order: issue.order,
                    status: issue.status,
                }
            });
        }
      });

      return {success:true};
}


export async function deleteIssue(issueId){

     const {userId, orgId} = await auth();

     if(!userId || !orgId){
        throw new error("Unauthorized!");
     }

     const user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        }
     })

     if(!user){
        throw new Error("User not found!");
     }


     const issue = await db.issue.findUnique({
        where:{
            id: issueId,
        },
        include:{
            project: true,
        }

     });

     if(!issue){
        throw new Error("Issue not found!");
     }

     if(issue.reporterId !== user.id && issue.assigneeId !== user.id){
        throw new Error("You are not authorized to delete this issue!");
     }

     await db.issue.delete({
        where:{
            id:issueId,
        }
     });

     return {success:true};
}


export async function updateIssue(issueId,data){
    const {userId, orgId} = await auth();

    if(!userId || !orgId){
        throw new Error("Unauthorized!");
    }

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        }
    });

    if(!user){
        throw new Error("User not found!");
    }

    try {

        const issue = await db.issue.findUnique({
            where:{
                id: issueId,
            },
            include:{
                 project:true,
            },

        });


        if(!issue){
            throw new Error("Issue not found!");
        }

        if(issue.reporterId !== user.id && issue.assigneeId !== user.id){
            throw new Error("You are not authorized to update this issue!");
        }


        const updateIssue = await db.issue.update({
            where:{
                id: issueId,
            },
            data:{
                status: data.status,
                priority: data.priority,
            },
            include:{
                assignee:true,
                reporter: true,
            }
        });

        return updateIssue;

    } catch (error) {
       throw new Error("Error updating issue" + error.message);
    }
}


export async function getUserIssues(userId){
    const {orgId} = await auth();
    if(!userId || !orgId){
        throw new Error("Unauthorized!");
    }


    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId,
        }
    })

    if(!user){
        throw new Error("User not found!");
    }

    const issues = await db.issue.findMany({
        where:{
            OR:[{assigneeId: user.id}, {reporterId: user.id}],
            project:{
                organizationId: orgId,
            },
        },

          include:{
            project:true,
            assignee:true,
            reporter:true

          },
          orderBy: {updatedAt: "desc"},
    });

    return issues;
}