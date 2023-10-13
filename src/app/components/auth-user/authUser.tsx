'use client';

// components next
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// components react
import { useEffect } from 'react';

// types
import { UserAuth } from '@/types/userAuth';

export default function AuthUser(Component: any) {
    return function WithAuth(props: any) {
        // session
        const { data: session, status } = useSession();
        const userAuth: UserAuth | undefined = session?.user;
    
        useEffect(() => {
            if(userAuth?.data?.role !== 'user' || status === 'unauthenticated') {
                redirect('/');
            }
        }, [])
    
        if(!session) {
            return null;
        }
    
      return <Component { ...props } />
    } 
}


