"use client"

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {ArrowLeft, Home} from "lucide-react";
import useAuth from "@/hooks/auth/useAuth";
import RegisterForm from "@/components/auth/registerForm";
import ProfileDropdown from "@/components/profile/ProfileDropdown";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import LoginForm from "@/components/auth/loginForm";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import {useState} from "react";

const BackButton = ({className}: { className?: string }) => {
  const router = useRouter();
  // const canGoBack = !!history.length

  return (
    <Button variant="ghost" size="icon" className={className} onClick={() => router.back()}>
      <ArrowLeft/>
    </Button>
  )
}

const HomeButton = ({className}: { className?: string }) => {
  const router = useRouter();

  return (
    <Button variant="ghost" size="icon" className={className} onClick={() => router.push("/")}>
      <Home/>
    </Button>
  )
}

export default function Header() {
  const isOnline = useNetworkStatus();
  const {isLoggedIn, logout} = useAuth();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-10 h-17 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b"
      >
        <nav className="p-4 flex gap-2 items-center">
          <HomeButton/>
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
              <Button size="sm" variant="outline" onClick={() => setIsRegisterOpen(true)} disabled={!isOnline}>Register</Button>
              <Button size="sm" onClick={() => setIsLoginOpen(true)} disabled={!isOnline}>Login</Button>
            </>
          }
        </nav>
      </header>
      <RegisterForm isOpen={isRegisterOpen} setIsOpenAction={setIsRegisterOpen}/>
      <LoginForm isOpen={isLoginOpen} setIsOpenAction={setIsLoginOpen}/>
    </>
  )
}
