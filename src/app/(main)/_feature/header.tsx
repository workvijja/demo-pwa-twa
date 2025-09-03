"use client"

import {Button} from "@/components/ui/button";
import {useAuth} from "@/provider/authProvider";
import dynamic from "next/dynamic";
import {Skeleton} from "@/components/ui/skeleton";
import {useRouter} from "next/navigation";
import {ArrowLeft, Home} from "lucide-react";

const ProfileDropdown = dynamic(
  () => import("@/components/profile/ProfileDropdown"),
  {ssr: false, loading: () => <Skeleton className="size-8 rounded-full"/>}
);

const BackButton = ({className}: {className?: string}) => {
  const router = useRouter();
  // const canGoBack = !!history.length

  return (
    <Button variant="ghost" size="icon" className={className} onClick={() => router.back()}>
      <ArrowLeft/>
    </Button>
  )
}

const HomeButton = ({className}: {className?: string}) => {
  const router = useRouter();

  return (
    <Button variant="ghost" size="icon" className={className} onClick={() => router.push("/")}>
      <Home/>
    </Button>
  )
}

export default function Header() {
  const {user, login, logout, changeProfile} = useAuth();

  return (
    <header
      className="sticky top-0 left-0 right-0 z-10 h-17 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <nav className="p-4 flex gap-4 items-center">
        <HomeButton />
        <BackButton className={"mr-auto"}/>
        {user ?
          <ProfileDropdown user={user} logout={logout} changeProfile={changeProfile}/>
          :
          <Button size="sm" onClick={login}>Login</Button>
        }
      </nav>
    </header>
  )
}
