import { wait } from "./movies";

export default async function checkAuth() {
    const response = await fetch('http://localhost:5000/api/v1/check_auth', {
      cache: 'no-store',
    })

    console.log(response);
 
    if(!response.ok) {
       throw new Error('failed to fetch auth')
    }
    
    await wait(1000);
    return await response.json();
 }