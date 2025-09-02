'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import {Skeleton} from "@/components/ui/skeleton";
import {useAuth} from "@/provider/authProvider";
import {Button} from "@/components/ui/button";

const ProfileDropdown = dynamic(
  () => import("@/components/profile/ProfileDropdown"),
  {ssr: false, loading: () => <Skeleton className="size-8 rounded-full"/>}
);

export default function HomeLayout({children}: {children: React.ReactNode}) {
  const {user, login, logout, changeProfile} = useAuth();
  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <nav className="p-4 flex justify-between items-center">
          <div className="flex gap-4">
            <Link href="/v1">V1</Link>
            <Link href="/v2">V2</Link>
          </div>
          <div className="flex items-center gap-4">
            {user ?
              <ProfileDropdown user={user} logout={logout} changeProfile={changeProfile} />
              :
              <Button size="sm" onClick={login}>Login</Button>
            }
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  )
}
