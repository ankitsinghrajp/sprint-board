import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function fetchOrganizationBySlug(slug) {
    const apiUrl = `https://api.clerk.dev/v1/organizations`;
    const apiKey = process.env.CLERK_SECRET_KEY;

    const response = await fetch(`${apiUrl}?slug=${slug}`, {
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
    });

    // Clone the response to log the error without consuming it
    const responseClone = response.clone();

    try {
        const errorText = await responseClone.text();
        // console.log("API Error Response:", errorText);
    } catch (err) {
        console.error("Error reading response text:", err);
    }

    if (!response.ok) {
        throw new Error(`Failed to fetch organization. Error: ${response.status}`);
    }

    const organizationsResponse = await response.json();
    const organizations = organizationsResponse.data || [];

    const organization = organizations.find((org) => org.slug === slug);

    if (!organization) {
        throw new Error("Organization not found.");
    }

    // Fetch organization memberships
    const membershipResponse = await fetch(
        `https://api.clerk.dev/v1/organizations/${organization.id}/memberships`,
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

    // Return organization along with membership data
    return {
        ...organization,
    };
}


export async function getProjects(orgId){

    const {userId} = await auth();
    if(!userId){
        throw new Error("Unauthorized!");
    }

    const user = await db.user.findUnique({
        where:{
            clerkUserId: userId
        },
    })

    if(!user){
         throw new Error("User not found!")
    }


    const projects = await db.project.findMany({
        where:{
            organizationId: orgId,
        },
        orderBy:{
            createdAt: "desc",
        },
    })

    return projects;

}

