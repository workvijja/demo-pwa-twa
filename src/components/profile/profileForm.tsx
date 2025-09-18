"use client"

import {useForm, useFormContext} from "react-hook-form";
import {GetUser, UpdateUser, updateUserSchema} from "@/schemas/auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useRef, useState} from "react";
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
import {DevTool} from "@hookform/devtools";
import {useMutation} from "@tanstack/react-query";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

const AvatarInput = () => {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const form = useFormContext();
  const username = form.watch("username");
  const avatarPreview = form.watch("avatar");

  const {mutate, isPending} = useMutation({
    mutationFn: (e: React.ChangeEvent<HTMLInputElement>) => new Promise((resolve, reject) => {
      try {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string)
          };
          reader.readAsDataURL(file);
        }
      } catch (e) {
        reject(e)
      }
    }),
    onSuccess: (data) => {
      form.setValue("avatar", data)
    },
    onError: (e) => {
      console.error(e)
    }
  })

  return (
    <div className="relative mx-auto">
      <Avatar className="h-20 w-20">
        {isPending ? (
          <AvatarFallback>
            <Loader2 className="animate-spin"/>
          </AvatarFallback>
        ) : avatarPreview ? (
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
                cameraRef.current?.click()
              }}
              className="cursor-pointer"
            >
              <Camera/>
              Take Photo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                galleryRef.current?.click()
              }}
              className="cursor-pointer"
            >
              <Images/>
              Choose from Library
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <input
        ref={cameraRef}
        className="hidden"
        type="file"
        multiple={false}
        accept="image/*"
        capture="user"
        onChange={(e) => mutate(e, {
          onSuccess: () => {
            if (cameraRef.current?.value) cameraRef.current.value = ""
          }
        })}
      />
      <input
        ref={galleryRef}
        className="hidden"
        type="file"
        multiple={false}
        accept="image/*"
        onChange={(e) => {
          console.debug(e)
          mutate(e, {
            onSuccess: () => {
              if (galleryRef.current?.value) galleryRef.current.value = ""
            }
          })
        }}
      />
    </div>
  )
}

export default function ProfileForm({isOpen, setIsOpen}: {
  isOpen: boolean,
  setIsOpen: (value: boolean) => void
}) {
  const {data: user, isLoading} = useProfileQuery()
  const {mutate: update, isPending} = useUpdateUserMutation()

  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user
  })

  useEffect(() => {
    if (user) form.reset(user)
  }, [user, form.reset]);

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
      <DrawerContent className="h-full max-h-[75dvh]">
        {
          isLoading ? (
            <Loader2 className="animate-spin"/>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full h-full max-w-sm flex flex-col">
                <div className="overflow-y-auto">
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
          )
        }
      </DrawerContent>
    </Drawer>
  )
}
