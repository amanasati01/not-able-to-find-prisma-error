import { PrismaClient } from '@prisma/client'
import { date } from 'zod'
import jwt from 'jsonwebtoken'
import { warn } from 'console'
const prisma = new PrismaClient({log:['info','query','warn','error'],})
export async function signupUser(username : string , email : string , password : string) {
   const res = prisma.user.create({
    data:{
        username,
        email,
        password
    },
    select:{
        username : true,
        password : true,
        id : true,
        email: true
    }
   })
   return res
}
export async function isEmailPresent(email: string): Promise<{ email: string; password: string; id?: number } | null> {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            email: true,
            password: true,
            id: true
        },
    });
    return user;
}
export async function uploadBlog(id : number ,title : string , body : string) {
    const res =await prisma.blog.create({
        data:{
            title,
            body,
            user :{
                connect :{
                    id
                }
            }
        }
    })
    return res
}
export async function postOnId(id: number) {
    const posts = await prisma.blog.findMany({
        where: {
            userId: id
        },
        select: {
            title: true,
            body: true
        }
    });
    return posts;
}

export async function createBlog(userId:number,title : string , body : string) {
    const res =await prisma.blog.create({
        data :{
            title,
            body,
            userId

        },
        select :{
            id : true,
            title : true,
            body : true
        }
    })
    return res;
}
export async function postById(id:number){
    const post = await prisma.blog.findUnique({
        where :{
            id
        },
        select :{
            title : true,
            body : true
        }
    })
    return post
}
export async function updateBlog(id : number , body : string, title : string){
    try {
        const updatedBlog = await prisma.blog.update({
            where: {
                id: id, 
            },
            data: {
                title,
                body,
            },
            select: {
                id: true, 
                title: true,
                body: true,
            },
        });
        return updatedBlog;
    } catch (error) {
        console.error('Error updating blog:', error);
        return null;
    }
}
export async function deleteBlog(id:number) {
    const res = await prisma.blog.delete({
        where :{
            id
        },
        select:{
            title : true,
            body : true
        }
    })
    return res;
}