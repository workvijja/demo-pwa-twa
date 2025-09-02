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
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Camera, Images, Pencil} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import type {UserData} from "@/provider/authProvider";


const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const ProfileForm = ({user, onSuccess}: {user: UserData, onSuccess: (data: UserData) => void}) => {
  const [editData, setEditData] = useState<UserData>({ ...user });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setEditData(prev => ({
          ...prev,
          avatar: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedProfile = {
      ...editData,
      username: editData.username || 'Guest User',
      email: editData.email || 'guest@example.com',
    };

    onSuccess(updatedProfile);
  };

  return (
    <div className="mx-auto max-w-sm min-h-[75dvh] flex flex-col">
      <DrawerHeader>
        <DrawerTitle>Edit Profile</DrawerTitle>
        <DrawerDescription>
          Update your profile information. Click save when you're done.
        </DrawerDescription>
      </DrawerHeader>
      <div className="grid gap-4 p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              {avatarPreview || user.avatar ? (
                <AvatarImage src={avatarPreview || user.avatar} alt="Profile" className="object-cover"/>
              ) : (
                <AvatarFallback>{getInitials(editData.username)}</AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    className="size-8 rounded-full"
                  >
                    <Pencil className="size-4"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.capture = 'environment';
                      input.onchange = (e) => handleAvatarChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                      input.click();
                    }}
                    className="cursor-pointer"
                  >
                    <Camera/>
                    Take Photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = false;
                      input.onchange = (e) => handleAvatarChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                      input.click();
                    }}
                    className="cursor-pointer"
                  >
                    <Images/>
                    Choose from Library
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={editData.username}
            onChange={(e) =>
              setEditData({...editData, username: e.target.value})
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={editData.email}
            onChange={(e) =>
              setEditData({...editData, email: e.target.value})
            }
          />
        </div>
      </div>
      <DrawerFooter>
        <Button type="submit" onClick={handleSave}>
          Save changes
        </Button>
      </DrawerFooter>
    </div>
)
}

export default function ProfileDropdown({user, logout, changeProfile}: {user: UserData, logout: () => void, changeProfile: (profile: UserData) => void}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.username} className={"object-cover"}/>
              ) : (
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DrawerContent forceMount>
          <ProfileForm
            user={user}
            onSuccess={(data: UserData) => {
              changeProfile(data)
              setIsEditOpen(false)
            }}
          />
        </DrawerContent>
      </Drawer>
    </>
  );
}
