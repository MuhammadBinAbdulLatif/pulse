"use server";

import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./User";
import { OutlineCard } from "@/lib/types";

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

export const createProject = async(title: string, outlines: OutlineCard[])=> {
  try {
    if(!title || !outlines || outlines.length === 0){
      return {status: 400, error: 'Title and outlines are required'}
    }
    const allOutlines = outlines.map((outline)=> (
      outline.title 
    ))
     const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user) {
      return { status: 403, message: "User not authenticated" };
    }
    const project = await client.project.create({
      data: {
        title, 
        outlines: allOutlines,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: checkUser.user.id
      }
    }) 
    if(!project){
      return {status: 500, error: 'failed to create project '}
    }
    return {status: 200, data: project}

  } catch (error) {
    console.log("Error creating project:", error);
    return { status: 500, message: "Internal server error" };
  }
}

export const getProjectById = async(id:string)=> {
   try {
    const checkUser = await onAuthenticateUser();
    if (checkUser?.status !== 200 || !checkUser?.user) {
      return { status: 403, message: "User not authenticated" };
    }
    const project = await client.project.findUnique({
      where: {
        id: id,
        userId: checkUser.user.id,
      }
    })
    if(!project){
      return {
        status: 403, message: 'You cannot access a project that belongs to someone else'
      }
    }
    return {
      status: 200, data: project
    }
   } catch (error) {
    console.log("Error fetching project:", error);
    return { status: 500, message: "Internal server error" };
   }
}