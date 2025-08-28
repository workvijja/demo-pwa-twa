'use client';

import {useEffect, useState} from 'react';
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
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { useLocalStorage } from "@uidotdev/usehooks";

type ProfileData = {
  username: string;
  email: string;
  avatar: string;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const ProfileForm = ({onSuccess}: {onSuccess: () => void}) => {
  const [profile, setProfile] = useLocalStorage<ProfileData>("userProfile", {
    username: 'Guest User',
    email: 'guest@example.com',
    avatar: '',
  });
  const [editData, setEditData] = useState<ProfileData>({ ...profile });
  const [avatarPreview, setAvatarPreview] = useState('');

  // Load profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setEditData(parsedProfile);
      setAvatarPreview(parsedProfile.avatar);
    }
  }, []);

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

    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    onSuccess();
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
              {avatarPreview || profile.avatar ? (
                <AvatarImage src={avatarPreview || profile.avatar} alt="Profile" className="object-cover"/>
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

export default function ProfileDropdown() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profile] = useLocalStorage<ProfileData>("userProfile", {
    username: 'Guest User',
    email: 'guest@example.com',
    avatar: '',
  })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {profile.avatar ? (
                <AvatarImage src={profile.avatar} alt={profile.username}/>
              ) : (
                <AvatarFallback>{getInitials(profile.username)}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Drawer open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DrawerContent forceMount>
          <ProfileForm onSuccess={() => setIsEditOpen(false)}/>
        </DrawerContent>
      </Drawer>
    </>
  );
}
