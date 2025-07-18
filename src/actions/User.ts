'use server'
import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"

export const onAuthenticateUser = async()=> {
    try {
        const user = await currentUser();
        if(!user) {
            return {status: 403}
        }
        const userExists = await client.user.findUnique({
            where: {
                clerkId: user.id
            },
            include: {
                PurchasedProjects: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (userExists){
            return {status: 200, user: userExists}
        }
        const newUser = await client.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: user.firstName + " " + user.lastName,
                profileImage: user.imageUrl
            },
            include: {
                PurchasedProjects: {
                    select: {
                        id: true
                    }
                }
            }
        })
        if (newUser){
            return {status: 201, user: newUser}
        }
    } catch (error) {
        console.log("Error authenticating user:", error);
        return {status: 500}
    }
}