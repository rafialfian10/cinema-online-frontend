"use client";

// components next
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// components react
import { useEffect } from "react";

// types
import { UserAuth } from "@/types/userAuth";

export default function AuthUser(Component: any) {
  return function WithAuth(props: any) {
    // session
    const { data: session, status } = useSession();
    const userAuth: UserAuth | undefined = session?.user;

    const router = useRouter();

    useEffect(() => {
      if (status === "loading") {
        // Session is loading, do nothing
        return;
      }

      if (
        !userAuth ||
        userAuth?.data?.role !== "user" ||
        status === "unauthenticated"
      ) {
        // signIn();
        router.push("/");
        return;
      }
    }, [status, userAuth, router]);

    if (status === "loading") {
      return null;
    }

    if (!userAuth || userAuth?.data?.role !== "user") {
      return <p>Unauthorized. You are not admin</p>;
    }

    if (!session) {
      return null;
    }

    return <Component {...props} />;
  };
}
