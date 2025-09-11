'use client';

import {useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useProfileQuery} from "@/hooks/api/useUserQuery";
import ProfileForm from "@/components/profile/profileForm";


const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

export default function ProfileDropdown({children}: {children: React.ReactNode}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {data: user } = useProfileQuery()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {user?.avatar ? (
                <AvatarImage src={user?.avatar} alt={user?.username} className={"object-cover"}/>
              ) : (
                <AvatarFallback>{getInitials(user?.username || "")}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              Change Profile
            </DropdownMenuItem>
            {children}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {user && <ProfileForm user={user} isOpen={isEditOpen} setIsOpen={setIsEditOpen}/>}
      {/*<Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>*/}
      {/*  <DrawerContent forceMount>*/}
      {/*    <ProfileForm*/}
      {/*      user={user}*/}
      {/*      onSuccess={(data: UserData) => {*/}
      {/*        changeProfile(data)*/}
      {/*        setIsEditOpen(false)*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </DrawerContent>*/}
      {/*</Drawer>*/}
    </>
  );
}
