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