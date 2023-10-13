import { wait } from "./movies";

export default async function getUsers() {
    const response = await fetch('http://localhost:5000/api/v1/users', {
      cache: 'no-store',
    })
 
    if(!response.ok) {
       throw new Error('failed to fetch users')
    }
    
    await wait(1000)
    return await response.json()
 }

 export async function getUser(id: number) {
    const response = await fetch(`http://localhost:5000/api/v1/user/${id}`, {
      cache: 'no-store',
    })
 
    if(!response.ok) {
       throw new Error('failed to fetch users')
    }
    
    await wait(1000)
    return await response.json() 
 }