"use server";

import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./User";

export const getAllProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user) {
      return { status: 403, message: "User not authenticated" };
    }
    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    if (projects.length === 0) {
      return { status: 404, message: "No projects found" };
    }
    return {status: 200, data: projects}
  } catch (error) {
    console.log("Error fetching projects:", error);
    return { status: 500, message: "Internal server error" };
  }
};

export const getRecentProjects = async () => {
  try {
    const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user) {
      return { status: 403, message: "User not authenticated" };
    }
    const projects = await client.project.findMany({
      where: {
        userId: checkUser.user.id,
        isDeleted: false,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });
    if (projects.length === 0) {
      return { status: 404, error: "No recent projects available" };
    }
    return { status: 200, data: projects };
  } catch (error) {
    console.log("Error fetching projects:", error);
    return { status: 500, message: "Internal server error" };
  }
};


export const recoverProject = async (projectId: string) => {
    try {
       const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user) {
      return { status: 403, message: "User not authenticated" };
    }
    const project = await client.project.findUnique({
      where: {
        id: projectId,
        userId: checkUser.user.id
      }
    })
    if(!project){
      return {status: 403, message: 'You cannot recover a proeject that does not belong to you'}
    }
    const projectUpdated = await client.project.update({
      where: {
        id: projectId
      },
      data: {
        isDeleted: false
      }
    })
    return {status: 200, message: 'Project restored successfully', data: projectUpdated}
    } catch (error) {
      console.log("Error recovring projects:", error);
    return { status: 500, message: "Internal server error" };
      
    }
}

export const deleteProject = async (projectId: string) => {
    try {
       const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user) {
      return { status: 403, message: "User not authenticated" };
    }
    const project = await client.project.findUnique({
      where: {
        id: projectId,
        userId: checkUser.user.id
      }
    })
    if(!project){
      return {status: 403, message: 'You cannot delte a proeject that does not belong to you'}
    }
    const projectUpdated = await client.project.update({
      where: {
        id: projectId
      },
      data: {
        isDeleted: true
      }
    })
    return {status: 200, message: 'Project restored successfully', data: projectUpdated}
    } catch (error) {
      console.log("Error recovring projects:", error);
    return { status: 500, message: "Internal server error" };
      
    }
}