"use client"

import {useForm, useFormContext} from "react-hook-form";
import {GetUser, UpdateUser, updateUserSchema} from "@/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Camera, Images, Loader2, Pencil} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useProfileQuery, useUpdateUserMutation} from "@/hooks/api/useUserQuery";
import {toast} from "sonner";
import {APIError} from "@/lib/axios";
import {AxiosError} from "axios";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const AvatarInput = () => {
  const form = useFormContext();
  const username = form.watch("username");
  const avatarPreview = form.watch("avatar");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatar", reader.result as string)
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative mx-auto">
      <Avatar className="h-20 w-20">
        {avatarPreview ? (
          <AvatarImage src={avatarPreview} alt="Profile" className="object-cover"/>
        ) : (
          <AvatarFallback>{getInitials(username || "")}</AvatarFallback>
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
                input.capture = 'user';
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
  )
}

export default function ProfileForm({user, isOpen, setIsOpen}: {user: GetUser, isOpen: boolean, setIsOpen: (value: boolean) => void}) {
  // const [isOpen, setIsOpen] = useState(false)
  const {mutate: update, isPending} = useUpdateUserMutation()

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user
  })

  const onSubmit = (data: UpdateUser) => {
    if (!user?.id) return;
    update({...data, id: user.id}, {
      onSuccess: () => {
        form.reset()
        toast.success("Update Profile successfully");
        setIsOpen(false)
      },
      onError: (e) => {
        const err = e as AxiosError<APIError>
        toast.error("Update Profile failed", {
          description: err.response?.data.error || err.message
        });
      }
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-sm min-h-[75dvh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Change Profile</DrawerTitle>
              <DrawerDescription>
                fill your information
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 p-4">
              <AvatarInput/>
              <FormField
                name={"username"}
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Guest User" {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={isPending}>
                {
                  isPending ? (
                    <>
                      Changing profile...
                      <Loader2 className="animate-spin"/>
                    </>
                  ) : "Change Profile"
                }
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
