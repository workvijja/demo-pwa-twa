"use client"

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ArrowLeft, Home} from "lucide-react";
import useAuth from "@/hooks/auth/useAuth";
import RegisterForm from "@/components/auth/registerForm";
import ProfileDropdown from "@/components/profile/ProfileDropdown";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import LoginForm from "@/components/auth/loginForm";

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
  const {isLoggedIn, logout} = useAuth();

  return (
    <header
      className="sticky top-0 left-0 right-0 z-10 h-17 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
    >
      <nav className="p-4 flex gap-2 items-center">
        <HomeButton />
        <BackButton className={"mr-auto"}/>
        {isLoggedIn ?
          <ProfileDropdown>
            <DropdownMenuItem
              onClick={() => {
                logout();
              }}
            >
              Log out
            </DropdownMenuItem>
          </ProfileDropdown>
          :
          <>
            <RegisterForm
              trigger={
                <Button size="sm" variant="outline">Register</Button>
              }
            />
            <LoginForm
              trigger={
                <Button size="sm">Login</Button>
              }
            />
          </>
        }
      </nav>
    </header>
  )
}
